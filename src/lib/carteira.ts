"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type Classe = "fii" | "acao" | "rendaFixa";

export type Posicao = {
  ticker: string;
  quantidade: number;
  precoMedio: number;
  proventoMensalPorCota: number;
  classe?: Classe;
  // Usado por renda fixa (Tesouro, CDB...), que nao tem ticker de mercado.
  nome?: string;
};

export type FonteCarteira = "local" | "nuvem";

export const CLASSE_LABEL: Record<Classe, string> = {
  fii: "FII",
  acao: "Ação",
  rendaFixa: "Renda fixa",
};

const STORAGE_KEY = "fiibrasil:carteira:v1";
const TABELA = "carteira_posicoes";

function normalizeTicker(raw: string): string {
  return raw.trim().toUpperCase().replace(/\.SA$/, "");
}

// Quando a classe nao foi informada (dados antigos / importacao), inferimos
// pelo padrao do ticker. XXXX11/12 -> FII; 4 letras + digito -> acao.
export function inferirClasse(ticker: string): Classe {
  const t = normalizeTicker(ticker);
  if (/^[A-Z]{4}1[12]$/.test(t)) return "fii";
  if (/^[A-Z]{4}([3-9]|3[4-9])$/.test(t)) return "acao";
  return "fii";
}

export function classeDe(p: Posicao): Classe {
  return p.classe ?? inferirClasse(p.ticker);
}

// --- Armazenamento local (anônimo) ---

function read(): Posicao[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((p): p is Posicao => typeof p?.ticker === "string")
      .map((p) => {
        const ticker = normalizeTicker(p.ticker);
        return {
          ticker,
          quantidade: Number(p.quantidade) || 0,
          precoMedio: Number(p.precoMedio) || 0,
          proventoMensalPorCota: Number(p.proventoMensalPorCota) || 0,
          classe: (p.classe as Classe) ?? inferirClasse(ticker),
          nome: typeof p.nome === "string" ? p.nome : undefined,
        };
      });
  } catch {
    return [];
  }
}

function write(posicoes: Posicao[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posicoes));
  window.dispatchEvent(new CustomEvent("fiibrasil:carteira:update"));
}

function clearLocal() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("fiibrasil:carteira:update"));
}

function dedupMerge(novas: Posicao[]): Posicao[] {
  const dedup = new Map<string, Posicao>();
  for (const p of novas) {
    const t = normalizeTicker(p.ticker);
    if (!t) continue;
    const existente = dedup.get(t);
    if (existente) {
      const qtdTotal = existente.quantidade + p.quantidade;
      const custoTotal =
        existente.precoMedio * existente.quantidade +
        p.precoMedio * p.quantidade;
      dedup.set(t, {
        ticker: t,
        quantidade: qtdTotal,
        precoMedio: qtdTotal > 0 ? custoTotal / qtdTotal : 0,
        proventoMensalPorCota:
          p.proventoMensalPorCota || existente.proventoMensalPorCota,
        classe: p.classe ?? existente.classe ?? inferirClasse(t),
        nome: p.nome ?? existente.nome,
      });
    } else {
      dedup.set(t, { ...p, ticker: t, classe: classeDe({ ...p, ticker: t }) });
    }
  }
  return Array.from(dedup.values());
}

// --- Armazenamento na nuvem (Supabase, quando logado) ---

type Row = {
  ticker: string;
  quantidade: number | string;
  preco_medio: number | string;
  provento_mensal_por_cota: number | string;
  classe?: string | null;
  nome?: string | null;
};

async function cloudRead(
  supabase: SupabaseClient,
  userId: string
): Promise<Posicao[]> {
  const { data, error } = await supabase
    .from(TABELA)
    .select("ticker,quantidade,preco_medio,provento_mensal_por_cota,classe,nome")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((row: Row) => {
    const ticker = normalizeTicker(row.ticker);
    return {
      ticker,
      quantidade: Number(row.quantidade) || 0,
      precoMedio: Number(row.preco_medio) || 0,
      proventoMensalPorCota: Number(row.provento_mensal_por_cota) || 0,
      classe: (row.classe as Classe) || inferirClasse(ticker),
      nome: row.nome ?? undefined,
    };
  });
}

