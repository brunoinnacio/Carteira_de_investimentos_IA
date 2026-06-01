import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getModulo, getVizinhos, MODULOS } from "@/data/trilha";

export function generateStaticParams() {
  return MODULOS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = getModulo(slug);
  if (!m) return { title: "Módulo não encontrado" };
  return {
    title: `${m.titulo} · Comece do zero`,
    description: m.resumo,
    alternates: { canonical: `/aprender/${m.slug}` },
    openGraph: {
      title: m.titulo,
      description: m.resumo,
      type: "article",
    },
  };
}

const NIVEL_COR: Record<string, string> = {
  "Medo zero": "bg-rose-50 text-rose-700 ring-rose-200",
  "Primeiros passos": "bg-blue-50 text-blue-700 ring-blue-200",
  "Mão na massa": "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = getModulo(slug);
  if (!m) notFound();

  const { anterior, proximo } = getVizinhos(slug);

  return (
    <main className="flex-1">
      <article className="mx-auto w-full max-w-3xl px-6 pt-8 pb-16 sm:pt-10">
        <Link
          href="/aprender"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          ← Trilha completa
        </Link>

        <header className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-400">
              Passo {m.numero}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${
                NIVEL_COR[m.nivel]
              }`}
            >
              {m.nivel}
            </span>
          </div>
          <h1 className="mt-2 flex items-start gap-3 text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl">
            <span className="text-3xl" aria-hidden>
              {m.emoji}
            </span>
            <span>{m.titulo}</span>
          </h1>
        </header>

        {/* Analogia central */}
        <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            A ideia em uma imagem
          </p>
          <h2 className="mt-1.5 text-lg font-semibold text-slate-900">
            {m.analogia.titulo}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-700">
            {m.analogia.texto}
          </p>
        </section>

        {/* Criança x Adulto */}
        <section className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              Pra explicar a uma criança
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {m.paraCrianca}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Na prática (adulto)
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {m.naPratica}
            </p>
          </div>
        </section>

        {/* Seções */}
        <div className="mt-8 flex flex-col gap-7">
          {m.secoes.map((s) => (
            <section key={s.titulo}>
              <h2 className="text-lg font-semibold text-slate-900">
                {s.titulo}
              </h2>
              <div className="mt-2 flex flex-col gap-3">
                {s.paragrafos.map((p, i) => (
                  <p
                    key={i}
                    className="text-[15px] leading-relaxed text-slate-700"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Alerta anti-golpe */}
        {m.alertaGolpe ? (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm font-semibold text-rose-800">
              ⚠️ Cuidado com golpe
            </p>
            <p className="mt-1 text-sm leading-relaxed text-rose-900">
              {m.alertaGolpe}
            </p>
          </div>
        ) : null}

        {/* Pontos-chave */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Leve pra casa
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {m.pontosChave.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                  ✓
                </span>
                <span className="leading-relaxed text-slate-700">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Experimente */}
        {m.experimente ? (
          <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Experimente agora
            </p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-slate-700">
              {m.experimente.texto}
            </p>
            <Link
              href={m.experimente.href}
              className="mt-3 inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              {m.experimente.label} →
            </Link>
          </section>
        ) : null}

        {/* Navegação entre módulos */}
        <nav className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
          {anterior ? (
            <Link
              href={`/aprender/${anterior.slug}`}
              className="group flex flex-1 flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300"
            >
              <span className="text-xs text-slate-400">← Anterior</span>
              <span className="mt-0.5 text-sm font-semibold text-slate-800 group-hover:text-blue-700">
                {anterior.titulo}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {proximo ? (
            <Link
              href={`/aprender/${proximo.slug}`}
              className="group flex flex-1 flex-col rounded-xl border border-slate-200 bg-white p-4 text-right transition hover:border-blue-300"
            >
              <span className="text-xs text-slate-400">Próximo →</span>
              <span className="mt-0.5 text-sm font-semibold text-slate-800 group-hover:text-blue-700">
                {proximo.titulo}
              </span>
            </Link>
          ) : (
            <Link
              href="/oportunidades"
              className="group flex flex-1 flex-col rounded-xl border border-blue-200 bg-blue-50 p-4 text-right transition hover:border-blue-300"
            >
              <span className="text-xs text-blue-500">Você terminou! →</span>
              <span className="mt-0.5 text-sm font-semibold text-blue-800">
                Ver FIIs na prática
              </span>
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
}
