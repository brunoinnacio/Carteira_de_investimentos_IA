"use client";

import Link from "next/link";
import { useState } from "react";
import { TickerInput, isValidTicker } from "@/components/TickerInput";
import { IntegerInput } from "@/components/IntegerInput";
import { CurrencyInput } from "@/components/CurrencyInput";
import { totaisCarteira, useCarteira, type Posicao } from "@/lib/carteira";
import { brl, brlPrecise, percent } from "@/lib/format";

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

export function CarteiraView() {
  const { posicoes, hydrated, adicionar, remover, limpar } = useCarteira();
  const { investido, rendaMensal } = totaisCarteira(posicoes);
  const yieldCarteira =
    investido > 0 ? ((rendaMensal * 12) / investido) * 100 : 0;

  if (!hydrated) {
    return (
      <p className="text-sm text-slate-500">Carregando sua carteira...</p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Total investido
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            {brl(investido)}
          </p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
            Renda mensal estimada
          </p>
          <p className="mt-1 text-xl font-semibold text-blue-900 sm:text-2xl">
            {brlPrecise(rendaMensal)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Yield carteira (a.a.)
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            {percent(yieldCarteira)}
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
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Ticker</th>
                <th className="px-4 py-3 text-right">Cotas</th>
                <th className="px-4 py-3 text-right">PM</th>
                <th className="px-4 py-3 text-right">Investido</th>
                <th className="px-4 py-3 text-right">Provento / cota</th>
                <th className="px-4 py-3 text-right">Renda / mês</th>
                <th className="px-4 py-3 text-right">YoC</th>
                <th className="px-4 py-3"></th>
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
                return (
                  <tr key={p.ticker} className="text-slate-700">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {p.ticker}
                    </td>
                    <td className="px-4 py-3 text-right">{p.quantidade}</td>
                    <td className="px-4 py-3 text-right">
                      {brlPrecise(p.precoMedio)}
                    </td>
                    <td className="px-4 py-3 text-right">{brl(invest)}</td>
                    <td className="px-4 py-3 text-right">
                      {brlPrecise(p.proventoMensalPorCota)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-700">
                      {brlPrecise(renda)}
                    </td>
                    <td className="px-4 py-3 text-right">{percent(yoc)}</td>
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
          </table>
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
