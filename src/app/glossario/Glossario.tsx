"use client";

import { useMemo, useState } from "react";

type Termo = {
  termo: string;
  sinonimos?: string[];
  resumo: string;
  exemplo?: string;
};

type Categoria = {
  id: string;
  titulo: string;
  emoji: string;
  descricao: string;
  termos: Termo[];
};

const CATEGORIAS: Categoria[] = [
  {
    id: "basico",
    titulo: "O básico (comece por aqui)",
    emoji: "📘",
    descricao:
      "Conceitos fundamentais que você precisa entender antes de qualquer indicador.",
    termos: [
      {
        termo: "FII",
        sinonimos: ["Fundo Imobiliário", "Fundo de Investimento Imobiliário"],
        resumo:
          "Um condomínio de investidores que junta dinheiro para comprar imóveis (galpões, shoppings, lajes corporativas) ou títulos imobiliários. Em vez de comprar um imóvel inteiro, você compra uma fração e recebe parte do aluguel mensalmente.",
        exemplo:
          "Comprar 100 cotas de HGLG11 a R$ 160 é o mesmo que ser sócio minoritário de dezenas de galpões logísticos pelo Brasil.",
      },
      {
        termo: "Cota",
        resumo:
          "A menor 'fatia' do fundo que você pode comprar. Cada cota representa sua participação no patrimônio total do fundo.",
        exemplo:
          "Se o fundo tem 10 milhões de cotas e você tem 100, você é dono de 0,001% do fundo.",
      },
      {
        termo: "Ticker",
        sinonimos: ["Código de negociação"],
        resumo:
          "O 'apelido' de quatro letras + número 11 (ou 12) que o fundo recebe na bolsa para ser comprado e vendido. Sempre quatro letras maiúsculas seguidas de 11.",
        exemplo:
          "MXRF11 (Maxi Renda), KNCR11 (Kinea Rendimentos), HGLG11 (CSHG Logística). O '11' identifica que é cota cheia de FII.",
      },
      {
        termo: "Provento",
        sinonimos: ["Rendimento", "Dividendo"],
        resumo:
          "O dinheiro que o fundo te paga, normalmente todo mês, equivalente à sua parte do aluguel recebido (ou dos juros dos títulos). É isento de Imposto de Renda para pessoa física.",
        exemplo:
          "Você tem 200 cotas de MXRF11 e o fundo distribui R$ 0,10 por cota neste mês: você recebe R$ 20,00 direto na sua conta da corretora.",
      },
      {
        termo: "Rendimento mensal",
        resumo:
          "O total de proventos que você recebe em um mês, somando todos os FIIs da sua carteira. É a sua 'renda passiva' do mês.",
        exemplo:
          "Carteira com R$ 50.000 investidos rendendo 0,8% ao mês = R$ 400 de rendimento no mês.",
      },
      {
        termo: "B3",
        sinonimos: ["Bolsa", "Bolsa de Valores"],
        resumo:
          "A bolsa de valores brasileira (B3 S.A.). É o lugar onde as cotas dos FIIs são compradas e vendidas, através de uma corretora.",
      },
      {
        termo: "Corretora",
        resumo:
          "Empresa intermediária (BTG, XP, NuInvest, Rico, Clear, Itaú etc.) que te dá acesso à B3 para comprar e vender cotas. Hoje a maioria não cobra taxa para FIIs.",
      },
    ],
  },
  {
    id: "tipos",
    titulo: "Tipos de FII",
    emoji: "🏢",
    descricao:
      "Como os fundos são classificados pelo que possuem dentro.",
    termos: [
      {
        termo: "FII de Tijolo",
        resumo:
          "Fundo que possui imóveis físicos (galpões, shoppings, escritórios, hospitais). O dinheiro vem do aluguel desses imóveis. Tende a se valorizar com a inflação.",
        exemplo: "HGLG11 (galpões), XPML11 (shoppings), HGRU11 (varejo).",
      },
      {
        termo: "FII de Papel",
        sinonimos: ["FII de Recebíveis"],
        resumo:
          "Fundo que investe em títulos de dívida ligados ao mercado imobiliário (CRI, LCI). O dinheiro vem dos juros desses títulos. Geralmente tem rendimento mais previsível e ligado ao IPCA/CDI.",
        exemplo: "MXRF11, KNCR11, KNSC11.",
      },
      {
        termo: "FII Híbrido",
        resumo:
          "Mistura tijolo e papel na mesma carteira. Tenta equilibrar previsibilidade do papel com valorização do tijolo.",
      },
      {
        termo: "Fundo de Fundos",
        sinonimos: ["FoF", "FII de Fundos"],
        resumo:
          "Em vez de comprar imóveis ou títulos, compra cotas de outros FIIs. É como um 'pacote diversificado' já pronto.",
        exemplo: "HFOF11, BCFF11.",
      },
      {
        termo: "Logística",
        resumo:
          "Subtipo de FII de Tijolo que possui galpões de armazenagem e distribuição (Mercado Livre, Amazon, varejistas). Cresceu muito com o e-commerce.",
      },
      {
        termo: "Lajes Corporativas",
        resumo:
          "Subtipo de FII de Tijolo que possui andares de prédios comerciais alugados para empresas. Sofre mais em crises e com home office.",
      },
      {
        termo: "Shoppings",
        resumo:
          "Subtipo de FII de Tijolo que possui participação em shoppings centers. Renda depende do movimento de lojistas e vendas.",
      },
      {
        termo: "Recebíveis (CRI/CRA)",
        resumo:
          "Certificados de Recebíveis Imobiliários (CRI) ou do Agronegócio (CRA): títulos onde uma empresa toma dinheiro emprestado e devolve com juros, dando o imóvel como garantia. É o 'estoque' dos FIIs de papel.",
      },
    ],
  },
  {
    id: "indicadores",
    titulo: "Indicadores essenciais",
    emoji: "📊",
    descricao:
      "Os números que você vai ver em todo lugar quando analisar um FII. Saber lê-los é meio caminho.",
    termos: [
      {
        termo: "DY (Dividend Yield)",
        sinonimos: ["Yield", "Rendimento %"],
        resumo:
          "Quanto o fundo paga de proventos no ano, em porcentagem do preço atual da cota. Mostra o 'rendimento' do investimento, parecido com a taxa de uma poupança ou CDB.",
        exemplo:
          "Cota custa R$ 100 e paga R$ 10 em proventos no ano = DY de 10%. Quanto maior, mais o fundo paga proporcionalmente ao preço.",
      },
      {
        termo: "YoC (Yield on Cost)",
        sinonimos: ["Yield no preço médio"],
        resumo:
          "Diferente do DY: aqui o cálculo usa o preço que VOCÊ pagou (seu preço médio), não o preço atual de mercado. Mostra o rendimento real do seu investimento original.",
        exemplo:
          "Você comprou MXRF11 a R$ 9,00 (PM) e ele paga R$ 1,20 ao ano = YoC de 13,3%, mesmo que hoje a cota esteja R$ 10 (DY de mercado = 12%).",
      },
      {
        termo: "P/VP",
        sinonimos: ["Preço sobre Valor Patrimonial"],
        resumo:
          "Compara o preço de mercado da cota com o valor 'contábil' do patrimônio do fundo (VPA). Indica se você está pagando caro ou barato pelo que o fundo possui de fato.",
        exemplo:
          "P/VP = 1,00 significa preço de mercado igual ao patrimônio. Abaixo de 1 (ex: 0,85) é descontado, acima (ex: 1,15) é com ágio. Não é regra absoluta, mas é um termômetro.",
      },
      {
        termo: "VPA",
        sinonimos: ["Valor Patrimonial por Cota"],
        resumo:
          "Quanto vale 'no papel' cada cota, considerando o patrimônio líquido do fundo dividido pelo número de cotas existentes.",
        exemplo:
          "Fundo tem R$ 1 bilhão de patrimônio e 10 milhões de cotas = VPA de R$ 100 por cota.",
      },
      {
        termo: "Vacância",
        sinonimos: ["Vacância média", "Vacância física"],
        resumo:
          "Porcentagem dos imóveis do fundo que está sem inquilino. Quanto menor, melhor (mais imóveis gerando aluguel).",
        exemplo:
          "Fundo tem 10 galpões e 2 estão vazios = vacância física de 20%. Em FIIs de tijolo saudáveis, costuma ficar entre 0% e 10%.",
      },
      {
        termo: "Vacância financeira",
        resumo:
          "Como a vacância acima, mas medida em dinheiro: quanto da receita potencial de aluguel está sendo perdida pelos imóveis vazios. Pode ser diferente da vacância física quando os imóveis vagos pagam aluguéis diferentes.",
      },
      {
        termo: "Liquidez Média Diária",
        sinonimos: ["Liquidez"],
        resumo:
          "Quanto dinheiro em cotas do fundo é negociado por dia, em média. Importante para conseguir comprar/vender sem afetar o preço.",
        exemplo:
          "Liquidez de R$ 5 milhões/dia = você consegue entrar/sair facilmente. Abaixo de R$ 500 mil/dia = cuidado, pode ser difícil vender uma posição maior.",
      },
      {
        termo: "Cap Rate",
        sinonimos: ["Taxa de Capitalização"],
        resumo:
          "Quanto um imóvel rende de aluguel por ano em relação ao seu valor. É o 'DY do imóvel' antes de virar fundo. Usado para avaliar se o fundo comprou bem.",
      },
      {
        termo: "Gestão Ativa",
        resumo:
          "Fundo onde o gestor toma decisões frequentes (comprar/vender imóveis, trocar inquilinos, alongar dívidas). Cobra taxa de administração maior, mas pode entregar mais valor.",
      },
      {
        termo: "Gestão Passiva",
        resumo:
          "Fundo praticamente sem decisões discricionárias: compra os ativos e fica recebendo. Taxa menor, comportamento mais previsível.",
      },
    ],
  },
  {
    id: "calculos",
    titulo: "Cálculos que você verá aqui no app",
    emoji: "🧮",
    descricao:
      "Termos que aparecem nas calculadoras e na sua carteira. Tudo explicado em português.",
    termos: [
      {
        termo: "Provento mensal por cota",
        resumo:
          "Quanto cada cota do fundo paga, em dinheiro, em um mês 'típico'. É o valor que você multiplica pelas suas cotas para saber quanto vai receber.",
        exemplo:
          "MXRF11 paga em média R$ 0,10/cota por mês. Se você tem 1.000 cotas, vai receber cerca de R$ 100/mês desse FII.",
      },
      {
        termo: "Yield carteira (a.a.)",
        resumo:
          "O rendimento anual da sua carteira inteira, em porcentagem. Soma todos os proventos esperados em 12 meses e divide pelo total que você investiu (preço médio × cotas).",
        exemplo:
          "Você investiu R$ 100.000 e a projeção é receber R$ 9.000 em 12 meses = Yield carteira de 9% a.a.",
      },
      {
        termo: "Preço médio (PM)",
        resumo:
          "O custo médio de cada cota sua, considerando todas as compras que você já fez. É a base para calcular ganho/perda na venda e o YoC.",
        exemplo:
          "Comprou 100 cotas a R$ 10 (R$ 1.000) e depois 100 a R$ 12 (R$ 1.200). PM = R$ 11 por cota.",
      },
      {
        termo: "Patrimônio investido",
        resumo:
          "Quanto dinheiro você colocou na carteira, somando preço médio × quantidade de cotas de cada FII. Diferente de 'valor de mercado', que usa a cotação atual.",
      },
      {
        termo: "Renda passiva projetada",
        resumo:
          "Estimativa de quanto você vai receber por mês de proventos, baseado nas cotas que você tem e no provento médio por cota informado de cada FII. Não é garantia, é projeção.",
      },
      {
        termo: "Aporte mensal",
        resumo:
          "Quanto você adiciona à carteira todo mês, comprando mais cotas. Quanto maior e mais constante, mais rápido a bola de neve roda.",
      },
      {
        termo: "Reinvestimento",
        resumo:
          "Estratégia de usar os proventos recebidos para comprar mais cotas, em vez de gastar. É o motor da 'bola de neve' (juros compostos).",
      },
      {
        termo: "Bola de neve",
        resumo:
          "Efeito de longo prazo dos juros compostos: cada vez que você reinveste os proventos, sua carteira cresce e paga mais proventos, que compram mais cotas, e assim por diante.",
      },
    ],
  },
  {
    id: "operacional",
    titulo: "B3 e operacional",
    emoji: "⚙️",
    descricao:
      "Termos que aparecem no extrato da B3 e no dia a dia da operação.",
    termos: [
      {
        termo: "Transferência - Liquidação",
        resumo:
          "Como aparece no extrato da B3 quando você realmente compra ou vende cotas. Crédito = compra (entrou na carteira), Débito = venda. É o evento que afeta seu preço médio.",
      },
      {
        termo: "Liquidação D+1 / D+2",
        resumo:
          "Tempo entre a operação (D = dia) e o dinheiro/cotas mudarem de mãos efetivamente. Para FIIs hoje a liquidação é D+2 (dois dias úteis depois).",
      },
      {
        termo: "Subscrição",
        resumo:
          "Quando o fundo emite cotas novas para captar mais dinheiro (geralmente para comprar mais imóveis). Cotistas atuais têm preferência para comprar essas cotas novas por um preço definido.",
      },
      {
        termo: "Direito de Subscrição",
        resumo:
          "O direito (não a obrigação) de comprar as cotas novas da emissão. Aparece como um ativo separado no seu home broker (terminado em '12'). Se você não exercer ou vender, ele expira.",
      },
      {
        termo: "Cessão de Direitos",
        resumo:
          "Quando você vende seu direito de subscrição para outro investidor no mercado, em vez de exercer.",
      },
      {
        termo: "Imposto de Renda sobre FIIs",
        resumo:
          "Os proventos (rendimentos) são isentos de IR para pessoa física, desde que o fundo tenha mais de 50 cotistas e você tenha menos de 10% das cotas. Já o LUCRO na venda de cotas é tributado em 20%, sem isenção.",
        exemplo:
          "Vendeu 100 cotas a R$ 12 que comprou a R$ 10 = lucro de R$ 200, pagaria R$ 40 de IR via DARF.",
      },
      {
        termo: "Extrato de Movimentação B3",
        resumo:
          "Planilha XLSX que você baixa na Área do Investidor da B3 (https://www.investidor.b3.com.br) com todas as suas compras, vendas e proventos. É o que o /importacao usa para montar sua carteira automaticamente.",
      },
    ],
  },
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matches(termo: Termo, q: string): boolean {
  if (!q) return true;
  const haystack = [
    termo.termo,
    ...(termo.sinonimos ?? []),
    termo.resumo,
    termo.exemplo ?? "",
  ]
    .map(normalize)
    .join(" | ");
  return haystack.includes(q);
}

export function Glossario() {
  const [query, setQuery] = useState("");
  const q = normalize(query.trim());

  const filtered = useMemo(
    () =>
      CATEGORIAS.map((cat) => ({
        ...cat,
        termos: cat.termos.filter((t) => matches(t, q)),
      })).filter((cat) => cat.termos.length > 0),
    [q]
  );

  const totalTermos = CATEGORIAS.reduce((acc, c) => acc + c.termos.length, 0);
  const filteredCount = filtered.reduce((acc, c) => acc + c.termos.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-0 z-10 -mx-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <label className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="text-sm font-medium text-slate-700 sm:w-40">
            Buscar termo
          </span>
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: yield, vacância, P/VP, ticker..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </label>
        <p className="mt-2 text-xs text-slate-500">
          {q
            ? `${filteredCount} de ${totalTermos} termos encontrados`
            : `${totalTermos} termos organizados em ${CATEGORIAS.length} categorias`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          Nada encontrado para <strong>&ldquo;{query}&rdquo;</strong>. Tente
          outro termo ou olhe a lista completa.
        </div>
      ) : (
        <nav className="flex flex-wrap gap-2">
          {filtered.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
            >
              {cat.emoji} {cat.titulo} · {cat.termos.length}
            </a>
          ))}
        </nav>
      )}

      {filtered.map((cat) => (
        <section
          key={cat.id}
          id={cat.id}
          className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <header className="mb-4 border-b border-slate-100 pb-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <span aria-hidden>{cat.emoji}</span>
              {cat.titulo}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{cat.descricao}</p>
          </header>

          <ul className="flex flex-col divide-y divide-slate-100">
            {cat.termos.map((t) => (
              <li key={t.termo} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    {t.termo}
                  </h3>
                  {t.sinonimos ? (
                    <p className="text-xs text-slate-500">
                      também chamado de{" "}
                      <span className="italic">
                        {t.sinonimos.join(", ")}
                      </span>
                    </p>
                  ) : null}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                  {t.resumo}
                </p>
                {t.exemplo ? (
                  <div className="mt-2 flex gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-900">
                    <span className="font-semibold uppercase tracking-wide text-blue-700">
                      Ex:
                    </span>
                    <span className="flex-1 leading-relaxed">{t.exemplo}</span>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-center text-xs text-slate-400">
        Faltou algum termo importante?{" "}
        <a
          href="https://github.com/brunoinnacio/fiibrasil/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:underline"
        >
          Sugira aqui
        </a>
        .
      </p>
    </div>
  );
}
