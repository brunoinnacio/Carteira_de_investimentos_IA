import type { Metadata } from "next";
import { BolaDeNeve } from "./BolaDeNeve";

export const metadata: Metadata = {
  title: "Simulador de Bola de Neve em FIIs",
  description:
    "Veja sua renda mensal de Fundos Imobiliários crescer mês a mês com o efeito bola de neve dos juros compostos. Simulador grátis.",
};

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 pt-6 pb-10 sm:pt-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            A bola de neve dos FIIs
          </h1>
          <p className="mt-2 text-slate-600">
            Aporte mensal + reinvestimento dos proventos = renda mensal que
            cresce sozinha. Brinca com os números e veja a curva se
            transformar.
          </p>
        </div>

        <BolaDeNeve />
      </section>
    </main>
  );
}
