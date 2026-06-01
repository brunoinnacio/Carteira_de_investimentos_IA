import type { Classe } from "@/lib/carteira";
import { brl } from "@/lib/format";

const META: Record<Classe, { label: string; cor: string }> = {
  fii: { label: "FIIs", cor: "#3b82f6" },
  acao: { label: "Ações", cor: "#8b5cf6" },
  rendaFixa: { label: "Renda fixa", cor: "#14b8a6" },
};

const ORDEM: Classe[] = ["rendaFixa", "fii", "acao"];

function Donut({ data }: { data: { valor: number; cor: string }[] }) {
  const total = data.reduce((a, d) => a + d.valor, 0) || 1;
  const r = 60;
  const sw = 26;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <div className="relative h-40 w-40 shrink-0">
      <svg viewBox="0 0 160 160" className="h-40 w-40 -rotate-90">
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
            />
          );
          acc += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Total
        </span>
        <span className="text-base font-semibold text-slate-900">
          {brl(total)}
        </span>
      </div>
    </div>
  );
}

export function AlocacaoDonut({
  porClasse,
  total,
}: {
  porClasse: Record<Classe, number>;
  total: number;
}) {
  if (total <= 0) return null;
  const itens = ORDEM.map((classe) => ({
    classe,
    valor: porClasse[classe],
    pct: (porClasse[classe] / total) * 100,
  })).filter((i) => i.valor > 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Alocação por classe
      </h2>
      <div className="mt-3 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <Donut data={itens.map((i) => ({ valor: i.valor, cor: META[i.classe].cor }))} />
        <ul className="w-full flex-1 flex-col gap-3">
          {itens.map((i) => (
            <li key={i.classe} className="flex items-center gap-3 py-1">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ background: META[i.classe].cor }}
              />
              <span className="w-24 text-sm font-medium text-slate-700">
                {META[i.classe].label}
              </span>
              <span className="flex-1 text-right text-sm font-semibold tabular-nums text-slate-900">
                {i.pct.toFixed(1)}%
              </span>
              <span className="w-32 text-right text-sm tabular-nums text-slate-500">
                {brl(i.valor)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
