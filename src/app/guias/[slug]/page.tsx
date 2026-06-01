import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuia, GUIAS } from "@/data/guias";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return GUIAS.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuia(slug);
  if (!g) return { title: "Guia não encontrado" };
  return {
    title: g.titulo,
    description: g.descricao,
    alternates: { canonical: `/guias/${g.slug}` },
    openGraph: {
      title: g.titulo,
      description: g.descricao,
      type: "article",
      url: `${SITE_URL}/guias/${g.slug}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGuia(slug);
  if (!g) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: g.titulo,
        description: g.descricao,
        inLanguage: "pt-BR",
        dateModified: g.atualizadoEm,
        mainEntityOfPage: `${SITE_URL}/guias/${g.slug}`,
        author: { "@type": "Organization", name: "FII Brasil" },
        publisher: { "@type": "Organization", name: "FII Brasil" },
      },
      {
        "@type": "FAQPage",
        mainEntity: g.faq.map((f) => ({
          "@type": "Question",
          name: f.pergunta,
          acceptedAnswer: { "@type": "Answer", text: f.resposta },
        })),
      },
    ],
  };

  const relacionados = g.relacionados
    .map((s) => getGuia(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto w-full max-w-3xl px-6 pt-8 pb-16 sm:pt-10">
        <Link
          href="/guias"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          ← Todos os guias
        </Link>

        <header className="mt-4">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl">
            {g.titulo}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Leitura de {g.leituraMin} min · conteúdo educacional
          </p>
        </header>

        <div className="mt-5 flex flex-col gap-3">
          {g.intro.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-slate-700">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-7">
          {g.secoes.map((s) => (
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

        {/* CTAs para ferramentas */}
        {g.ctas.length > 0 ? (
          <section className="mt-8 flex flex-col gap-3">
            {g.ctas.map((c) => (
              <div
                key={c.href}
                className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-[15px] leading-relaxed text-slate-700">
                  {c.texto}
                </p>
                <Link
                  href={c.href}
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  {c.label} →
                </Link>
              </div>
            ))}
          </section>
        ) : null}

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Perguntas frequentes
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {g.faq.map((f) => (
              <details
                key={f.pergunta}
                className="group rounded-xl border border-slate-200 bg-white p-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-semibold text-slate-900">
                  {f.pergunta}
                  <span
                    className="text-slate-400 transition group-open:rotate-90"
                    aria-hidden
                  >
                    ›
                  </span>
                </summary>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-700">
                  {f.resposta}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Relacionados */}
        {relacionados.length > 0 ? (
          <section className="mt-10 border-t border-slate-200 pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Continue lendo
            </h2>
            <div className="mt-3 flex flex-col gap-2">
              {relacionados.map((r) => (
                <Link
                  key={r.slug}
                  href={`/guias/${r.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300"
                >
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">
                    {r.titulo}
                  </span>
                  <span className="text-blue-600">→</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <p className="mt-8 text-xs leading-relaxed text-slate-500">
          Conteúdo educacional, não recomendação de investimento. Veja o{" "}
          <Link
            href="/aviso-legal"
            className="font-semibold text-slate-600 hover:text-slate-800"
          >
            aviso legal
          </Link>
          .
        </p>
      </article>
    </main>
  );
}