function toRow(userId: string, p: Posicao) {
  return {
    user_id: userId,
    ticker: normalizeTicker(p.ticker),
    quantidade: p.quantidade,
    preco_medio: p.precoMedio,
    provento_mensal_por_cota: p.proventoMensalPorCota,
    classe: classeDe(p),
    nome: p.nome ?? null,
  };
}

async function cloudUpsert(
  supabase: SupabaseClient,
  userId: string,
  posicoes: Posicao[]
) {
  if (posicoes.length === 0) return;
  const { error } = await supabase
    .from(TABELA)
    .upsert(
      posicoes.map((p) => toRow(userId, p)),
      { onConflict: "user_id,ticker" }
    );
  if (error) throw error;
}

async function cloudDelete(
  supabase: SupabaseClient,
  userId: string,
  ticker: string
) {
  const { error } = await supabase
    .from(TABELA)
    .delete()
    .eq("user_id", userId)
    .eq("ticker", normalizeTicker(ticker));
  if (error) throw error;
}

async function cloudReplaceAll(
  supabase: SupabaseClient,
  userId: string,
  posicoes: Posicao[]
) {
  const { error: delErr } = await supabase
    .from(TABELA)
    .delete()
    .eq("user_id", userId);
  if (delErr) throw delErr;
  await cloudUpsert(supabase, userId, posicoes);
}

