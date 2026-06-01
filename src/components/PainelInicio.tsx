"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCarteira, totaisPorClasse, type Classe } from "@/lib/carteira";
import { CARTEIRA_EXEMPLO } from "@/data/carteiraExemplo";
import { brl, percent } from "@/lib/format";

const META: Record<Classe, { label: string; cor: string }> = {
  fii: { label: "FIIs", cor: "#3b82f6" },
  acao: { label: "Ações", cor: "#8b5cf6" },
  rendaFixa: { label: "Renda fixa", cor: "#14b8a6" },
};

const ORDEM: Classe[] = ["rendaFixa", "fii", "acao"];

// Carteira de exemplo (mostrada para quem ainda não tem posições).
const EXEMPLO: Record<Classe, number> = {
  rendaFixa: 5000,
  fii: 3000,
  acao: 2000,
};

function Donut({
  data,
  centroTitulo,
  centroValor,
}: {
  data: { valor: number; cor: string }[];
  centroTitulo: string;
  centroValor: string;
}) {
  const total = data.reduce((a, d) => a + d.valor, 0) || 1;
  const r = 60;
  const sw = 26;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <div className="relative h-44 w-44 shrink-0">
      <svg viewBox="0 0 160 160" className="h-44 w-44 -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#f1f5f9" strokeWidth={sw} />
        {data.map((d, i) => {
          const len = (d.valor / total) * c;
          const el = (
            <circle
              key={i}
              cx="80"
              cy="80"
              r={r}
              fill="none"
              stroke={d.cor}
              strokeWidth={sw}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-acc}
              strokeLinecap="butt"
            />
          );
          acc += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {centroTitulo}
        </span>
        <span className="text-lg font-semibold text-slate-900">
          {centroValor}
        </span>
      </div>
    </div>
  );
}

export function PainelInicio() {
  const { posicoes, hydrated, substituir } = useCarteira();
  const router = useRouter();
  const [carregandoExemplo, setCarregandoExemplo] = useState(false);
  const { porClasse, total } = useMemo(
    () => totaisPorClasse(posicoes),
    [posicoes]
  );

  function carregarExemplo() {
    if (
      posicoes.length > 0 &&
      !window.confirm(
        "Isso vai substituir sua carteira atual por uma de exemplo. Deseja continuar?"
      )
    ) {
      return;
    }
    setCarregandoExemplo(true);
    substituir(CARTEIRA_EXEMPLO);
    router.push("/carteira");
  }

  const temCarteira = total > 0;
  const fonte = temCarteira ? porClasse : EXEMPLO;
  const totalFonte = temCarteira
    ? total
    : EXEMPLO.fii + EXEMPLO.acao + EXEMPLO.rendaFixa;

  const itens = ORDEM.map((classe) => ({
    classe,
    valor: fonte[classe],
    pct: totalFonte > 0 ? (fonte[classe] / totalFonte) * 100 : 0,
  })).filter((i) => i.valor > 0);

  const dataDonut = itens.map((i) => ({ valor: i.valor, cor: META[i.classe].cor }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            {temCarteira ? "Sua carteira hoje" : "Sua carteira fica assim"}
          </h2>
          <p className="text-xs text-slate-500">
            {temCarteira
              ? "Quanto você tem em cada tipo de investimento."
              : "Exemplo de como o site mostra suas aplicações por tipo."}
          </p>
        </div>
        {!temCarteira ? (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200">
            exemplo
          </span>
        ) : null}
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        <Donut
          data={dataDonut}
          centroTitulo={temCarteira ? "Patrimônio" : "Exemplo"}
          centroValor={brl(totalFonte)}
        />

        <div className="w-full flex-1">
          <ul className="flex flex-col gap-3">
            {itens.map((i) => (
              <li key={i.classe} className="flex items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ background: META[i.classe].cor }}
                />
                <span className="w-24 text-sm font-medium text-slate-700">
                  {META[i.classe].label}
                </span>
                <span className="flex-1 text-right text-sm font-semibold tabular-nums text-slate-900">
                  {percent(i.pct, 1)}
                </span>
                <span className="w-28 text-right text-sm tabular-nums text-slate-500">
                  {brl(i.valor)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            {temCarteira ? (
              <Link
                href="/carteira"
                className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Ver carteira completa →
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={carregarExemplo}
                  disabled={carregandoExemplo}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {carregandoExemplo
                    ? "Carregando…"
                    : "Ver demonstração (R$ 100 mil) →"}
                </button>
                <Link
                  href="/importacao"
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-blue-600 bg-white px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                >
                  Importar minha carteira
                </Link>
              </>
            )}
          </div>
          {!hydrated ? (
            <p className="mt-2 text-center text-xs text-slate-400">
              Carregando sua carteira…
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
