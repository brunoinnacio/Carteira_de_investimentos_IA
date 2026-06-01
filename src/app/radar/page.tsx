import type { Metadata } from "next";
import { Radar } from "./Radar";

export const metadata: Metadata = {
  title: "Radar de FIIs · esse fundo está caro ou barato?",
  description:
    "Cole os indicadores de um FII e descubra na hora se P/VP, Dividend Yield e Yield on Cost estão atrativos, justos ou caros.",
};

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 pt-6 pb-10 sm:pt-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Esse FII está caro ou barato?
          </h1>
          <p className="mt-2 text-slate-600">
            Cole o preço da cota, o último provento e o VPA. O radar calcula
            P/VP, Dividend Yield e Yield on Cost e classifica o fundo segundo
            regras objetivas do mercado.
          </p>
        </div>

        <Radar />
      </section>
    </main>
  );
}
