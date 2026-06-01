"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  TickerInput,
  isValidTicker,
  isValidTickerAcao,
} from "@/components/TickerInput";
import { IntegerInput } from "@/components/IntegerInput";
import { CurrencyInput } from "@/components/CurrencyInput";
import {
  totaisCarteira,
  totaisPorClasse,
  rfKey,
  useCarteira,
  classeDe,
  CLASSE_LABEL,
  type Posicao,
  type Classe,
} from "@/lib/carteira";
import { useCotacoes } from "@/lib/cotacoes";
import { brl, brlPrecise, percent } from "@/lib/format";

type EditField = "precoMedio" | "quantidade" | "proventoMensalPorCota";
type EditState = { ticker: string; field: EditField; raw: string } | null;

function formatBR(value: number, digits: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function parseBR(raw: string): number {
  if (!raw) return 0;
  const cleaned = raw
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function EditableCell({
  posicao,
  field,
  edit,
  setEdit,
  onCommit,
  suggested,
  format,
  placeholder,
}: {
  posicao: Posicao;
  field: EditField;
  edit: EditState;
  setEdit: (s: EditState) => void;
  onCommit: (ticker: string, field: EditField, value: number) => void;
  suggested?: number;
  format: (value: number) => string;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isActive =
    edit?.ticker === posicao.ticker && edit.field === field;
  const value = posicao[field];

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isActive]);

  if (!isActive) {
    const isZero = value === 0;
    return (
      <button
        type="button"
        onClick={() => {
          const initial =
            isZero && suggested && suggested > 0
              ? field === "quantidade"
                ? String(suggested)
                : formatBR(suggested, 2)
              : value === 0
              ? ""
              : field === "quantidade"
              ? String(value)
              : formatBR(value, field === "proventoMensalPorCota" ? 4 : 2);
          setEdit({ ticker: posicao.ticker, field, raw: initial });
        }}
        className={`group inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-right tabular-nums transition hover:bg-blue-50 hover:text-blue-800 ${
          isZero ? "text-amber-700" : "text-slate-700"
        }`}
        title="Clique para editar"
      >
        <span>{isZero ? placeholder ?? "—" : format(value)}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-3 w-3 opacity-0 transition group-hover:opacity-60"
          aria-hidden
        >
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>
    );
  }

  const commit = () => {
    const num =
      field === "quantidade"
        ? Math.max(0, Math.floor(parseBR(edit!.raw)))
        : parseBR(edit!.raw);
    onCommit(posicao.ticker, field, num);
    setEdit(null);
  };

  return (
    <div className="inline-flex items-center gap-1">
      {field !== "quantidade" ? (
        <span className="text-xs text-slate-500">R$</span>
      ) : null}
      <input
        ref={inputRef}
        type="text"
        inputMode={field === "quantidade" ? "numeric" : "decimal"}
        value={edit!.raw}
        onChange={(e) =>
          setEdit({
            ticker: posicao.ticker,
            field,
            raw: e.target.value,
          })
        }
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          } else if (e.key === "Escape") {
            e.preventDefault();
            setEdit(null);
          }
        }}
        className="w-24 rounded border border-blue-300 bg-white px-2 py-1 text-right text-sm font-medium text-slate-900 outline-none ring-2 ring-blue-100 tabular-nums"
      />
    </div>
  );
}

const CLASSES_FORM: { id: Classe; label: string }[] = [
  { id: "fii", label: "FII" },
  { id: "acao", label: "Ação" },
  { id: "rendaFixa", label: "Renda fixa" },
];

