"use client";

import { useMemo, useState } from "react";
import { NumberInput } from "@/components/NumberInput";
import { BrokerCta } from "@/components/BrokerCta";
import { brl, integer, percent } from "@/lib/format";

type Result = {
  patrimonioAlvo: number;
  rendaMensalLiquida: number;
  mesesAteAlvo: number | null;
  anosAteAlvo: number | null;
  totalAportado: number;
  jurosCompostos: number;
};

function calcular({
  rendaDesejadaMensal,
  dividendYieldAnual,
  aporteMensal,
  patrimonioAtual,
}: {
  rendaDesejadaMensal: number;
  dividendYieldAnual: number;
  aporteMensal: number;
  patrimonioAtual: number;
}): Result {
  const dyMensal = dividendYieldAnual / 100 / 12;
  const rendaAnualDesejada = rendaDesejadaMensal * 12;
  const patrimonioAlvo =
    dividendYieldAnual > 0
      ? rendaAnualDesejada / (dividendYieldAnual / 100)
      : Number.POSITIVE_INFINITY;

  let patrimonio = patrimonioAtual;
  let meses = 0;
  let totalAportado = patrimonioAtual;
  const maxMeses = 12 * 80;

  while (patrimonio < patrimonioAlvo && meses < maxMeses) {
    const proventos = patrimonio * dyMensal;
    patrimonio += proventos + aporteMensal;
    totalAportado += aporteMensal;
    meses += 1;
  }

  const atingiu = patrimonio >= patrimonioAlvo;

  return {
    patrimonioAlvo,
    rendaMensalLiquida: rendaDesejadaMensal,
    mesesAteAlvo: atingiu ? meses : null,
    anosAteAlvo: atingiu ? meses / 12 : null,
    totalAportado,
    jurosCompostos: Math.max(patrimonio - totalAportado, 0),
  };
}

export function CalculadoraRenda() {
  const [rendaDesejadaMensal, setRendaDesejadaMensal] = useState(5000);
  const [dividendYieldAnual, setDividendYieldAnual] = useState(9);
  const [aporteMensal, setAporteMensal] = useState(1000);
  const [patrimonioAtual, setPatrimonioAtual] = useState(0);

  const result = useMemo(
    () =>
      calcular({
        rendaDesejadaMensal,
        dividendYieldAnual,
        aporteMensal,
        patrimonioAtual,
      }),
    [rendaDesejadaMensal, dividendYieldAnual, aporteMensal, patrimonioAtual]
  );

  const atingivel = result.mesesAteAlvo !== null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Seus dados</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Mexa nos valores e veja o resultado mudar na hora.
        </p>

        <div className="mt-5 grid gap-4">
          <NumberInput
            label="Renda mensal que eu quero receber"
            value={rendaDesejadaMensal}
            onChange={setRendaDesejadaMensal}
            prefix="R$"
            min={0}
            step={100}
            help="Quanto você quer receber por mês, livre, de renda passiva."
          />
          <NumberInput
            label="Rentabilidade média anual da carteira"
            value={dividendYieldAnual}
            onChange={setDividendYieldAnual}
            suffix="% ao ano"
            min={0.1}
            max={30}
            step={0.5}
            help="FIIs e renda fixa giram em torno de 8% a 12% ao ano; ajuste ao seu caso."
          />
          <NumberInput
            label="Quanto vou aportar todo mês"
            value={aporteMensal}
            onChange={setAporteMensal}
            prefix="R$"
            min={0}
            step={100}
            help="Quanto você consegue investir mensalmente sem apertar."
          />
          <NumberInput
            label="Patrimônio que já tenho investido"
            value={patrimonioAtual}
            onChange={setPatrimonioAtual}
            prefix="R$"
            min={0}
            step={1000}
            help="Se ainda não tem nada, deixe em zero."
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-blue-100 bg-blue-600 p-6 text-white shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-100">
            Patrimônio necessário
          </p>
          <p className="mt-1 text-3xl font-semibold sm:text-4xl">
            {Number.isFinite(result.patrimonioAlvo)
              ? brl(result.patrimonioAlvo)
              : "—"}
          </p>
          <p className="mt-2 text-sm text-blue-50/90">
            Rendendo{" "}
            <strong className="text-white">
              {percent(dividendYieldAnual)}
            </strong>{" "}
            ao ano, esse valor te paga{" "}
            <strong className="text-white">{brl(rendaDesejadaMensal)}</strong>{" "}
            por mês de proventos.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Tempo para chegar lá
          </p>
          {atingivel ? (
            <>
              <p className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">
                {(result.anosAteAlvo ?? 0).toLocaleString("pt-BR", {
                  maximumFractionDigits: 1,
                })}{" "}
                anos
              </p>
              <p className="mt-0.5 text-sm text-slate-600">
                {integer(result.mesesAteAlvo ?? 0)} meses aportando{" "}
                {brl(aporteMensal)} por mês e reinvestindo todos os
                proventos.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <p className="text-xs text-slate-500">Você terá aportado</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {brl(result.totalAportado)}
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3.5">
                  <p className="text-xs font-medium text-emerald-700">
                    Juros compostos a seu favor
                  </p>
                  <p className="mt-1 text-base font-semibold text-emerald-700">
                    {brl(result.jurosCompostos)}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="mt-1 text-lg font-semibold text-rose-700">
                Não dá pra chegar com esse aporte em 80 anos.
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Aumente o aporte mensal, suba o DY esperado ou comece com algum
                patrimônio inicial.
              </p>
            </>
          )}
        </div>

        <BrokerCta />
      </div>
    </div>
  );
}
