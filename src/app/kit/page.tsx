import type { Metadata } from "next";
import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Kit grátis do investidor iniciante",
  description:
    "Baixe grátis a planilha de carteira + o checklist de quem está começando a investir. Sem pagar nada, sem palavras difíceis.",
  alternates: { canonical: "/kit" },
};

const checklist = [
  {
    titulo: "Monte sua reserva de emergência primeiro",
    desc: "De 3 a 6 meses dos seus gastos, em algo que rende e você saca a qualquer hora (Tesouro Selic ou CDB de liquidez diária).",
  },
  {
    titulo: "Quite as dívidas caras antes de investir",
    desc: "Cartão e cheque especial cobram juros muito maiores do que qualquer investimento rende. Pague essas primeiro.",
  },
  {
    titulo: "Descubra seu objetivo",
    desc: "Segurança, renda todo mês ou crescimento no longo prazo? O objetivo define onde investir.",
  },
  {
    titulo: "Comece pelo simples e seguro",
    desc: "Renda fixa atrelada ao CDI/Selic é o ponto de partida tranquilo enquanto você aprende.",
  },
  {
    titulo: "Invista todo mês, no automático",
    desc: "Aporte regular vale mais que acertar o 'momento certo'. Constância é o segredo dos juros compostos.",
  },
  {
    titulo: "Diversifique aos poucos",
    desc: "Com o tempo, distribua entre renda fixa, FIIs e ações. Não coloque tudo num lugar só.",
  },
  {
    titulo: "Fuja de promessa de dinheiro fácil",
    desc: "Retorno garantido alto e 'grupo de sinais' são clássicos de golpe. Desconfie sempre.",
  },
  {
    titulo: "Reinvista os proventos",
    desc: "Cada dividendo recebido compra mais um pedacinho — é a bola de neve trabalhando por você.",
  },
];

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-3xl px-6 pt-8 pb-12 sm:pt-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          100% grátis · sem pegadinha
        </span>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
          Kit do investidor iniciante
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg">
          Uma planilha simples para organizar sua carteira e um checklist com os
          8 passos de quem está começando do jeito certo. Baixe agora, sem pagar
          nada.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href="/planilha-carteira-bolsacheia.csv"
            download
            className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Baixar planilha de carteira (CSV) ↓
          </a>
          <Link
            href="/carteira"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-blue-600 bg-white px-6 text-sm font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white"
          >
            Ou monte direto no site
          </Link>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Abre no Excel ou no Google Planilhas. Apague as linhas de exemplo e
          coloque os seus.
        </p>

        <div className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Checklist: os 8 passos de quem começa do jeito certo
          </h2>
          <ol className="mt-5 flex flex-col gap-4">
            {checklist.map((item, i) => (
              <li
                key={item.titulo}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{item.titulo}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Quer receber os próximos guias?
          </h2>
          <p className="mb-5 mt-2 text-sm text-slate-600">
            Deixe seu email e avisamos quando sair material novo. Sem spam — só
            conteúdo útil, quando tiver.
          </p>
          <WaitlistForm source="kit" cta="Quero receber" />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Conteúdo educacional — não é recomendação de investimento. Veja o{" "}
            <Link
              href="/aviso-legal"
              className="font-semibold text-blue-700 hover:text-blue-800"
            >
              aviso legal
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
