import type { Metadata } from "next";
import { Glossario } from "./Glossario";

export const metadata: Metadata = {
  title: "Glossário de FIIs · FII Brasil",
  description:
    "Dicionário de termos do mercado de Fundos Imobiliários explicados de forma simples para iniciantes.",
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-8 pb-16 sm:px-6 sm:pt-10 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Glossário de FIIs
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
          Não sabe o que significa Ticker, Yield, P/VP ou Vacância? Aqui você
          encontra cada termo do mundo de Fundos Imobiliários explicado em
          português claro, com exemplos práticos.
        </p>
      </header>
      <Glossario />
    </main>
  );
}
