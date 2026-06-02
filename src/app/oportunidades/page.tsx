import type { Metadata } from "next";
import Link from "next/link";
import { ExploradorAtivos } from "./ExploradorAtivos";

export const metadata: Metadata = {
  title: "Onde investir agora",
  description:
    "Guia simples para iniciantes: descubra onde investir hoje de acordo com o seu objetivo — segurança (renda fixa), renda mensal (FIIs) ou dividendos de ações. Explorador de FIIs e ações com preço ao vivo. Ferramenta educacional, não é recomendação.",
  alternates: { canonical: "/oportunidades" },
};

type Opcao = {
  emoji: string;
  objetivo: string;
  tipo: string;
  desc: string;
  exemplo: string;
  cor: string;
  href: string;
  cta: string;
};

const OPCOES: Opcao[] = [
  {
    emoji: "🛡️",
    objetivo: "Quero segurança",
    tipo: "Renda fixa",
    desc: "Para a reserva de emergência e dinheiro que você pode precisar em breve. Risco baixo e resgate fácil.",
    exemplo: "Ex.: Tesouro Selic, CDB de banco grande, LCI/LCA.",
    cor: "teal",
    href: "/tipos-de-investimento",
    cta: "Entender renda fixa",
  },
  {
    emoji: "💸",
    objetivo: "Quero renda todo mês",
    tipo: "FIIs",
    desc: "Fundos imobiliários pagam um pinguinho na sua conta quase todo mês, geralmente isento de Imposto de Renda.",
    exemplo: "Use o explorador de FIIs aqui embaixo para ver o que está atrativo.",
    cor: "blue",
    href: "#explorar",
    cta: "Explorar FIIs ↓",
  },
  {
    emoji: "🚀",
    objetivo: "Quero crescer no longo prazo",
    tipo: "Ações",
    desc: "Comprar pedacinhos de empresas. Sobe e desce mais, mas tende a render mais em muitos anos. Muitas ainda pagam dividendos.",
    exemplo: "Use o explorador de ações aqui embaixo para ver quem paga bons dividendos.",
    cor: "violet",
    href: "#explorar",
    cta: "Explorar ações ↓",
  },
];

const COR_MAP: Record<string, string> = {
  teal: "border-teal-200 bg-teal-50",
  blue: "border-blue-200 bg-blue-50",
  violet: "border-violet-200 bg-violet-50",
};
const COR_BADGE: Record<string, string> = {
  teal: "bg-teal-100 text-teal-800 ring-teal-200",
  blue: "bg-blue-100 text-blue-800 ring-blue-200",
  violet: "bg-violet-100 text-violet-800 ring-violet-200",
};

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 pt-8 pb-16 sm:pt-10">
        <header className="mb-8 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Onde investir agora
          </h1>
          <p className="mt-2 text-slate-600">
            Não existe um único lugar &ldquo;certo&rdquo; — depende do seu{" "}
            <strong>objetivo</strong> e de quando você vai precisar do dinheiro.
            Escolha abaixo pelo que você quer e a gente te mostra o caminho. Isso
            é educação, não recomendação.
          </p>
        </header>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {OPCOES.map((o) => (
            <div
              key={o.tipo}
              className={`flex flex-col rounded-2xl border p-5 ${COR_MAP[o.cor]}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden>
                  {o.emoji}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ${COR_BADGE[o.cor]}`}
                >
                  {o.tipo}
                </span>
              </div>
              <h2 className="mt-3 text-base font-semibold text-slate-900">
                {o.objetivo}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {o.desc}
              </p>
              <p className="mt-2 text-xs text-slate-500">{o.exemplo}</p>
              <Link
                href={o.href}
                className="mt-4 inline-flex items-center text-sm font-semibold text-slate-900 hover:underline"
              >
                {o.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          <strong className="text-slate-900">Na dúvida por onde começar?</strong>{" "}
          A maioria das pessoas monta uma base de{" "}
          <strong>renda fixa</strong> (reserva de emergência) e só depois
          adiciona <strong>FIIs</strong> e <strong>ações</strong> aos poucos.
          Veja o passo a passo nos{" "}
          <Link
            href="/guias"
            className="font-semibold text-blue-700 underline hover:text-blue-800"
          >
            guias para iniciantes
          </Link>
          .
        </div>

        <div id="explorar" className="scroll-mt-20 border-t border-slate-200 pt-10">
          <header className="mb-6 max-w-2xl">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Explorar ativos de renda
            </h2>
            <p className="mt-2 text-slate-600">
              Filtre FIIs e ações pagadoras de dividendos por critérios
              objetivos. Preço ao vivo, indicadores calculados na hora. Não é
              recomendação — é uma ferramenta para você decidir com clareza.
            </p>
          </header>
          <ExploradorAtivos />
        </div>
      </section>
    </main>
  );
}
