"use client";

import { useMemo, useState } from "react";
import { NumberInput } from "@/components/NumberInput";
import { BrokerCta } from "@/components/BrokerCta";
import { brl, percent } from "@/lib/format";

type Ponto = {
  mes: number;
  ano: number;
  patrimonio: number;
  rendaMensal: number;
  totalAportado: number;
};

function simular({
  aporteMensal,
  patrimonioInicial,
  dyAnual,
  anos,
  reinvestir,
}: {
  aporteMensal: number;
  patrimonioInicial: number;
  dyAnual: number;
  anos: number;
  reinvestir: boolean;
}): Ponto[] {
  const dyMensal = dyAnual / 100 / 12;
  const meses = Math.max(1, Math.min(80, anos)) * 12;
  let patrimonio = patrimonioInicial;
  let totalAportado = patrimonioInicial;
  const out: Ponto[] = [];

  for (let m = 1; m <= meses; m++) {
    const proventos = patrimonio * dyMensal;
    if (reinvestir) patrimonio += proventos;
    patrimonio += aporteMensal;
    totalAportado += aporteMensal;
    out.push({
      mes: m,
      ano: m / 12,
      patrimonio,
      rendaMensal: patrimonio * dyMensal,
      totalAportado,
    });
  }
  return out;
}

function GraficoLinha({ pontos }: { pontos: Ponto[] }) {
  const w = 720;
  const h = 280;
  const padding = { top: 20, right: 16, bottom: 30, left: 56 };

  const maxRenda = Math.max(...pontos.map((p) => p.rendaMensal), 1);
  const maxX = pontos[pontos.length - 1]?.ano ?? 1;

  const xScale = (ano: number) =>
    padding.left + (ano / maxX) * (w - padding.left - padding.right);
  const yScale = (v: number) =>
    h - padding.bottom - (v / maxRenda) * (h - padding.top - padding.bottom);

  const path = pontos
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${xScale(p.ano).toFixed(1)} ${yScale(
          p.rendaMensal
        ).toFixed(1)}`
    )
    .join(" ");

  const areaPath = `${path} L ${xScale(maxX).toFixed(1)} ${
    h - padding.bottom
  } L ${xScale(0).toFixed(1)} ${h - padding.bottom} Z`;

  const yTicks = 4;
  const xTicks = Math.min(8, Math.ceil(maxX));

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-auto w-full"
      role="img"
      aria-label="Evolução da renda mensal"
    >
      <defs>
        <linearGradient id="bola-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>

      {Array.from({ length: yTicks + 1 }, (_, i) => {
        const v = (maxRenda / yTicks) * i;
        const y = yScale(v);
        return (
          <g key={`y-${i}`}>
            <line
              x1={padding.left}
              x2={w - padding.right}
              y1={y}
              y2={y}
              stroke="#e2e8f0"
              strokeDasharray="3 4"
            />
            <text
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="11"
              fill="#64748b"
            >
              {brl(v)}
            </text>
          </g>
        );
      })}

      {Array.from({ length: xTicks + 1 }, (_, i) => {
        const ano = (maxX / xTicks) * i;
        const x = xScale(ano);
        return (
          <text
            key={`x-${i}`}
            x={x}
            y={h - 10}
            textAnchor="middle"
            fontSize="11"
            fill="#64748b"
          >
            {ano.toFixed(0)} a
          </text>
        );
      })}

      <path d={areaPath} fill="url(#bola-grad)" />
      <path d={path} fill="none" stroke="#2563eb" strokeWidth={2.5} />
    </svg>
  );
}

export function BolaDeNeve() {
  const [aporteMensal, setAporteMensal] = useState(1000);
  const [patrimonioInicial, setPatrimonioInicial] = useState(0);
  const [dyAnual, setDyAnual] = useState(9);
  const [anos, setAnos] = useState(20);
  const [reinvestir, setReinvestir] = useState(true);

  const pontos = useMemo(
    () => simular({ aporteMensal, patrimonioInicial, dyAnual, anos, reinvestir }),
    [aporteMensal, patrimonioInicial, dyAnual, anos, reinvestir]
  );

  const final = pontos[pontos.length - 1];

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Parâmetros</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Mexa nos valores e veja o gráfico responder.
        </p>

        <div className="mt-5 grid gap-4">
          <NumberInput
            label="Aporte mensal"
            value={aporteMensal}
            onChange={setAporteMensal}
            prefix="R$"
            min={0}
            step={100}
          />
          <NumberInput
            label="Patrimônio inicial em FIIs"
            value={patrimonioInicial}
            onChange={setPatrimonioInicial}
            prefix="R$"
            min={0}
            step={1000}
          />
          <NumberInput
            label="DY médio anual"
            value={dyAnual}
            onChange={setDyAnual}
            suffix="% ao ano"
            min={0.1}
            max={30}
            step={0.5}
          />
          <NumberInput
            label="Horizonte"
            value={anos}
            onChange={setAnos}
            suffix="anos"
            min={1}
            max={60}
            step={1}
          />

          <label className="flex items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5">
            <input
              type="checkbox"
              checked={reinvestir}
              onChange={(e) => setReinvestir(e.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
            <span className="text-sm text-slate-700">
              Reinvestir todos os proventos
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
              Renda no último mês
            </p>
            <p className="mt-1 text-xl font-semibold text-blue-900 sm:text-2xl">
              {brl(final?.rendaMensal ?? 0)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Patrimônio final
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
              {brl(final?.patrimonio ?? 0)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total aportado
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
              {brl(final?.totalAportado ?? 0)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Evolução da renda mensal
            </h3>
            <p className="text-xs text-slate-500">
              {reinvestir
                ? `Reinvestindo a ${percent(dyAnual)} a.a.`
                : "Sem reinvestir os proventos"}
            </p>
          </div>
          <GraficoLinha pontos={pontos} />
        </div>

        <BrokerCta />
      </div>
    </div>
  );
}
