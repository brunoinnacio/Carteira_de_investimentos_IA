import type { Metadata } from "next";
import { Importacao } from "./Importacao";

export const metadata: Metadata = {
  title: "Importar extrato da B3",
  description:
    "Suba o relatório da Área do Investidor da B3 e o sistema monta sua carteira (FIIs, ações e renda fixa) automaticamente.",
};

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-4xl px-6 pt-6 pb-10 sm:pt-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Importar carteira da B3
          </h1>
          <p className="mt-2 text-slate-600">
            Suba o arquivo da Área do Investidor da B3 e o sistema monta sua
            carteira sozinho. O arquivo é lido 100% no seu navegador — nenhum
            dado vai pra servidor.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Qual arquivo baixar? (explicação simples)
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-900">
                ✅ Posição{" "}
                <span className="font-normal text-emerald-800">
                  (recomendado)
                </span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-emerald-900/80">
                É a foto da sua carteira hoje. Traz <strong>tudo</strong> — FIIs,
                ações <strong>e renda fixa</strong> — com os mesmos valores que
                aparecem na B3. Vira uma cópia fiel.
              </p>
              <p className="mt-2 text-xs text-emerald-900/70">
                Na B3: <strong>Menu → Extratos → Posição</strong> (ou
                &ldquo;Minha carteira&rdquo;) → baixar Excel.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                📄 Movimentação
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                É o histórico de compras e vendas de um período. Serve, mas só
                reconstrói o que está no período e <strong>não traz renda
                fixa</strong>. Use a Posição se puder.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Na B3: <strong>Menu → Extratos → Movimentação</strong> → baixar
                Excel.
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-900">
              Tem algo que não aparece na B3? (COE, previdência, conta no
              exterior…)
            </p>
            <p className="mt-1 text-sm leading-relaxed text-blue-900/80">
              Sem problema. Depois de importar, abra a{" "}
              <strong>carteira</strong>, clique na aba{" "}
              <strong>&ldquo;Renda fixa&rdquo;</strong> e adicione na mão: é só
              dar um <strong>nome</strong> (ex.: &ldquo;COE BTG&rdquo;,
              &ldquo;Previdência XP&rdquo;) e o <strong>valor aplicado</strong>.
              Entra direto na sua carteira e no gráfico.
            </p>
          </div>
        </div>

        <Importacao />
      </section>
    </main>
  );
}
