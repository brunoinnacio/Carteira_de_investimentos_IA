import type { Metadata } from "next";
import { AluguelVsFii } from "./AluguelVsFii";

export const metadata: Metadata = {
  title: "Aluguel direto ou Fundos Imobiliários? · Comparador",
  description:
    "Comparador grátis: vale mais comprar um imóvel para alugar ou colocar o mesmo dinheiro em Fundos Imobiliários? Veja a renda líquida lado a lado.",
};

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 pt-6 pb-10 sm:pt-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Imóvel próprio ou FII?
          </h1>
          <p className="mt-2 text-slate-600">
            Mesmo valor investido, duas estratégias. Veja lado a lado quanto
            sobra no seu bolso por mês depois de IR, vacância e custos.
          </p>
        </div>

        <AluguelVsFii />
      </section>
    </main>
  );
}
