import type { Metadata } from "next";
import { CalculadoraRenda } from "./CalculadoraRenda";

export const metadata: Metadata = {
  title:
    "Quanto investir para viver de FII? · Calculadora grátis",
  description:
    "Descubra exatamente quanto você precisa investir em Fundos Imobiliários para receber a renda mensal que você quer. Calculadora grátis, sem cadastro.",
};

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-5xl px-6 pt-6 pb-10 sm:pt-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Quanto preciso investir para viver de FII?
          </h1>
          <p className="mt-2 text-slate-600">
            Diga quanto você quer receber por mês e qual o Dividend Yield
            médio dos FIIs que você pretende ter. Mostro o patrimônio
            necessário e quanto tempo leva para chegar lá.
          </p>
        </div>

        <CalculadoraRenda />
      </section>
    </main>
  );
}
