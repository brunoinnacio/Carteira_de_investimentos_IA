import type { Metadata } from "next";
import Link from "next/link";
import { MODULOS, NIVEIS } from "@/data/trilha";

export const metadata: Metadata = {
  title: "Comece do zero · Educação financeira sem palavras difíceis",
  description:
    "Aprenda a investir do absoluto zero, com analogias simples que servem dos 8 aos 80 anos. Sem jargão, sem golpe. Do medo à sua primeira renda mensal.",
  alternates: { canonical: "/aprender" },
};

const NIVEL_COR: Record<string, string> = {
  "Medo zero": "bg-rose-50 text-rose-700 ring-rose-200",
  "Primeiros passos": "bg-blue-50 text-blue-700 ring-blue-200",
  "Mão na massa": "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-3xl px-6 pt-8 pb-6 sm:pt-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          Trilha gratuita · sem palavras difíceis
        </span>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
          Comece do zero, sem medo e sem jargão
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg">
          Sabe quando você acha que investir é coisa de rico, é complicado ou é
          golpe? Esta trilha foi feita pra isso passar. Usamos histórias simples
          — árvore que dá frutos, galinha dos ovos de ouro, bola de neve — que
          uma criança de 8 anos e um adulto de 50 entendem igual. Um passo de
          cada vez, até você ler a sua própria planilha da B3.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/aprender/${MODULOS[0].slug}`}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Começar pelo passo 1 →
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 pb-16">
        <ol className="relative flex flex-col gap-3 border-l border-slate-200 pl-6">
          {MODULOS.map((m) => (
            <li key={m.slug} className="relative">
              <span className="absolute -left-[31px] top-5 flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-600">
                {m.numero}
              </span>
              <Link
                href={`/aprender/${m.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="text-2xl" aria-hidden>
                  {m.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${
                        NIVEL_COR[m.nivel]
                      }`}
                    >
                      {m.nivel}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {m.titulo}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {m.resumo}
                  </p>
                  <span className="mt-2 inline-block text-sm font-semibold text-blue-700 transition group-hover:text-blue-800">
                    Abrir módulo →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
          <p>
            Os níveis indicam por onde começar:{" "}
            {NIVEIS.map((n, i) => (
              <span key={n}>
                <strong>{n}</strong>
                {i < NIVEIS.length - 1 ? " → " : "."}
              </span>
            ))}{" "}
            Não precisa ter dinheiro nenhum pra começar — só vontade de
            entender. Conteúdo educacional, não recomendação de investimento.
          </p>
        </div>
      </section>
    </main>
  );
}
