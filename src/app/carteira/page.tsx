import type { Metadata } from "next";
import { CarteiraView } from "./CarteiraView";
import { CarteiraSyncBanner } from "@/components/CarteiraSyncBanner";

export const metadata: Metadata = {
  title: "Minha Carteira de FIIs · FII Brasil",
  description:
    "Cadastre seus FIIs, quantidade e provento médio mensal. Use sem cadastro (salvo no navegador) ou crie uma conta grátis para sincronizar e acessar de qualquer lugar.",
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
            Adicione os FIIs que você tem (ou que quer simular). Sem conta, fica
            salva neste navegador; com conta grátis, sincroniza na nuvem e você
            acessa de qualquer lugar.
          </p>
        </div>

        <CarteiraSyncBanner />

        <CarteiraView />
      </section>
    </main>
  );
}
