import type { Metadata } from "next";
import { Screener } from "./Screener";

export const metadata: Metadata = {
  title: "Onde investir agora · Screener de FIIs",
  description:
    "Filtre Fundos Imobiliários por Dividend Yield, P/VP, segmento e liquidez. Indicadores calculados com preço ao vivo e regras transparentes. Ferramenta educacional.",
  alternates: { canonical: "/oportunidades" },
};

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 pt-8 pb-16 sm:pt-10">
        <header className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Onde investir agora — screener de FIIs
          </h1>
          <p className="mt-2 text-slate-600">
            Use filtros objetivos para encontrar FIIs que batem com o seu
            critério. O preço é ao vivo e o P/VP e o Dividend Yield são
            calculados na hora. Não é recomendação — é uma ferramenta para você
            decidir com clareza.
          </p>
        </header>
        <Screener />
      </section>
    </main>
  );
}