export function useCarteira() {
  const [posicoes, setPosicoes] = useState<Posicao[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [fonte, setFonte] = useState<FonteCarteira>("local");
  const [sincronizando, setSincronizando] = useState(false);

  const posicoesRef = useRef<Posicao[]>([]);
  const userIdRef = useRef<string | null>(null);
  const supabaseRef = useRef<SupabaseClient | null>(null);

  const aplicar = useCallback((next: Posicao[]) => {
    posicoesRef.current = next;
    setPosicoes(next);
  }, []);

  // Roda a persistência no destino ativo (nuvem se logado, local se anônimo).
  const persistir = useCallback(
    (fn: (supabase: SupabaseClient, userId: string) => Promise<void>) => {
      const userId = userIdRef.current;
      const supabase = supabaseRef.current;
      if (!userId || !supabase) {
        write(posicoesRef.current);
        return;
      }
      setSincronizando(true);
      fn(supabase, userId)
        .catch((e) => {
          console.error("Falha ao sincronizar carteira:", e);
        })
        .finally(() => setSincronizando(false));
    },
    []
  );

  useEffect(() => {
    aplicar(read());
    setHydrated(true);

    const onLocalUpdate = () => {
      if (!userIdRef.current) aplicar(read());
    };
    window.addEventListener("fiibrasil:carteira:update", onLocalUpdate);
    window.addEventListener("storage", onLocalUpdate);

    let supabase: SupabaseClient | null = null;
    try {
      supabase = createSupabaseBrowserClient();
      supabaseRef.current = supabase;
    } catch {
      supabase = null;
    }

    let mounted = true;

    async function entrarNaConta(userId: string) {
      userIdRef.current = userId;
      if (!supabase) return;
      setSincronizando(true);
      try {
        const local = read();
        let cloud = await cloudRead(supabase, userId);
        // Migração: primeira vez logado com dados locais e nuvem vazia.
        if (cloud.length === 0 && local.length > 0) {
          await cloudReplaceAll(supabase, userId, local);
          cloud = local;
          clearLocal();
        }
        if (!mounted) return;
        setFonte("nuvem");
        aplicar(cloud);
      } catch (e) {
        console.error("Carteira: erro ao carregar da nuvem, usando local.", e);
        if (!mounted) return;
        setFonte("local");
        aplicar(read());
      } finally {
        if (mounted) setSincronizando(false);
      }
    }

    function sairDaConta() {
      userIdRef.current = null;
      setFonte("local");
      aplicar(read());
    }

    if (supabase) {
      supabase.auth
        .getUser()
        .then(({ data }) => {
          if (!mounted) return;
          if (data.user) entrarNaConta(data.user.id);
        })
        .catch(() => {});

      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        if (!mounted) return;
        if (session?.user) {
          if (userIdRef.current !== session.user.id) {
            entrarNaConta(session.user.id);
          }
        } else {
          sairDaConta();
        }
      });

      return () => {
        mounted = false;
        sub.subscription.unsubscribe();
        window.removeEventListener("fiibrasil:carteira:update", onLocalUpdate);
        window.removeEventListener("storage", onLocalUpdate);
      };
    }

    return () => {
      mounted = false;
      window.removeEventListener("fiibrasil:carteira:update", onLocalUpdate);
      window.removeEventListener("storage", onLocalUpdate);
    };
  }, [aplicar]);

  const salvar = useCallback(
    (next: Posicao[]) => {
      const sanitized = next.map((p) => ({
        ...p,
        ticker: normalizeTicker(p.ticker),
      }));
      aplicar(sanitized);
      persistir((s, u) => cloudReplaceAll(s, u, sanitized));
    },
    [aplicar, persistir]
  );

  const adicionar = useCallback(
    (p: Posicao) => {
      const t = normalizeTicker(p.ticker);
      if (!t) return;
      const atual = [...posicoesRef.current];
      const idx = atual.findIndex((x) => x.ticker === t);
      if (idx >= 0) atual[idx] = { ...p, ticker: t };
      else atual.push({ ...p, ticker: t });
      aplicar(atual);
      persistir((s, u) => cloudUpsert(s, u, [{ ...p, ticker: t }]));
    },
    [aplicar, persistir]
  );

  const remover = useCallback(
    (ticker: string) => {
      const t = normalizeTicker(ticker);
      const atual = posicoesRef.current.filter((p) => p.ticker !== t);
      aplicar(atual);
      persistir((s, u) => cloudDelete(s, u, t));
    },
    [aplicar, persistir]
  );

  const limpar = useCallback(() => {
    aplicar([]);
    persistir((s, u) => cloudReplaceAll(s, u, []));
  }, [aplicar, persistir]);

  const substituir = useCallback(
    (novas: Posicao[]) => {
      const arr = dedupMerge(novas);
      aplicar(arr);
      persistir((s, u) => cloudReplaceAll(s, u, arr));
    },
    [aplicar, persistir]
  );

  return {
    posicoes,
    hydrated,
    fonte,
    sincronizando,
    salvar,
    adicionar,
    remover,
    limpar,
    substituir,
  };
}

export function totaisCarteira(posicoes: Posicao[]) {
  const investido = posicoes.reduce(
    (a, p) => a + p.precoMedio * p.quantidade,
    0
  );
  const rendaMensal = posicoes.reduce(
    (a, p) => a + p.proventoMensalPorCota * p.quantidade,
    0
  );
  return { investido, rendaMensal };
}

// Valor investido por classe + total, para a visao consolidada de alocacao.
export function totaisPorClasse(posicoes: Posicao[]) {
  const porClasse: Record<Classe, number> = { fii: 0, acao: 0, rendaFixa: 0 };
  for (const p of posicoes) {
    porClasse[classeDe(p)] += p.precoMedio * p.quantidade;
  }
  const total = porClasse.fii + porClasse.acao + porClasse.rendaFixa;
  return { porClasse, total };
}

// Renda fixa nao tem ticker de mercado; geramos uma chave a partir do nome.
export function rfKey(nome: string): string {
  return `RF:${nome.trim().toUpperCase()}`.slice(0, 60);
}
