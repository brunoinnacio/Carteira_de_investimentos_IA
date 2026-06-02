"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  classificarAcao,
  ACOES,
  ACOES_SNAPSHOT_DATE,
  SETORES,
  type ClassificacaoAcao,
  type Setor,
} from "@/data/acoes";
import { useCotacoes } from "@/lib/cotacoes";
import { brlPrecise, percent } from "@/lib/format";

type Ordenacao = "dy-desc" | "pl-asc" | "preco-asc" | "ticker";

type LinhaCalculada = {
  ticker: string;
  nome: string;
  setor: Setor;
  preco: number | null;
  pl: number | null;
  dyAnual: number | null;
  dividendoAnual: number;
  classificacao: ClassificacaoAcao;
};

const CLASSE_TONE: Record<ClassificacaoAcao, string> = {
  Atrativo: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  Justo: "bg-amber-50 text-amber-800 ring-amber-200",
  Caro: "bg-rose-50 text-rose-800 ring-rose-200",
  "Sem preço": "bg-slate-100 text-slate-500 ring-slate-200",
};

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function ScreenerAcoes() {
  const tickers = useMemo(() => ACOES.map((a) => a.ticker), []);
  const { cotacoes, carregando, erro, atualizadoEm, recarregar } =
    useCotacoes(tickers);

  const [busca, setBusca] = useState("");
  const [setores, setSetores] = useState<Set<Setor>>(new Set());
  const [dyMin, setDyMin] = useState(0);
  const [plMax, setPlMax] = useState(0);
  const [soComPreco, setSoComPreco] = useState(false);
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("dy-desc");

  const linhas = useMemo<LinhaCalculada[]>(() => {
    return ACOES.map((a) => {
      const preco = cotacoes[a.ticker]?.preco ?? null;
      const pl = preco && a.lpa > 0 ? preco / a.lpa : null;
      const dyAnual =
        preco && preco > 0 ? (a.dividendoAnual / preco) * 100 : null;
      return {
        ticker: a.ticker,
        nome: a.nome,
        setor: a.setor,
        preco,
        pl,
        dyAnual,
        dividendoAnual: a.dividendoAnual,
        classificacao: classificarAcao(pl, dyAnual),
      };
    });
  }, [cotacoes]);

  const filtradas = useMemo(() => {
    const q = busca.trim().toUpperCase();
    const arr = linhas.filter((l) => {
      if (q && !l.ticker.includes(q) && !l.nome.toUpperCase().includes(q))
        return false;
      if (setores.size > 0 && !setores.has(l.setor)) return false;
      if (soComPreco && l.preco === null) return false;
      if (dyMin > 0 && (l.dyAnual === null || l.dyAnual < dyMin)) return false;
      if (plMax > 0 && (l.pl === null || l.pl <= 0 || l.pl > plMax))
        return false;
      return true;
    });

    arr.sort((a, b) => {
      switch (ordenacao) {
        case "dy-desc":
          return (b.dyAnual ?? -1) - (a.dyAnual ?? -1);
        case "pl-asc":
          return (a.pl ?? 9999) - (b.pl ?? 9999);
        case "preco-asc":
          return (a.preco ?? 1e9) - (b.preco ?? 1e9);
        case "ticker":
          return a.ticker.localeCompare(b.ticker);
      }
    });
    return arr;
  }, [linhas, busca, setores, soComPreco, dyMin, plMax, ordenacao]);

  const atrativos = filtradas.filter(
    (l) => l.classificacao === "Atrativo"
  ).length;

  function toggleSetor(s: Setor) {
    setSetores((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  function limparFiltros() {
    setBusca("");
    setSetores(new Set());
    setDyMin(0);
    setPlMax(0);
    setSoComPreco(false);
    setOrdenacao("dy-desc");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Ações na base
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            {ACOES.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Resultado do filtro
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            {filtradas.length}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
            Atrativas pelo critério
          </p>
          <p className="mt-1 text-xl font-semibold text-emerald-900 sm:text-2xl">
            {atrativos}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600">
                Buscar ticker ou nome
              </span>
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Ex: BBAS, banco..."
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600">
                Dividend Yield mínimo (a.a.)
              </span>
              <select
                value={dyMin}
                onChange={(e) => setDyMin(Number(e.target.value))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value={0}>Qualquer</option>
                <option value={3}>≥ 3%</option>
                <option value={5}>≥ 5%</option>
                <option value={6}>≥ 6%</option>
                <option value={8}>≥ 8%</option>
                <option value={10}>≥ 10%</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600">
                P/L máximo
              </span>
              <select
                value={plMax}
                onChange={(e) => setPlMax(Number(e.target.value))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value={0}>Qualquer</option>
                <option value={6}>≤ 6</option>
                <option value={8}>≤ 8</option>
                <option value={10}>≤ 10</option>
                <option value={15}>≤ 15</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600">
                Ordenar por
              </span>
              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="dy-desc">Maior Dividend Yield</option>
                <option value="pl-asc">Menor P/L</option>
                <option value="preco-asc">Menor preço</option>
                <option value="ticker">Ticker (A-Z)</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {SETORES.map((s) => {
              const ativo = setores.has(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSetor(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition ${
                    ativo
                      ? "bg-blue-600 text-white ring-blue-600"
                      : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={soComPreco}
                onChange={(e) => setSoComPreco(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Só com cotação disponível
            </label>
            <button
              type="button"
              onClick={limparFiltros}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-500">
            {carregando
              ? "Atualizando cotações..."
              : erro
              ? `Falha ao buscar cotações (${erro}).`
              : atualizadoEm
              ? `Preço ao vivo às ${formatTime(atualizadoEm)} · Yahoo Finance`
              : "Sem cotações."}
          </p>
          <button
            type="button"
            onClick={recarregar}
            disabled={carregando}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className={`h-3.5 w-3.5 ${carregando ? "animate-spin" : ""}`}
              aria-hidden
            >
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />
            </svg>
            Atualizar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Ação</th>
                <th className="px-4 py-3">Setor</th>
                <th className="px-4 py-3 text-right">Preço</th>
                <th className="px-4 py-3 text-right">P/L</th>
                <th className="px-4 py-3 text-right">DY (a.a.)</th>
                <th className="px-4 py-3 text-right">Div./ação (ano)</th>
                <th className="px-4 py-3">Classificação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtradas.map((l) => (
                <tr key={l.ticker} className="text-slate-700">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">
                      {l.ticker}
                    </div>
                    <div className="text-xs text-slate-500">{l.nome}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-600">{l.setor}</span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {l.preco !== null ? (
                      brlPrecise(l.preco)
                    ) : carregando ? (
                      <span className="text-slate-400">…</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {l.pl !== null && l.pl > 0 ? (
                      l.pl.toLocaleString("pt-BR", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-blue-700">
                    {l.dyAnual !== null ? (
                      percent(l.dyAnual)
                    ) : (
                      <span className="font-normal text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {brlPrecise(l.dividendoAnual)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${
                        CLASSE_TONE[l.classificacao]
                      }`}
                    >
                      {l.classificacao}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtradas.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">
              Nenhuma ação passou nesse filtro. Afrouxe os critérios.
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
        <p>
          <span className="font-semibold text-slate-800">Como ler isto.</span>{" "}
          O <strong>preço</strong> é ao vivo (Yahoo Finance, com possível atraso
          de minutos). <strong>P/L</strong> = preço ÷ lucro por ação (quanto
          menor, mais barata em relação ao lucro). <strong>DY (a.a.)</strong> =
          dividendos dos últimos 12 meses ÷ preço. A{" "}
          <strong>classificação</strong> segue uma regra fixa e transparente
          (Atrativo: DY ≥ 6% e P/L entre 0 e 12; Caro: P/L ≥ 20, sem lucro ou DY
          &lt; 3%; Justo: o resto).
        </p>
        <p className="mt-2">
          Dividendos passados <strong>não garantem</strong> dividendos futuros —
          empresas cortam proventos em anos ruins. Dividendo por ação e lucro
          são uma fotografia da curadoria de{" "}
          {new Date(ACOES_SNAPSHOT_DATE).toLocaleDateString("pt-BR")} e podem
          estar desatualizados. Isto é conteúdo educacional, não recomendação.
          Veja o{" "}
          <Link
            href="/aviso-legal"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            aviso legal
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
