"use client";

import { useCallback, useEffect, useState } from "react";

export type Posicao = {
  ticker: string;
  quantidade: number;
  precoMedio: number;
  proventoMensalPorCota: number;
};

const STORAGE_KEY = "fiibrasil:carteira:v1";

function normalizeTicker(raw: string): string {
  return raw.trim().toUpperCase().replace(/\.SA$/, "");
}

function read(): Posicao[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((p): p is Posicao => typeof p?.ticker === "string")
      .map((p) => ({
        ticker: normalizeTicker(p.ticker),
        quantidade: Number(p.quantidade) || 0,
        precoMedio: Number(p.precoMedio) || 0,
        proventoMensalPorCota: Number(p.proventoMensalPorCota) || 0,
      }));
  } catch {
    return [];
  }
}

function write(posicoes: Posicao[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posicoes));
  window.dispatchEvent(new CustomEvent("fiibrasil:carteira:update"));
}

export function useCarteira() {
  const [posicoes, setPosicoes] = useState<Posicao[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPosicoes(read());
    setHydrated(true);

    const onUpdate = () => setPosicoes(read());
    window.addEventListener("fiibrasil:carteira:update", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("fiibrasil:carteira:update", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const salvar = useCallback((next: Posicao[]) => {
    const sanitized = next.map((p) => ({
      ...p,
      ticker: normalizeTicker(p.ticker),
    }));
    setPosicoes(sanitized);
    write(sanitized);
  }, []);

  const adicionar = useCallback(
    (p: Posicao) => {
      const t = normalizeTicker(p.ticker);
      if (!t) return;
      const atual = read();
      const idx = atual.findIndex((x) => x.ticker === t);
      if (idx >= 0) {
        atual[idx] = { ...p, ticker: t };
      } else {
        atual.push({ ...p, ticker: t });
      }
      write(atual);
      setPosicoes(atual);
    },
    []
  );

  const remover = useCallback((ticker: string) => {
    const t = normalizeTicker(ticker);
    const atual = read().filter((p) => p.ticker !== t);
    write(atual);
    setPosicoes(atual);
  }, []);

  const limpar = useCallback(() => {
    write([]);
    setPosicoes([]);
  }, []);

  const substituir = useCallback((novas: Posicao[]) => {
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
        });
      } else {
        dedup.set(t, { ...p, ticker: t });
      }
    }
    const arr = Array.from(dedup.values());
    write(arr);
    setPosicoes(arr);
  }, []);

  return {
    posicoes,
    hydrated,
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
