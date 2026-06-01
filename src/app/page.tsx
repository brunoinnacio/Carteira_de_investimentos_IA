import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";

type Tool = {
  emoji: string;
  title: string;
  desc: string;
  href: string;
};

const tools: Tool[] = [
  {
    emoji: "🔎",
    title: "Onde investir agora",
    desc: "Screener de FIIs com preço ao vivo. Filtre por Dividend Yield, P/VP, segmento e veja o que está atrativo hoje.",
    href: "/oportunidades",
  },
  {
    emoji: "🧮",
    title: "Quanto investir para viver de FII",
    desc: "Diga quanto quer receber por mês. Mostramos o patrimônio necessário e quanto tempo leva pra chegar lá.",
    href: "/calculadora-renda",
  },
  {
    emoji: "📊",
    title: "Bola de neve",
    desc: "Visualize sua renda mensal crescendo mês a mês com aporte + reinvestimento. Gráfico interativo.",
    href: "/bola-de-neve",
  },
  {
    emoji: "🏠",
    title: "Aluguel vs FII",
    desc: "Mesmo dinheiro, duas estratégias. Veja qual rende mais líquido depois de IR, vacância e manutenção.",
    href: "/aluguel-vs-fii",
  },
  {
    emoji: "🎯",
    title: "Radar de oportunidades",
    desc: "Cole P/VP, DY e VPA de qualquer FII e descubra na hora se está atrativo, justo ou caro.",
    href: "/radar",
  },
  {
    emoji: "📅",
    title: "Calendário de proventos",
    desc: "Projeção dos próximos 12 meses com base na sua carteira. Veja quanto entra cada mês.",
    href: "/calendario",
  },
  {
    emoji: "📥",
    title: "Importação B3",
    desc: "Suba o extrato XLSX da Área do Investidor e o sistema monta sua carteira automaticamente.",
    href: "/importacao",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 pt-8 pb-12 sm:pt-12">
        <div className="flex flex-col items-start gap-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            7 ferramentas no ar · 100% grátis
          </span>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Aprenda a investir do zero{" "}
            <span className="text-blue-700">e a viver de renda</span>. Sem
            economês, sem golpe.
          </h1>
          <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
            Renda fixa, ações, FIIs e mais — explicados com histórias simples
            que qualquer um entende. Mais calculadoras, radar, calendário e
            importação da B3 para colocar em prática.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/calculadora-renda"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Quanto preciso investir? →
            </Link>
            <Link
              href="/importacao"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-blue-600 bg-white px-6 text-sm font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white"
            >
              Importar minha carteira
            </Link>
          </div>
          <p className="text-sm text-slate-500">
            Sem cadastro · sem cartão · sua carteira fica salva no próprio
            navegador
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-start gap-3">
            <span className="text-3xl" aria-hidden>
              🌱
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                Nunca investiu e acha que é complicado ou golpe?
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                A gente te ensina do zero, com histórias que uma criança
                entende — e mostra todos os tipos de investimento, do mais
                seguro ao mais ousado.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/aprender"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Começar do zero →
            </Link>
            <Link
              href="/tipos-de-investimento"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-blue-600 bg-white px-5 text-sm font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white"
            >
              Ver tipos de investimento
            </Link>
          </div>
          <p className="mt-3 text-sm text-blue-900/70">
            Com pressa? Veja os{" "}
            <Link
              href="/guias"
              className="font-semibold text-blue-700 underline hover:text-blue-800"
            >
              guias rápidos
            </Link>{" "}
            — &ldquo;como começar do zero&rdquo;, &ldquo;FII ou renda
            fixa&rdquo; e mais.
          </p>
        </div>
      </section>

      <section
        id="ferramentas"
        className="border-t border-slate-200 bg-white"
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              As 7 ferramentas
            </h2>
            <p className="mt-2 text-slate-600">
              Clique em qualquer uma para abrir. Não precisa de cadastro.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <ToolCard key={t.title} {...t} />
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="border-t border-slate-200">
        <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Para quem é o Renda-se
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Step
              step="1"
              title="Você está começando"
              desc="Ouviu falar que FIIs pagam todo mês isento de IR mas não sabe por onde começar nem quanto investir."
            />
            <Step
              step="2"
              title="Quer renda, não trade"
              desc="Não tem tempo nem vontade de ficar olhando gráfico. Quer dinheiro caindo na conta com previsibilidade."
            />
            <Step
              step="3"
              title="Cansou de planilha"
              desc="Já tentou montar planilha no Excel mas se perde nos cálculos, esquece de atualizar e desiste no meio."
            />
          </div>
        </div>
      </section>

      <section
        id="lista-espera"
        className="border-t border-slate-200 bg-white"
      >
        <div className="mx-auto w-full max-w-3xl px-6 py-14 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Quero ser avisado das próximas atualizações
          </h2>
          <p className="mb-6 mt-3 text-slate-600">
            Já tem 7 ferramentas no ar. Em breve: páginas individuais por FII e
            alertas de preço e provento.
          </p>
          <WaitlistForm />
        </div>
      </section>
    </main>
  );
}

function ToolCard({ emoji, title, desc, href }: Tool) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="text-2xl">{emoji}</div>
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{desc}</p>
      <span className="mt-4 text-sm font-semibold text-blue-700 transition group-hover:text-blue-800">
        Abrir ferramenta →
      </span>
    </Link>
  );
}

function Step({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div>
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-sm font-bold text-blue-700">
        {step}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{desc}</p>
    </div>
  );
}
