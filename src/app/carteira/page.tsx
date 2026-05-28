import type { Metadata } from "next";
import { CarteiraView } from "./CarteiraView";

export const metadata: Metadata = {
  title: "Minha Carteira de FIIs · FII Brasil",
  description:
    "Cadastre seus FIIs, quantidade e provento médio mensal. Sua carteira fica salva no próprio navegador e alimenta o calendário e o radar.",
};

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 pt-6 pb-10 sm:pt-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Minha carteira de FIIs
          </h1>
          <p className="mt-2 text-slate-600">
            Adicione os FIIs que você tem (ou que quer simular). A carteira
            fica salva no próprio navegador — nada vai pra servidor nenhum.
          </p>
        </div>

        <CarteiraView />
      </section>
    </main>
  );
}