function NovaPosicaoForm({ onAdd }: { onAdd: (p: Posicao) => void }) {
  const [classe, setClasse] = useState<Classe>("fii");
  const [ticker, setTicker] = useState("");
  const [tickerTouched, setTickerTouched] = useState(false);
  const [quantidade, setQuantidade] = useState(0);
  const [precoMedio, setPrecoMedio] = useState(0);
  const [provento, setProvento] = useState(0);
  const [nomeRF, setNomeRF] = useState("");
  const [valorRF, setValorRF] = useState(0);

  const ehAcao = classe === "acao";
  const ehRF = classe === "rendaFixa";

  const tickerOk = ehAcao ? isValidTickerAcao(ticker) : isValidTicker(ticker);
  const tickerError =
    !tickerOk && ticker.length > 0 && tickerTouched
      ? ehAcao
        ? "Ticker inválido. Ex.: PETR4, ITUB3, BBAS3"
        : "Ticker inválido. Padrão esperado: XXXX11"
      : undefined;

  const cotasOk = Number.isInteger(quantidade) && quantidade > 0;
  const precoOk = precoMedio > 0;
  const proventoOk = provento >= 0;

  const rfNomeOk = nomeRF.trim().length >= 2;
  const rfValorOk = valorRF > 0;

  const isValid = ehRF
    ? rfNomeOk && rfValorOk
    : tickerOk && cotasOk && precoOk && proventoOk;

  function resetForm() {
    setTicker("");
    setTickerTouched(false);
    setQuantidade(0);
    setPrecoMedio(0);
    setProvento(0);
    setNomeRF("");
    setValorRF(0);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTickerTouched(true);
    if (!isValid) return;

    if (ehRF) {
      const nome = nomeRF.trim();
      onAdd({
        ticker: rfKey(nome),
        nome,
        quantidade: 1,
        precoMedio: valorRF,
        proventoMensalPorCota: 0,
        classe: "rendaFixa",
      });
    } else {
      onAdd({
        ticker,
        quantidade,
        precoMedio,
        proventoMensalPorCota: provento,
        classe,
      });
    }

    resetForm();
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-3 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
        {CLASSES_FORM.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setClasse(c.id)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
              classe === c.id
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {ehRF ? (
        <div className="grid gap-3 sm:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              Nome / descrição
            </span>
            <input
              type="text"
              value={nomeRF}
              onChange={(e) => setNomeRF(e.target.value)}
              placeholder="Ex.: Tesouro Selic 2029, CDB Banco X, COE BTG, Previdência"
              className="h-[42px] rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <CurrencyInput
            label="Valor aplicado"
            value={valorRF}
            onChange={setValorRF}
            help="Quanto você tem investido nesse título."
          />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-[130px_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1.2fr)]">
          <TickerInput
            label="Ticker"
            value={ticker}
            onChange={(v) => {
              setTicker(v);
              if (tickerTouched && v.length === 0) setTickerTouched(false);
            }}
            onBlur={() => setTickerTouched(true)}
            error={tickerError}
          />
          <IntegerInput
            label={ehAcao ? "Quantidade" : "Cotas"}
            value={quantidade}
            onChange={setQuantidade}
            placeholder="0"
          />
          <CurrencyInput
            label="Preço médio"
            value={precoMedio}
            onChange={setPrecoMedio}
          />
          <CurrencyInput
            label={ehAcao ? "Dividendo mensal / ação" : "Provento mensal / cota"}
            value={provento}
            onChange={setProvento}
            help={
              ehAcao
                ? "Opcional. Ações pagam dividendos irregulares — pode deixar 0."
                : "Pode ser 0 se o fundo não está pagando este mês."
            }
          />
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-3">
        {!isValid && (ticker || quantidade || precoMedio || nomeRF || valorRF) ? (
          <p className="text-xs text-slate-500" aria-live="polite">
            {ehRF
              ? "Preencha o nome e o valor aplicado para adicionar."
              : "Preencha ticker válido, cotas e preço médio para adicionar."}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={!isValid}
          className="inline-flex h-[42px] items-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:opacity-100 disabled:shadow-none"
        >
          Adicionar à carteira
        </button>
      </div>
    </form>
  );
}

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

const CLASSE_COR: Record<Classe, { bar: string; dot: string; label: string }> = {
  fii: { bar: "bg-blue-500", dot: "bg-blue-500", label: "FIIs" },
  acao: { bar: "bg-violet-500", dot: "bg-violet-500", label: "Ações" },
  rendaFixa: { bar: "bg-teal-500", dot: "bg-teal-500", label: "Renda fixa" },
};

function AlocacaoConsolidada({
  porClasse,
  total,
}: {
  porClasse: Record<Classe, number>;
  total: number;
}) {
  if (total <= 0) return null;
  const ordem: Classe[] = ["fii", "acao", "rendaFixa"];
  const itens = ordem
    .map((c) => ({ classe: c, valor: porClasse[c], pct: (porClasse[c] / total) * 100 }))
    .filter((i) => i.valor > 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Alocação por classe
        </h2>
        <span className="text-xs text-slate-500">total {brl(total)}</span>
      </div>
      <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
        {itens.map((i) => (
          <div
            key={i.classe}
            className={CLASSE_COR[i.classe].bar}
            style={{ width: `${i.pct}%` }}
            title={`${CLASSE_COR[i.classe].label}: ${i.pct.toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {itens.map((i) => (
          <div key={i.classe} className="flex items-center gap-2 text-sm">
            <span
              className={`h-2.5 w-2.5 rounded-full ${CLASSE_COR[i.classe].dot}`}
            />
            <span className="font-medium text-slate-700">
              {CLASSE_COR[i.classe].label}
            </span>
            <span className="tabular-nums text-slate-500">
              {i.pct.toFixed(1)}% · {brl(i.valor)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RendaFixaTabela({
  posicoes,
  total,
  onRemover,
}: {
  posicoes: Posicao[];
  total: number;
  onRemover: (ticker: string) => void;
}) {
  const totalRF = posicoes.reduce((a, p) => a + p.precoMedio * p.quantidade, 0);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-3">
        <h2 className="text-base font-semibold text-slate-900">
          Renda fixa · {posicoes.length} título(s)
        </h2>
        <p className="text-xs text-slate-500">
          Tesouro, CDB, LCI/LCA, COE, previdência e outras aplicações. Sem
          cotação de mercado — o valor é o que você aplicou.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3 text-right">Valor aplicado</th>
              <th className="px-4 py-3 text-right">% da carteira</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {posicoes.map((p) => {
              const valor = p.precoMedio * p.quantidade;
              const pct = total > 0 ? (valor / total) * 100 : 0;
              return (
                <tr key={p.ticker} className="text-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {p.nome ?? p.ticker.replace(/^RF:/, "")}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {brlPrecise(valor)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-500">
                    {pct.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onRemover(p.ticker)}
                      className="text-xs font-medium text-rose-700 hover:text-rose-800"
                    >
                      remover
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 text-sm font-semibold text-slate-900">
            <tr>
              <td className="px-4 py-3">Total renda fixa</td>
              <td className="px-4 py-3 text-right tabular-nums">
                {brlPrecise(totalRF)}
              </td>
              <td className="px-4 py-3" colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export function CarteiraView() {
  const { posicoes, hydrated, adicionar, remover, limpar, salvar } =
    useCarteira();
  const { investido, rendaMensal } = totaisCarteira(posicoes);
  const yieldCarteira =
    investido > 0 ? ((rendaMensal * 12) / investido) * 100 : 0;

  const [edit, setEdit] = useState<EditState>(null);

  const posicoesBolsa = useMemo(
    () => posicoes.filter((p) => classeDe(p) !== "rendaFixa"),
    [posicoes]
  );
  const posicoesRF = useMemo(
    () => posicoes.filter((p) => classeDe(p) === "rendaFixa"),
    [posicoes]
  );

  // Filtro por tipo de aplicacao (Todos / FIIs / Acoes / Renda fixa).
  const [filtro, setFiltro] = useState<"todos" | Classe>("todos");

  const nFii = useMemo(
    () => posicoesBolsa.filter((p) => classeDe(p) === "fii").length,
    [posicoesBolsa]
  );
  const nAcao = useMemo(
    () => posicoesBolsa.filter((p) => classeDe(p) === "acao").length,
    [posicoesBolsa]
  );

  const bolsaVis = useMemo(() => {
    if (filtro === "todos") return posicoesBolsa;
    if (filtro === "rendaFixa") return [];
    return posicoesBolsa.filter((p) => classeDe(p) === filtro);
  }, [posicoesBolsa, filtro]);

  const mostrarRF =
    posicoesRF.length > 0 && (filtro === "todos" || filtro === "rendaFixa");

  const tituloBolsa =
    filtro === "fii" ? "FIIs" : filtro === "acao" ? "Ações" : "FIIs e ações";

  // Cotacoes so fazem sentido para ativos de bolsa (FII/acao).
  const tickers = useMemo(
    () => posicoesBolsa.map((p) => p.ticker),
    [posicoesBolsa]
  );
  const { cotacoes, carregando, erro, atualizadoEm, recarregar } =
    useCotacoes(tickers);

  function commitEdit(ticker: string, field: EditField, value: number) {
    const next = posicoes.map((p) =>
      p.ticker === ticker ? { ...p, [field]: value } : p
    );
    salvar(next);
  }

  const valorMercado = useMemo(
    () =>
      posicoes.reduce((acc, p) => {
        const cot = cotacoes[p.ticker]?.preco;
        if (typeof cot === "number") return acc + cot * p.quantidade;
        return acc + p.precoMedio * p.quantidade;
      }, 0),
    [posicoes, cotacoes]
  );

  // Totais do rodape da tabela seguem o que esta visivel (respeitam o filtro).
  const investidoBolsa = useMemo(
    () => bolsaVis.reduce((a, p) => a + p.precoMedio * p.quantidade, 0),
    [bolsaVis]
  );
  const valorMercadoBolsa = useMemo(
    () =>
      bolsaVis.reduce((acc, p) => {
        const cot = cotacoes[p.ticker]?.preco;
        if (typeof cot === "number") return acc + cot * p.quantidade;
        return acc + p.precoMedio * p.quantidade;
      }, 0),
    [bolsaVis, cotacoes]
  );
  const rendaBolsa = useMemo(
    () =>
      bolsaVis.reduce((a, p) => a + p.proventoMensalPorCota * p.quantidade, 0),
    [bolsaVis]
  );
  const lucroBolsa = valorMercadoBolsa - investidoBolsa;
  const lucroBolsaPercent =
    investidoBolsa > 0 ? (lucroBolsa / investidoBolsa) * 100 : 0;
  const yieldBolsa =
    investidoBolsa > 0 ? ((rendaBolsa * 12) / investidoBolsa) * 100 : 0;

  const alocacao = useMemo(() => totaisPorClasse(posicoes), [posicoes]);

  const lucro = valorMercado - investido;
  const lucroPercent = investido > 0 ? (lucro / investido) * 100 : 0;

  if (!hydrated) {
    return (
      <p className="text-sm text-slate-500">Carregando sua carteira...</p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Total investido
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            {brl(investido)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">soma dos PMs × cotas</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Valor atual (mercado)
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            {brl(valorMercado)}
          </p>
          <p
            className={`mt-0.5 text-[11px] font-medium ${
              lucro >= 0 ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {lucro >= 0 ? "+" : ""}
            {brl(lucro)} ({lucro >= 0 ? "+" : ""}
            {percent(lucroPercent)})
          </p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
            Renda mensal estimada
          </p>
          <p className="mt-1 text-xl font-semibold text-blue-900 sm:text-2xl">
            {brlPrecise(rendaMensal)}
          </p>
          <p className="mt-0.5 text-[11px] text-blue-700/70">
            soma de provento × cotas
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Yield carteira (a.a.)
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            {percent(yieldCarteira)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">
            sobre o total investido
          </p>
        </div>
      </div>

      {posicoes.length > 0 ? (
        <AlocacaoConsolidada
          porClasse={alocacao.porClasse}
          total={alocacao.total}
        />
      ) : null}

      <NovaPosicaoForm onAdd={adicionar} />

      {posicoes.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Filtrar:
          </span>
          {(
            [
              { id: "todos" as const, label: "Todos", n: posicoes.length },
              { id: "fii" as const, label: "FIIs", n: nFii },
              { id: "acao" as const, label: "Ações", n: nAcao },
              { id: "rendaFixa" as const, label: "Renda fixa", n: posicoesRF.length },
            ] as { id: "todos" | Classe; label: string; n: number }[]
          )
            .filter((c) => c.id === "todos" || c.n > 0)
            .map((c) => {
              const ativo = filtro === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFiltro(c.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition ${
                    ativo
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-slate-300 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-800"
                  }`}
                >
                  {c.label}
                  <span
                    className={`tabular-nums text-xs ${
                      ativo ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {c.n}
                  </span>
                </button>
              );
            })}
        </div>
      ) : null}

      {posicoes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-slate-700">
            Você ainda não tem nenhuma posição cadastrada.
          </p>
          <p className="mt-1.5 text-sm text-slate-500">
            Adicione manualmente acima ou{" "}
            <Link
              href="/importacao"
              className="font-semibold text-blue-700 hover:text-blue-800"
            >
              importe o extrato da B3
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
        {bolsaVis.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {tituloBolsa} · {bolsaVis.length} ativo(s)
              </h2>
              <p className="text-xs text-slate-500">
                {carregando
                  ? "Atualizando cotações..."
                  : erro
                  ? `Falha ao buscar cotações (${erro}).`
                  : atualizadoEm
                  ? `Cotações às ${formatTime(atualizadoEm)} · fonte: Yahoo Finance · clique em PM/Cotas/Provento para editar`
                  : "Sem cotações."}
              </p>
            </div>
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
                  <th className="px-4 py-3">Ticker</th>
                  <th className="px-4 py-3 text-right">Cotas</th>
                  <th className="px-4 py-3 text-right">PM</th>
                  <th className="px-4 py-3 text-right">Investido</th>
                  <th className="px-4 py-3 text-right">Preço fechamento</th>
                  <th className="px-4 py-3 text-right">Valor total</th>
                  <th className="px-4 py-3 text-right">Variação</th>
                  <th className="px-4 py-3 text-right">Provento / cota</th>
                  <th className="px-4 py-3 text-right">Renda / mês</th>
                  <th className="px-4 py-3 text-right">YoC</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bolsaVis.map((p) => {
                  const invest = p.precoMedio * p.quantidade;
                  const renda = p.proventoMensalPorCota * p.quantidade;
                  const yoc =
                    p.precoMedio > 0
                      ? ((p.proventoMensalPorCota * 12) / p.precoMedio) * 100
                      : 0;
                  const cot = cotacoes[p.ticker];
                  const precoAtual = cot?.preco;
                  const valorAtual =
                    typeof precoAtual === "number"
                      ? precoAtual * p.quantidade
                      : null;
                  const varPosicao =
                    typeof precoAtual === "number" && p.precoMedio > 0
                      ? ((precoAtual - p.precoMedio) / p.precoMedio) * 100
                      : null;
                  const pmEstimado = p.precoMedio === 0;

                  return (
                    <tr
                      key={p.ticker}
                      className={
                        pmEstimado
                          ? "bg-amber-50/40 text-slate-700"
                          : "text-slate-700"
                      }
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <span className="flex items-center gap-2">
                          {p.ticker}
                          <span
                            className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ${
                              classeDe(p) === "acao"
                                ? "bg-violet-100 text-violet-800 ring-violet-200"
                                : classeDe(p) === "rendaFixa"
                                ? "bg-teal-100 text-teal-800 ring-teal-200"
                                : "bg-blue-100 text-blue-800 ring-blue-200"
                            }`}
                          >
                            {CLASSE_LABEL[classeDe(p)]}
                          </span>
                          {pmEstimado ? (
                            <span
                              title="Preço médio precisa ser preenchido. Edite ou remova."
                              className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-800 ring-1 ring-amber-200"
                            >
                              PM ?
                            </span>
                          ) : null}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <EditableCell
                          posicao={p}
                          field="quantidade"
                          edit={edit}
                          setEdit={setEdit}
                          onCommit={commitEdit}
                          format={(n) => n.toLocaleString("pt-BR")}
                          placeholder="0"
                        />
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <div className="flex flex-col items-end gap-1">
                          <EditableCell
                            posicao={p}
                            field="precoMedio"
                            edit={edit}
                            setEdit={setEdit}
                            onCommit={commitEdit}
                            suggested={precoAtual}
                            format={brlPrecise}
                            placeholder="a preencher"
                          />
                          {pmEstimado && typeof precoAtual === "number" ? (
                            <button
                              type="button"
                              onClick={() =>
                                commitEdit(p.ticker, "precoMedio", precoAtual)
                              }
                              className="text-[10px] font-medium text-blue-700 hover:text-blue-800 hover:underline"
                              title="Usa o preço atual de mercado como preço médio"
                            >
                              usar {brlPrecise(precoAtual)}
                            </button>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {pmEstimado ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          brlPrecise(invest)
                        )}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {typeof precoAtual === "number" ? (
                          brlPrecise(precoAtual)
                        ) : carregando ? (
                          <span className="text-slate-400">…</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums text-slate-900">
                        {typeof valorAtual === "number" ? (
                          brlPrecise(valorAtual)
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {varPosicao !== null ? (
                          <span
                            className={
                              varPosicao >= 0
                                ? "text-emerald-700"
                                : "text-rose-700"
                            }
                          >
                            {varPosicao >= 0 ? "+" : ""}
                            {percent(varPosicao)}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <EditableCell
                          posicao={p}
                          field="proventoMensalPorCota"
                          edit={edit}
                          setEdit={setEdit}
                          onCommit={commitEdit}
                          format={brlPrecise}
                          placeholder="R$ 0,00"
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-blue-700">
                        {brlPrecise(renda)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {percent(yoc)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => remover(p.ticker)}
                          className="text-xs font-medium text-rose-700 hover:text-rose-800"
                        >
                          remover
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50 text-sm font-semibold text-slate-900">
                <tr>
                  <td className="px-4 py-3" colSpan={3}>
                    Totais
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {brlPrecise(investidoBolsa)}
                  </td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-right tabular-nums">
                    {brlPrecise(valorMercadoBolsa)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span
                      className={
                        lucroBolsa >= 0 ? "text-emerald-700" : "text-rose-700"
                      }
                    >
                      {lucroBolsa >= 0 ? "+" : ""}
                      {percent(lucroBolsaPercent)}
                    </span>
                  </td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-right tabular-nums text-blue-700">
                    {brlPrecise(rendaBolsa)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {percent(yieldBolsa)}
                  </td>
                  <td className="px-4 py-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        ) : null}

        {mostrarRF ? (
          <RendaFixaTabela
            posicoes={posicoesRF}
            total={alocacao.total}
            onRemover={remover}
          />
        ) : null}
        </>
      )}

      {posicoes.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-slate-500">
            Alterações salvas automaticamente. Sem conta, ficam só neste
            navegador; com conta, sincronizam na nuvem.
          </p>
          <button
            type="button"
            onClick={() => {
              if (confirm("Apagar toda a carteira?")) limpar();
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:border-rose-300 hover:text-rose-700"
          >
            Limpar carteira
          </button>
        </div>
      ) : null}
    </div>
  );
}
