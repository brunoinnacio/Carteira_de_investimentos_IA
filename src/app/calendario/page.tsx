import type { Metadata } from "next";
import { Calendario } from "./Calendario";

export const metadata: Metadata = {
  title: "Calendário de proventos · FII Brasil",
  description:
    "Projeção de quanto você vai receber de proventos dos seus FIIs nos próximos 12 meses, com base na sua carteira.",
};

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 pt-6 pb-10 sm:pt-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Calendário de proventos
          </h1>
          <p className="mt-2 text-slate-600">
            Projeção dos próximos 12 meses com base na sua carteira e no
            provento médio mensal que você informou para cada FII.
          </p>
        </div>

        <Calendario />
      </section>
    </main>
  );
}
