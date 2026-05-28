"use client";

import Link from "next/link";
import { useMemo } from "react";
import { totaisCarteira, useCarteira } from "@/lib/carteira";
import { brl, brlPrecise } from "@/lib/format";

const MESES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function Calendario() {
  const { posicoes, hydrated } = useCarteira();

  const meses = useMemo(() => {
    const hoje = new Date();
    hoje.setDate(1);
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
      return {
        label: `${MESES[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`,
        ano: d.getFullYear(),
        mes: d.getMonth(),
      };
    });
  }, []);

  const { rendaMensal } = totaisCarteira(posicoes);
  const total12m = rendaMensal * 12;
  const maxMes = rendaMensal;

  if (!hydrated) {
    return <p className="text-sm text-slate-500">Carregando...</p>;
  }

  if (posicoes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <p className="text-slate-700">
          Você ainda não tem nenhuma posição cadastrada.
        </p>
        <p className="mt-1.5 text-sm text-slate-500">
          Para o calendário ter o que projetar, monte sua carteira primeiro.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/carteira"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Cadastrar manualmente
          </Link>
          <Link
            href="/importacao"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-blue-600 bg-white px-5 text-sm font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white"
          >
            Importar extrato B3
          </Link>
        </div>
      </div>
    );
  }

  const semProventos = rendaMensal === 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
            Renda mensal estimada
          </p>
          <p className="mt-1 text-2xl font-semibold text-blue-900 sm:text-3xl">
            {brlPrecise(rendaMensal)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Total nos próximos 12 meses
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">
            {brl(total12m)}
          </p>
        </div>
      </div>

      {semProventos ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Você cadastrou FIIs, mas não informou o provento mensal por cota
          deles ainda. Volte na{" "}
          <Link
            href="/carteira"
            className="font-semibold text-amber-900 underline hover:text-amber-950"
          >
            carteira
          </Link>{" "}
          e preencha o campo &quot;Provento mensal / cota&quot; — o calendário
          se preenche sozinho.
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-slate-900">
          Próximos 12 meses
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {meses.map((m) => {
            const pct = maxMes > 0 ? (rendaMensal / maxMes) * 100 : 0;
            return (
              <div
                key={`${m.ano}-${m.mes}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3.5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {m.label}
                </p>
                <p className="mt-1 text-lg font-semibold text-blue-700">
                  {brlPrecise(rendaMensal)}
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-slate-900">
          Detalhamento por FII
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Ticker</th>
                <th className="px-4 py-3 text-right">Cotas</th>
                <th className="px-4 py-3 text-right">Provento / cota</th>
                <th className="px-4 py-3 text-right">Renda / mês</th>
                <th className="px-4 py-3 text-right">Renda / ano</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {posicoes.map((p) => {
                const mes = p.proventoMensalPorCota * p.quantidade;
                return (
                  <tr key={p.ticker} className="text-slate-700">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {p.ticker}
                    </td>
                    <td className="px-4 py-3 text-right">{p.quantidade}</td>
                    <td className="px-4 py-3 text-right">
                      {brlPrecise(p.proventoMensalPorCota)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-700">
                      {brlPrecise(mes)}
                    </td>
                    <td className="px-4 py-3 text-right">{brl(mes * 12)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        ⚠️ Projeção baseada no provento médio que você informou. Proventos
        reais variam mês a mês.
      </p>
    </div>
  );
}
