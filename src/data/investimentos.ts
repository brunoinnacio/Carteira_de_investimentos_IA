/**
 * Catálogo de tipos de investimento — explicado sem palavras difíceis.
 *
 * Objetivo: mostrar o "cardápio" completo (renda fixa, ações, FIIs, fundos...)
 * com analogias simples, nível de risco e "pra quem é". Conteúdo educacional,
 * não recomendação. Cada item pode apontar para uma ferramenta ou módulo.
 */

export type Categoria =
  | "Renda Fixa"
  | "Renda Variável"
  | "Fundos"
  | "Mais ousados";

export type Nivel = "Baixo" | "Médio" | "Alto" | "Muito alto";
export type Liquidez = "Alta" | "Média" | "Baixa";

export type TipoInvestimento = {
  slug: string;
  nome: string;
  emoji: string;
  categoria: Categoria;
  /** Frase de vitrine. */
  resumo: string;
  /** A analogia que explica tudo numa imagem. */
  analogia: string;
  oQueE: string;
  comoVoceGanha: string;
  risco: Nivel;
  liquidez: Liquidez;
  /** Horizonte ideal. */
  prazo: string;
  paraQuem: string;
  /** Aviso/cuidado, quando faz sentido. */
  atencao?: string;
  /** Liga a uma ferramenta ou módulo do site. */
  relacionado?: { label: string; href: string };
};

export const CATEGORIAS: {
  nome: Categoria;
  descricao: string;
}[] = [
  {
    nome: "Renda Fixa",
    descricao:
      "Você empresta dinheiro e recebe de volta com um valor combinado por cima. É o grupo mais previsível — bom pra começar e pra guardar a reserva de emergência.",
  },
  {
    nome: "Renda Variável",
    descricao:
      "Você vira dono de algo (uma empresa, um imóvel). Pode render mais no longo prazo, mas o valor sobe e desce no caminho. Exige paciência.",
  },
  {
    nome: "Fundos",
    descricao:
      "Um 'bolão' em que muita gente junta dinheiro e um profissional decide onde investir. Você entra com a sua parte e deixa a gestão com quem é do ramo.",
  },
  {
    nome: "Mais ousados",
    descricao:
      "Opções de risco mais alto. Podem ter seu espaço, mas só com dinheiro que você aguenta ver oscilar bastante — e com atenção redobrada a golpes.",
  },
];

