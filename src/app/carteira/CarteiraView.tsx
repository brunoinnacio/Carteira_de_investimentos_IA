"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { TickerInput, isValidTicker } from "@/components/TickerInput";
import { IntegerInput } from "@/components/IntegerInput";
import { CurrencyInput } from "@/components/CurrencyInput";
import { totaisCarteira, useCarteira, type Posicao } from "@/lib/carteira";
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

function NovaPosicaoForm({ onAdd }: { onAdd: (p: Posicao) => void }) {
  const [ticker, setTicker] = useState("");
  const [tickerTouched, setTickerTouched] = useState(false);
  const [quantidade, setQuantidade] = useState(0);
  const [precoMedio, setPrecoMedio] = useState(0);
  const [provento, setProvento] = useState(0);

  const tickerOk = isValidTicker(ticker);
  const tickerError =
    !tickerOk && ticker.length > 0 && tickerTouched
      ? "Ticker inválido. Padrão esperado: XXXX11"
      : undefined;

  const cotasOk = Number.isInteger(quantidade) && quantidade > 0;
  const precoOk = precoMedio > 0;
  const proventoOk = provento >= 0;

  const isValid = tickerOk && cotasOk && precoOk && proventoOk;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTickerTouched(true);
    if (!isValid) return;

    onAdd({
      ticker,
      quantidade,
      precoMedio,
      proventoMensalPorCota: provento,
    });

    setTicker("");
    setTickerTouched(false);
    setQuantidade(0);
    setPrecoMedio(0);
    setProvento(0);
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
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
          label="Cotas"
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
          label="Provento mensal / cota"
          value={provento}
          onChange={setProvento}
          help="Pode ser 0 se o fundo não está pagando este mês."
        />
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        {!isValid && (ticker || quantidade || precoMedio) ? (
          <p className="text-xs text-slate-500" aria-live="polite">
            Preencha ticker válido, cotas e preço médio para adicionar.
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

export function CarteiraView() {
  const { posicoes, hydrated, adicionar, remover, limpar, salvar } =
    useCarteira();
  const { investido, rendaMensal } = totaisCarteira(posicoes);
  const yieldCarteira =
    investido > 0 ? ((rendaMensal * 12) / investido) * 100 : 0;

  const [edit, setEdit] = useState<EditState>(null);

  const tickers = useMemo(() => posicoes.map((p) => p.ticker), [posicoes]);
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

      <NovaPosicaoForm onAdd={adicionar} />

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
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Posições · {posicoes.length} FII(s)
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
                {posicoes.map((p) => {
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
                    {brlPrecise(investido)}
                  </td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-right tabular-nums">
                    {brlPrecise(valorMercado)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span
                      className={
                        lucro >= 0 ? "text-emerald-700" : "text-rose-700"
                      }
                    >
                      {lucro >= 0 ? "+" : ""}
                      {percent(lucroPercent)}
                    </span>
                  </td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-right tabular-nums text-blue-700">
                    {brlPrecise(rendaMensal)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {percent(yieldCarteira)}
                  </td>
                  <td className="px-4 py-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {posicoes.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-slate-500">
            Carteira salva no seu navegador. Limpe o cache do site = perde os
            dados.
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
