import type { Metadata } from "next";
import { Radar } from "./Radar";

export const metadata: Metadata = {
  title: "Radar · esse FII ou ação está caro ou barato?",
  description:
    "Cole os indicadores de um FII (P/VP, provento, VPA) ou de uma ação (preço, dividendos, LPA) e descubra na hora se está atrativo, justo ou caro, com Dividend Yield e Yield on Cost calculados.",
};

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 pt-6 pb-10 sm:pt-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Esse FII ou ação está caro ou barato?
          </h1>
          <p className="mt-2 text-slate-600">
            Escolha FII ou ação e cole os indicadores. O radar calcula P/VP (ou
            P/L), Dividend Yield e Yield on Cost e classifica o ativo segundo
            regras objetivas do mercado.
          </p>
        </div>

        <Radar />
      </section>
    </main>
  );
}