export const TIPOS: TipoInvestimento[] = [
  // --- Renda Fixa ---
  {
    slug: "poupanca",
    nome: "Poupança",
    emoji: "🐷",
    categoria: "Renda Fixa",
    resumo: "A caixinha mais conhecida do Brasil. Simples, mas rende pouco.",
    analogia:
      "É o cofrinho de porquinho do banco: seguro e fácil, mas o porquinho engorda devagar — às vezes menos do que os preços sobem.",
    oQueE:
      "A conta poupança que quase todo banco oferece. É o investimento mais simples que existe e não tem imposto sobre o rendimento.",
    comoVoceGanha:
      "O banco te paga um juro pequeno por mês para deixar o dinheiro lá. Você pode sacar quando quiser.",
    risco: "Baixo",
    liquidez: "Alta",
    prazo: "Qualquer prazo",
    paraQuem:
      "Quem está dando o primeiro passo e quer algo sem nenhuma complicação. Mas, com um pouco de estudo, dá pra ganhar mais com outras opções igualmente seguras.",
    atencao:
      "Costuma render menos que a subida dos preços. Ou seja: seu dinheiro pode encolher de valor mesmo 'rendendo'.",
  },
  {
    slug: "tesouro-direto",
    nome: "Tesouro Direto",
    emoji: "🏛️",
    categoria: "Renda Fixa",
    resumo: "Emprestar para o governo. O empréstimo mais seguro do país.",
    analogia:
      "É como emprestar dinheiro para o governo e receber um recibo que diz: 'devolvo em tal data, com um tanto a mais'. Quem garante é o próprio país.",
    oQueE:
      "Títulos públicos vendidos pela internet a partir de poucos reais. Existem versões que protegem da subida dos preços e versões com valor fixo combinado.",
    comoVoceGanha:
      "O governo te devolve o que você emprestou mais os juros combinados, na data do vencimento (ou antes, se precisar vender).",
    risco: "Baixo",
    liquidez: "Alta",
    prazo: "Curto a longo (tem opção pra cada objetivo)",
    paraQuem:
      "Praticamente todo mundo — é o lugar clássico para a reserva de emergência e para objetivos com data marcada.",
  },
  {
    slug: "cdb",
    nome: "CDB",
    emoji: "🏦",
    categoria: "Renda Fixa",
    resumo: "Emprestar para o banco e receber com um quentinho por cima.",
    analogia:
      "Você empresta para o banco em vez de o banco emprestar para você. Em troca, ele te devolve com juros — e há uma proteção oficial até certo valor caso o banco quebre.",
    oQueE:
      "Um título que o banco emite para captar dinheiro. Tem proteção do Fundo Garantidor de Créditos até um limite por banco.",
    comoVoceGanha:
      "Recebe de volta o valor aplicado mais os juros combinados. Bancos menores costumam pagar mais para atrair você.",
    risco: "Baixo",
    liquidez: "Média",
    prazo: "Curto a médio",
    paraQuem:
      "Quem quer um pouco mais de rendimento que a poupança mantendo a segurança, respeitando o limite protegido por banco.",
  },
  {
    slug: "lci-lca",
    nome: "LCI e LCA",
    emoji: "🌾",
    categoria: "Renda Fixa",
    resumo: "Parecido com o CDB, ligado a imóveis e agro — e sem imposto.",
    analogia:
      "É emprestar para o banco financiar casas (LCI) ou o agronegócio (LCA). Como incentiva setores importantes, costuma vir livre de imposto pra você.",
    oQueE:
      "Títulos de renda fixa parecidos com o CDB, também com proteção até um limite, mas com isenção de imposto para pessoa física.",
    comoVoceGanha:
      "Recebe o valor de volta com juros, sem desconto de imposto sobre o ganho — o que muitas vezes compensa bastante.",
    risco: "Baixo",
    liquidez: "Baixa",
    prazo: "Médio (costuma ter carência para resgate)",
    paraQuem:
      "Quem não vai precisar do dinheiro tão cedo e quer aproveitar a isenção de imposto.",
  },

  // --- Renda Variável ---
  {
    slug: "acoes",
    nome: "Ações",
    emoji: "📈",
    categoria: "Renda Variável",
    resumo: "Virar sócio de uma empresa grande, com pouco dinheiro.",
    analogia:
      "Comprar uma ação é comprar um pedacinho de uma empresa. Se ela vende mais e lucra, seu pedacinho vale mais — e você ainda pode receber parte do lucro.",
    oQueE:
      "Pequenas fatias de empresas listadas na bolsa. Você compra pelo celular e vira sócio, na proporção do que comprou.",
    comoVoceGanha:
      "De dois jeitos: a cota pode valorizar com o tempo e a empresa pode te pagar parte do lucro (os dividendos).",
    risco: "Alto",
    liquidez: "Alta",
    prazo: "Longo (anos)",
    paraQuem:
      "Quem aguenta ver o valor subir e descer no caminho e pensa no longo prazo. Diversificar é essencial.",
    atencao:
      "O preço oscila bastante no curto prazo. Desconfie de quem promete 'acertar' qual ação sobe amanhã — ninguém acerta sempre.",
    relacionado: { label: "Aprender no módulo de ações", href: "/aprender/acoes" },
  },
  {
    slug: "fiis",
    nome: "Fundos Imobiliários (FIIs)",
    emoji: "🏬",
    categoria: "Renda Variável",
    resumo: "Dono de pedacinhos de imóveis, recebendo aluguel todo mês.",
    analogia:
      "Mil pessoas compram um shopping juntas; cada uma vira dona de um pedacinho e divide o aluguel das lojas. É isso — com cotas a partir de poucos reais.",
    oQueE:
      "Fundos que são donos de imóveis (shoppings, galpões, prédios) ou que emprestam para o setor. Negociados na bolsa como as ações.",
    comoVoceGanha:
      "Recebe a sua parte do aluguel/juros todo mês (os proventos), em geral sem imposto, e a cota também pode valorizar.",
    risco: "Médio",
    liquidez: "Alta",
    prazo: "Longo",
    paraQuem:
      "Quem busca uma renda mensal mais previsível que ações, aceitando alguma oscilação no preço da cota.",
    relacionado: { label: "Ver FIIs ao vivo", href: "/oportunidades" },
  },
  {
    slug: "etfs",
    nome: "ETFs",
    emoji: "🧺",
    categoria: "Renda Variável",
    resumo: "Uma cesta pronta com dezenas de empresas de uma vez só.",
    analogia:
      "Em vez de escolher fruta por fruta, você compra a cesta já montada. Um ETF é uma cesta com muitas empresas — você diversifica numa tacada.",
    oQueE:
      "Um fundo negociado na bolsa que acompanha um conjunto de ativos (por exemplo, as maiores empresas do país) de uma vez.",
    comoVoceGanha:
      "Acompanha o desempenho médio daquela cesta: se o conjunto sobe, sua cota sobe.",
    risco: "Alto",
    liquidez: "Alta",
    prazo: "Longo",
    paraQuem:
      "Quem quer investir em ações de forma diversificada e simples, sem escolher empresa por empresa.",
  },
  {
    slug: "bdrs",
    nome: "BDRs",
    emoji: "🌎",
    categoria: "Renda Variável",
    resumo: "Investir em empresas de fora (como as gigantes de tecnologia).",
    analogia:
      "É uma forma de ter um pedacinho de empresas estrangeiras famosas sem sair da bolsa brasileira — como um 'recibo' que representa a ação lá fora.",
    oQueE:
      "Certificados negociados aqui que representam ações de empresas de fora do Brasil.",
    comoVoceGanha:
      "Acompanha o valor da empresa estrangeira e ainda sofre efeito da variação do dólar.",
    risco: "Alto",
    liquidez: "Média",
    prazo: "Longo",
    paraQuem:
      "Quem já entende ações e quer expor uma parte do dinheiro a empresas e moedas de fora.",
  },

  // --- Fundos ---
  {
    slug: "fundos",
    nome: "Fundos de Investimento",
    emoji: "👥",
    categoria: "Fundos",
    resumo: "Um bolão gerido por um profissional. Você entra com a sua parte.",
    analogia:
      "Imagine uma vaquinha: muita gente junta dinheiro e contrata um especialista para decidir onde investir. Você é dono de uma fatia do bolão.",
    oQueE:
      "Fundos onde um gestor profissional investe o dinheiro de muitos cotistas seguindo uma estratégia (renda fixa, ações, multimercado...).",
    comoVoceGanha:
      "Sua cota sobe conforme os investimentos do fundo dão certo. Em troca, você paga uma taxa de administração.",
    risco: "Médio",
    liquidez: "Média",
    prazo: "Varia conforme o fundo",
    paraQuem:
      "Quem prefere terceirizar as decisões para um profissional. Vale sempre olhar as taxas, que comem parte do ganho.",
    atencao:
      "Taxas altas podem corroer o rendimento. Compare antes de entrar.",
  },

  // --- Mais ousados ---
  {
    slug: "criptomoedas",
    nome: "Criptomoedas",
    emoji: "🪙",
    categoria: "Mais ousados",
    resumo: "Altíssima oscilação. Trate como a parte mais arriscada de tudo.",
    analogia:
      "É a montanha-russa do mundo dos investimentos: pode subir e cair muito rápido. Empolga, mas vira o estômago — e atrai muitos golpistas.",
    oQueE:
      "Moedas digitais (como o Bitcoin) que não têm um governo por trás e variam muito de preço.",
    comoVoceGanha:
      "Apenas se o preço subir — e ele pode despencar com a mesma facilidade. Não gera aluguel nem juros.",
    risco: "Muito alto",
    liquidez: "Alta",
    prazo: "Longo e com estômago forte",
    paraQuem:
      "Só quem já tem o básico montado e topa arriscar uma fatia pequena que aguenta perder.",
    atencao:
      "É o terreno favorito dos golpes (promessas de ganho garantido, 'robôs', grupos fechados). Nunca coloque aqui dinheiro que você não pode perder.",
  },
  {
    slug: "previdencia",
    nome: "Previdência Privada",
    emoji: "👵",
    categoria: "Mais ousados",
    resumo: "Guardar para a aposentadoria, com regras e prazos próprios.",
    analogia:
      "É uma poupança de longuíssimo prazo pensada para o seu 'eu' do futuro — com algumas vantagens e algumas pegadinhas de taxa.",
    oQueE:
      "Um plano para acumular dinheiro ao longo de muitos anos visando a aposentadoria, com regras tributárias específicas.",
    comoVoceGanha:
      "O dinheiro vai sendo investido ao longo do tempo; você resgata mais para a frente, na aposentadoria.",
    risco: "Médio",
    liquidez: "Baixa",
    prazo: "Muito longo (aposentadoria)",
    paraQuem:
      "Quem pensa lá na frente e quer disciplina de longo prazo. Compare taxas: planos ruins cobram caro demais.",
    atencao: "Fuja de planos com taxas altas — elas destroem o ganho no longo prazo.",
  },
];

export const RISCO_ORDEM: Record<Nivel, number> = {
  Baixo: 1,
  Médio: 2,
  Alto: 3,
  "Muito alto": 4,
};

export function getTipo(slug: string): TipoInvestimento | undefined {
  return TIPOS.find((t) => t.slug === slug);
}
