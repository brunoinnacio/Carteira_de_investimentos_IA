import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso legal e isenção de responsabilidade",
  description:
    "FII Brasil é uma ferramenta educacional. Não constitui recomendação de investimento. Entenda os limites de uso e como tratamos seus dados.",
  alternates: { canonical: "/aviso-legal" },
};

function Bloco({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-slate-900">{titulo}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-slate-700">
        {children}
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-3xl px-6 pt-8 pb-16 sm:pt-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Aviso legal e isenção de responsabilidade
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Última atualização: junho de 2026. Leia com atenção antes de usar as
            ferramentas.
          </p>
        </header>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">
              O FII Brasil é uma ferramenta educacional. Nada aqui é
              recomendação de investimento.
            </p>
            <p className="mt-1.5">
              Os cálculos, simulações, indicadores e filtros têm finalidade
              exclusivamente informativa e educacional. Não representam oferta,
              solicitação ou recomendação de compra ou venda de qualquer ativo.
            </p>
          </div>

          <Bloco titulo="Não somos analistas nem consultores de valores mobiliários">
            <p>
              O FII Brasil não é uma instituição financeira, corretora,
              consultoria ou casa de análise, e não possui profissionais
              certificados (CNPI) emitindo recomendações. Conforme a Resolução
              CVM nº 20/2021, recomendações de investimento personalizadas só
              podem ser feitas por analistas autorizados — o que não é o caso
              deste site.
            </p>
          </Bloco>

          <Bloco titulo="Decisões são de sua responsabilidade">
            <p>
              Qualquer decisão de investimento é de sua inteira
              responsabilidade. Antes de investir, consulte um profissional
              autorizado e leia os documentos oficiais dos fundos (regulamento,
              lâmina, relatórios gerenciais e informes da CVM/B3).
            </p>
            <p>
              Rentabilidade passada não representa garantia de rentabilidade
              futura. Todo investimento envolve riscos, incluindo a perda do
              capital investido.
            </p>
          </Bloco>

          <Bloco titulo="Dados e cotações podem conter imprecisões">
            <p>
              Preços e cotações exibidos vêm de fontes públicas de terceiros,
              podem ter atraso (normalmente de alguns minutos) e podem conter
              erros ou indisponibilidades. Não garantimos exatidão, completude
              ou atualização em tempo real. Sempre confirme os números nos
              canais oficiais antes de decidir.
            </p>
          </Bloco>

          <Bloco titulo="Como seus dados são tratados">
            <p>
              A carteira que você monta nas ferramentas é salva apenas no seu
              próprio navegador (armazenamento local). Não enviamos esses dados
              para nossos servidores; se você limpar o cache do navegador ou
              trocar de dispositivo, eles serão perdidos.
            </p>
            <p>
              Caso você crie uma conta, tratamos apenas os dados necessários
              para autenticação (como e-mail), processados por nosso provedor de
              identidade. Não vendemos seus dados.
            </p>
          </Bloco>

          <Bloco titulo="Links de terceiros e afiliados">
            <p>
              Podemos exibir links para corretoras e outros serviços, inclusive
              links de afiliados que podem gerar comissão. Isso não influencia o
              caráter educacional do conteúdo e não constitui recomendação de
              contratação.
            </p>
          </Bloco>

          <p className="text-sm text-slate-600">
            Dúvidas? Volte para a{" "}
            <Link
              href="/"
              className="font-semibold text-blue-700 hover:text-blue-800"
            >
              página inicial
            </Link>{" "}
            ou consulte o{" "}
            <Link
              href="/glossario"
              className="font-semibold text-blue-700 hover:text-blue-800"
            >
              glossário
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
