import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-slate-800/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              FII
            </span>
            <span className="text-lg font-semibold tracking-tight">
              FII Brasil
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 sm:flex">
            <a href="#ferramentas" className="hover:text-white">
              Ferramentas
            </a>
            <a href="#como-funciona" className="hover:text-white">
              Como funciona
            </a>
            <a
              href="https://github.com/brunoinnacio/Carteira_de_investimentos_IA"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              GitHub
            </a>
          </nav>
          <a
            href="#lista-espera"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Entrar na lista
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(43,107,255,0.18),_transparent_60%)]" />
          <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
            <div className="flex flex-col items-start gap-6">
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                Em construção · build in public
              </span>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
                Aprenda a viver de renda{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  com Fundos Imobiliários
                </span>
                . Sem virar trader.
              </h1>
              <p className="max-w-2xl text-lg text-slate-300 sm:text-xl">
                Calculadoras, calendário de proventos e radar de oportunidades
                — pensados para quem está começando e quer construir uma renda
                mensal com FIIs.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#lista-espera"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-6 text-base font-medium text-white transition hover:bg-blue-500"
                >
                  Receber as ferramentas grátis
                </a>
                <a
                  href="#como-funciona"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-slate-700 px-6 text-base font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
                >
                  Como funciona
                </a>
              </div>
              <p className="text-sm text-slate-400">
                Grátis durante o desenvolvimento · sem cartão de crédito · sem
                spam
              </p>
            </div>
          </div>
        </section>

        <section
          id="ferramentas"
          className="border-t border-slate-800/60 bg-slate-900/40"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-20">
            <div className="mb-12 max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                O que você vai encontrar aqui
              </h2>
              <p className="mt-3 text-slate-300">
                Tudo o que um investidor iniciante em FIIs precisa para tomar
                decisões com confiança — sem planilha gigante e sem termos
                complicados.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card
                emoji="📅"
                title="Calendário de proventos"
                desc="Veja quanto você vai receber e em que dia, mês a mês. Sem surpresa, sem precisar olhar o app do banco."
              />
              <Card
                emoji="🧮"
                title="Calculadora de quanto investir"
                desc="Diga quanto quer receber por mês. Mostramos quanto precisa investir em cada FII para chegar lá."
              />
              <Card
                emoji="🎯"
                title="Radar de oportunidades"
                desc="P/VP, Dividend Yield e Yield on Cost calculados automaticamente. Sabe na hora se um FII está caro ou barato."
              />
              <Card
                emoji="📊"
                title="Bola de neve"
                desc="Acompanhe sua renda mensal crescer. Gráfico mês a mês para se manter motivado a seguir aportando."
              />
              <Card
                emoji="🏗️"
                title="Rebalanceamento"
                desc="Tijolo, papel, fiagro: o sistema mostra quando uma camada está pesada demais e o que comprar a seguir."
              />
              <Card
                emoji="📥"
                title="Importação B3"
                desc="Suba o extrato em Excel direto da Área do Investidor. O sistema lê tudo e atualiza sua carteira."
              />
            </div>
          </div>
        </section>

        <section id="como-funciona" className="border-t border-slate-800/60">
          <div className="mx-auto w-full max-w-6xl px-6 py-20">
            <div className="mb-12 max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Para quem é o FII Brasil
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
          className="border-t border-slate-800/60 bg-gradient-to-b from-slate-900/60 to-slate-950"
        >
          <div className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Quero ser avisado quando estiver pronto
            </h2>
            <p className="mb-8 mt-4 text-slate-300">
              As primeiras pessoas da lista vão usar tudo de graça e ajudar a
              definir o que vem a seguir.
            </p>
            <WaitlistForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} FII Brasil · feito por Bruno Inácio
          </p>
          <p>
            Conteúdo educacional · não é recomendação de investimento
          </p>
        </div>
      </footer>
    </div>
  );
}

function Card({
  emoji,
  title,
  desc,
}: {
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-slate-700">
      <div className="mb-4 text-3xl">{emoji}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{desc}</p>
    </div>
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
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-sm font-semibold text-blue-300">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{desc}</p>
    </div>
  );
}
