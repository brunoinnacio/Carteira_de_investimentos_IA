import type { Metadata } from "next";
import Link from "next/link";
import {
  CATEGORIAS,
  type Nivel,
  TIPOS,
  type TipoInvestimento,
} from "@/data/investimentos";

export const metadata: Metadata = {
  title: "Tipos de investimento · O cardápio completo sem palavras difíceis",
  description:
    "Renda fixa, ações, FIIs, ETFs, fundos e cripto explicados de forma simples: o que é, como você ganha, o risco e pra quem é. Sem jargão.",
  alternates: { canonical: "/tipos-de-investimento" },
};

const RISCO_COR: Record<Nivel, string> = {
  Baixo: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Médio: "bg-amber-50 text-amber-700 ring-amber-200",
  Alto: "bg-orange-50 text-orange-700 ring-orange-200",
  "Muito alto": "bg-rose-50 text-rose-700 ring-rose-200",
};

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
      {children}
    </span>
  );
}

function CardTipo({ t }: { t: TipoInvestimento }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="text-2xl" aria-hidden>
          {t.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">{t.nome}</h3>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${
                RISCO_COR[t.risco]
              }`}
            >
              Risco {t.risco.toLowerCase()}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {t.analogia}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Tag>Liquidez: {t.liquidez.toLowerCase()}</Tag>
        <Tag>Prazo: {t.prazo}</Tag>
      </div>

      <details className="group mt-3">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800">
          <span className="transition group-open:rotate-90" aria-hidden>
            ›
          </span>
          Entenda melhor
        </summary>
        <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-700">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              O que é
            </p>
            <p className="mt-0.5">{t.oQueE}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Como você ganha
            </p>
            <p className="mt-0.5">{t.comoVoceGanha}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Pra quem é
            </p>
            <p className="mt-0.5">{t.paraQuem}</p>
          </div>
          {t.atencao ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-[13px] text-amber-900">
                <span className="font-semibold">Atenção: </span>
                {t.atencao}
              </p>
            </div>
          ) : null}
          {t.relacionado ? (
            <Link
              href={t.relacionado.href}
              className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800"
            >
              {t.relacionado.label} →
            </Link>
          ) : null}
        </div>
      </details>
    </div>
  );
}

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-5xl px-6 pt-8 pb-6 sm:pt-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          Guia para iniciantes
        </span>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
          Em que dá pra investir? O cardápio completo
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
          Não existe um investimento &ldquo;certo&rdquo; pra todo mundo — existe
          o que combina com o seu objetivo e com o seu sono tranquilo. Aqui estão
          os principais tipos, explicados sem jargão, com o nível de risco e pra
          quem cada um serve.
        </p>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
          <p>
            <span className="font-semibold text-slate-800">Regra simples: </span>
            quanto maior o ganho prometido, maior o risco. Comece pelos de risco
            baixo (renda fixa), monte sua reserva e só depois tempere com renda
            variável. E lembre:{" "}
            <Link
              href="/aprender/isso-e-golpe"
              className="font-semibold text-blue-700 hover:text-blue-800"
            >
              ganho rápido e garantido é golpe
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="flex flex-col gap-10">
          {CATEGORIAS.map((cat) => {
            const tipos = TIPOS.filter((t) => t.categoria === cat.nome);
            if (tipos.length === 0) return null;
            return (
              <div key={cat.nome}>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  {cat.nome}
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                  {cat.descricao}
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {tipos.map((t) => (
                    <CardTipo key={t.slug} t={t} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            Não sabe por onde começar?
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Faça a trilha &ldquo;Comece do zero&rdquo;: ela te leva do medo até a
            sua primeira renda, um passo de cada vez e sem palavras difíceis.
          </p>
          <Link
            href="/aprender"
            className="mt-3 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Começar do zero →
          </Link>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-slate-500">
          Os níveis de risco, prazo e &ldquo;pra quem é&rdquo; são
          generalizações educacionais para te orientar — não são recomendação de
          investimento. Veja o{" "}
          <Link
            href="/aviso-legal"
            className="font-semibold text-slate-600 hover:text-slate-800"
          >
            aviso legal
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
