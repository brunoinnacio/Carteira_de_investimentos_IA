import type { Metadata } from "next";
import Link from "next/link";
import { GUIAS } from "@/data/guias";

export const metadata: Metadata = {
  title: "Guias para iniciantes · Aprenda a investir sem jargão",
  description:
    "Respostas diretas e sem palavras difíceis para as maiores dúvidas de quem está começando a investir: por onde começar, com pouco dinheiro, FII ou renda fixa e como não cair em golpe.",
  alternates: { canonical: "/guias" },
};

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-3xl px-6 pt-8 pb-6 sm:pt-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          Guias para iniciantes
        </span>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
          As maiores dúvidas de quem está começando
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg">
          Respostas diretas, sem jargão e sem promessa milagrosa. Cada guia te
          leva pela mão e aponta o próximo passo prático.
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 pb-16">
        <div className="flex flex-col gap-3">
          {GUIAS.map((g) => (
            <Link
              key={g.slug}
              href={`/guias/${g.slug}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                {g.titulo}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {g.descricao}
              </p>
              <span className="mt-3 inline-block text-sm font-semibold text-blue-700 transition group-hover:text-blue-800">
                Ler guia · {g.leituraMin} min →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
