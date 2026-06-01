import type { Metadata } from "next";
import { Importacao } from "./Importacao";

export const metadata: Metadata = {
  title: "Importar extrato da B3",
  description:
    "Suba o extrato em XLSX da Área do Investidor da B3 e o sistema monta sua carteira de FIIs automaticamente.",
};

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-4xl px-6 pt-6 pb-10 sm:pt-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Importar extrato da B3
          </h1>
          <p className="mt-2 text-slate-600">
            Acesse a Área do Investidor da B3 → menu Extrato → Movimentação →
            Baixe o XLSX. Depois solte o arquivo aqui.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            O arquivo é processado 100% no seu navegador. Nenhum dado é
            enviado pra servidor.
          </p>
        </div>

        <Importacao />
      </section>
    </main>
  );
}
