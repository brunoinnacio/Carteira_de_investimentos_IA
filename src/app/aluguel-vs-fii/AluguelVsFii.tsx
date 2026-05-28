"use client";

import { useMemo, useState } from "react";
import { NumberInput } from "@/components/NumberInput";
import { BrokerCta } from "@/components/BrokerCta";
import { brl, percent } from "@/lib/format";

function calcular({
  valorImovel,
  aluguelMensal,
  vacanciaPercent,
  custosFixosMensais,
  manutencaoAnualPercent,
  dyFiiAnual,
}: {
  valorImovel: number;
  aluguelMensal: number;
  vacanciaPercent: number;
  custosFixosMensais: number;
  manutencaoAnualPercent: number;
  dyFiiAnual: number;
}) {
  const aluguelEfetivo = aluguelMensal * (1 - vacanciaPercent / 100);
  const irAluguel = aluguelEfetivo * 0.15;
  const manutencaoMensal = (valorImovel * (manutencaoAnualPercent / 100)) / 12;

  const liquidoImovelMes =
    aluguelEfetivo - irAluguel - custosFixosMensais - manutencaoMensal;
  const yieldImovelAnual =
    valorImovel > 0 ? ((liquidoImovelMes * 12) / valorImovel) * 100 : 0;

  const rendaFiiMensal = (valorImovel * (dyFiiAnual / 100)) / 12;

  const diferenca = rendaFiiMensal - liquidoImovelMes;
  const vencedor: "fii" | "imovel" | "empate" =
    Math.abs(diferenca) < 1 ? "empate" : diferenca > 0 ? "fii" : "imovel";

  return {
    liquidoImovelMes,
    yieldImovelAnual,
    rendaFiiMensal,
    diferenca,
    vencedor,
    detalheImovel: { aluguelEfetivo, irAluguel, manutencaoMensal },
  };
}

export function AluguelVsFii() {
  const [valorImovel, setValorImovel] = useState(500_000);
  const [aluguelMensal, setAluguelMensal] = useState(2500);
  const [vacanciaPercent, setVacanciaPercent] = useState(8);
  const [custosFixosMensais, setCustosFixosMensais] = useState(300);
  const [manutencaoAnualPercent, setManutencaoAnualPercent] = useState(1);
  const [dyFiiAnual, setDyFiiAnual] = useState(9);

  const r = useMemo(
    () =>
      calcular({
        valorImovel,
        aluguelMensal,
        vacanciaPercent,
        custosFixosMensais,
        manutencaoAnualPercent,
        dyFiiAnual,
      }),
    [
      valorImovel,
      aluguelMensal,
      vacanciaPercent,
      custosFixosMensais,
      manutencaoAnualPercent,
      dyFiiAnual,
    ]
  );

  const cardVencedor =
    r.vencedor === "fii"
      ? "border-blue-100 bg-blue-600 text-white"
      : r.vencedor === "imovel"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-slate-200 bg-white text-slate-900";

  const labelVencedor =
    r.vencedor === "fii"
      ? "FII paga mais"
      : r.vencedor === "imovel"
      ? "Imóvel paga mais"
      : "Empate técnico";

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Cenário</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Mesmo valor nas duas pontas para comparar de igual pra igual.
        </p>

        <div className="mt-5 grid gap-4">
          <NumberInput
            label="Valor do imóvel"
            value={valorImovel}
            onChange={setValorImovel}
            prefix="R$"
            min={0}
            step={10_000}
            help="Quanto custa o imóvel hoje (= quanto teria pra investir em FII)."
          />
          <NumberInput
            label="Aluguel mensal cheio"
            value={aluguelMensal}
            onChange={setAluguelMensal}
            prefix="R$"
            min={0}
            step={100}
            help="Aluguel que dá pra cobrar quando o imóvel está ocupado."
          />
          <NumberInput
            label="Vacância média"
            value={vacanciaPercent}
            onChange={setVacanciaPercent}
            suffix="% do ano"
            min={0}
            max={100}
            step={1}
            help="Quantos meses por ano sem inquilino, na média."
          />
          <NumberInput
            label="Custos fixos mensais"
            value={custosFixosMensais}
            onChange={setCustosFixosMensais}
            prefix="R$"
            min={0}
            step={50}
            help="IPTU mensal, condomínio quando vago, seguro, gestão."
          />
          <NumberInput
            label="Manutenção anual"
            value={manutencaoAnualPercent}
            onChange={setManutencaoAnualPercent}
            suffix="% do imóvel"
            min={0}
            max={10}
            step={0.5}
            help="Reformas, pintura, reparos. 1% a 2% ao ano é a regra prática."
          />
          <NumberInput
            label="DY médio do FII"
            value={dyFiiAnual}
            onChange={setDyFiiAnual}
            suffix="% ao ano"
            min={0.1}
            max={30}
            step={0.5}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className={`rounded-2xl border p-6 shadow-sm ${cardVencedor}`}>
          <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
            Vencedor nesse cenário
          </p>
          <p className="mt-1 text-2xl font-semibold sm:text-3xl">
            {labelVencedor}
          </p>
          <p className="mt-1.5 text-sm opacity-90">
            Diferença líquida:{" "}
            <strong>{brl(Math.abs(r.diferenca))}</strong> por mês.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
              Imóvel alugado
            </p>
            <p className="mt-1 text-xl font-semibold text-amber-900">
              {brl(r.liquidoImovelMes)}
              <span className="ml-1 text-xs font-normal text-amber-700">
                / mês
              </span>
            </p>
            <p className="mt-1 text-xs text-amber-800">
              Yield líquido: {percent(r.yieldImovelAnual)} a.a.
            </p>
            <dl className="mt-3 grid gap-1 text-xs text-amber-900">
              <div className="flex justify-between">
                <dt>Aluguel efetivo</dt>
                <dd>{brl(r.detalheImovel.aluguelEfetivo)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>− IR 15%</dt>
                <dd>−{brl(r.detalheImovel.irAluguel)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>− Custos fixos</dt>
                <dd>−{brl(custosFixosMensais)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>− Manutenção</dt>
                <dd>−{brl(r.detalheImovel.manutencaoMensal)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
              FIIs (mesmo valor)
            </p>
            <p className="mt-1 text-xl font-semibold text-blue-900">
              {brl(r.rendaFiiMensal)}
              <span className="ml-1 text-xs font-normal text-blue-700">
                / mês
              </span>
            </p>
            <p className="mt-1 text-xs text-blue-800">
              DY líquido: {percent(dyFiiAnual)} a.a.
            </p>
            <p className="mt-3 text-xs text-blue-900">
              Proventos de FII são <strong>isentos de IR</strong> para pessoa
              física (regras atuais da Receita).
            </p>
            <p className="mt-2 text-xs text-blue-900/80">
              Sem vacância, sem inquilino devedor, sem reforma — mas com
              variação de cota.
            </p>
          </div>
        </div>

        <BrokerCta />
      </div>
    </div>
  );
}
