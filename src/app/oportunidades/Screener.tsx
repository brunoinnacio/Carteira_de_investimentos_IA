"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  classificar,
  FIIS,
  SEGMENTOS,
  SNAPSHOT_DATE,
  type Classificacao,
  type Segmento,
} from "@/data/fiis";
import { useCotacoes } from "@/lib/cotacoes";
import { brlPrecise, percent } from "@/lib/format";

type Ordenacao = "dy-desc" | "pvp-asc" | "preco-asc" | "ticker";

type LinhaCalculada = {
  ticker: string;
  nome: string;
  segmento: Segmento;
  liquidez: string;
  preco: number | null;
  pvp: number | null;
  dyAnual: number | null;
  proventoMensal: number;
  classificacao: Classificacao;
};

const CLASSE_TONE: Record<Classificacao, string> = {
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

export function Screener() {
  const tickers = useMemo(() => FIIS.map((f) => f.ticker), []);
  const { cotacoes, carregando, erro, atualizadoEm, recarregar } =
    useCotacoes(tickers);

  const [busca, setBusca] = useState("");
  const [segmentos, setSegmentos] = useState<Set<Segmento>>(new Set());
  const [dyMin, setDyMin] = useState(0);
  const [pvpMax, setPvpMax] = useState(0);
  const [soComPreco, setSoComPreco] = useState(false);
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("dy-desc");

  const linhas = useMemo<LinhaCalculada[]>(() => {
    return FIIS.map((f) => {
      const preco = cotacoes[f.ticker]?.preco ?? null;
      const pvp = preco && f.vpa > 0 ? preco / f.vpa : null;
      const dyAnual =
        preco && preco > 0 ? ((f.proventoMensal * 12) / preco) * 100 : null;
      return {
        ticker: f.ticker,
        nome: f.nome,
        segmento: f.segmento,
        liquidez: f.liquidez,
        preco,
        pvp,
        dyAnual,
        proventoMensal: f.proventoMensal,
        classificacao: classificar(pvp, dyAnual),
      };
    });
  }, [cotacoes]);

  const filtradas = useMemo(() => {
    const q = busca.trim().toUpperCase();
    const arr = linhas.filter((l) => {
      if (q && !l.ticker.includes(q) && !l.nome.toUpperCase().includes(q))
        return false;
      if (segmentos.size > 0 && !segmentos.has(l.segmento)) return false;
      if (soComPreco && l.preco === null) return false;
      if (dyMin > 0 && (l.dyAnual === null || l.dyAnual < dyMin)) return false;
      if (pvpMax > 0 && (l.pvp === null || l.pvp > pvpMax)) return false;
      return true;
    });

    arr.sort((a, b) => {
      switch (ordenacao) {
        case "dy-desc":
          return (b.dyAnual ?? -1) - (a.dyAnual ?? -1);
        case "pvp-asc":
          return (a.pvp ?? 99) - (b.pvp ?? 99);
        case "preco-asc":
          return (a.preco ?? 1e9) - (b.preco ?? 1e9);
        case "ticker":
          return a.ticker.localeCompare(b.ticker);
      }
    });
    return arr;
  }, [linhas, busca, segmentos, soComPreco, dyMin, pvpMax, ordenacao]);

  const atrativos = filtradas.filter(
    (l) => l.classificacao === "Atrativo"
  ).length;

  function toggleSegmento(s: Segmento) {
    setSegmentos((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  function limparFiltros() {
    setBusca("");
    setSegmentos(new Set());
    setDyMin(0);
    setPvpMax(0);
    setSoComPreco(false);
    setOrdenacao("dy-desc");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            FIIs na base
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            {FIIS.length}
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
            Atrativos pelo critério
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
                placeholder="Ex: MXRF, logística..."
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
                <option value={7}>≥ 7%</option>
                <option value={8}>≥ 8%</option>
                <option value={9}>≥ 9%</option>
                <option value={10}>≥ 10%</option>
                <option value={12}>≥ 12%</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600">
                P/VP máximo
              </span>
              <select
                value={pvpMax}
                onChange={(e) => setPvpMax(Number(e.target.value))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value={0}>Qualquer</option>
                <option value={0.9}>≤ 0,90</option>
                <option value={0.95}>≤ 0,95</option>
                <option value={1.0}>≤ 1,00</option>
                <option value={1.05}>≤ 1,05</option>
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
                <option value="pvp-asc">Menor P/VP</option>
                <option value="preco-asc">Menor preço</option>
                <option value="ticker">Ticker (A-Z)</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {SEGMENTOS.map((s) => {
              const ativo = segmentos.has(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSegmento(s)}
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
                <th className="px-4 py-3">FII</th>
                <th className="px-4 py-3">Segmento</th>
                <th className="px-4 py-3 text-right">Preço</th>
                <th className="px-4 py-3 text-right">P/VP</th>
                <th className="px-4 py-3 text-right">DY (a.a.)</th>
                <th className="px-4 py-3 text-right">Provento/cota</th>
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
                    <span className="text-xs text-slate-600">{l.segmento}</span>
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
                    {l.pvp !== null ? (
                      l.pvp.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
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
                    {brlPrecise(l.proventoMensal)}
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
              Nenhum FII passou nesse filtro. Afrouxe os critérios.
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
        <p>
          <span className="font-semibold text-slate-800">
            Como ler isto.
          </span>{" "}
          O <strong>preço</strong> é ao vivo (Yahoo Finance, com possível atraso
          de minutos). <strong>P/VP</strong> = preço ÷ valor patrimonial.{" "}
          <strong>DY (a.a.)</strong> = provento mensal × 12 ÷ preço. A{" "}
          <strong>classificação</strong> segue uma regra fixa e transparente
          (Atrativo: P/VP ≤ 0,98 e DY ≥ 9%; Caro: P/VP ≥ 1,10 ou DY &lt; 7%;
          Justo: o resto).
        </p>
        <p className="mt-2">
          VPA e provento são uma fotografia da curadoria de{" "}
          {new Date(SNAPSHOT_DATE).toLocaleDateString("pt-BR")} e podem estar
          desatualizados — confira sempre na fonte oficial. Isto é conteúdo
          educacional, não recomendação de investimento. Veja o{" "}
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
