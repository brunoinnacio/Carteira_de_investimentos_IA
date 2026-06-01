/**
 * Guias cornerstone — páginas-âncora de SEO.
 *
 * Cada guia mira uma busca real de alto volume e baixa intenção comercial,
 * onde o diferencial do site (explicar sem jargão) ganha. O conteúdo é
 * autossuficiente e leva o leitor para as ferramentas e a trilha.
 */

export type GuiaSecao = {
  titulo: string;
  paragrafos: string[];
};

export type GuiaFAQ = {
  pergunta: string;
  resposta: string;
};

export type GuiaCTA = {
  texto: string;
  href: string;
  label: string;
};

export type Guia = {
  slug: string;
  titulo: string;
  /** Meta description / vitrine. */
  descricao: string;
  /** Tempo estimado de leitura em minutos. */
  leituraMin: number;
  /** Parágrafos de abertura (o "gancho"). */
  intro: string[];
  secoes: GuiaSecao[];
  faq: GuiaFAQ[];
  ctas: GuiaCTA[];
  /** slugs de outros guias relacionados. */
  relacionados: string[];
  atualizadoEm: string;
};

const HOJE = "2026-06-01";

export const GUIAS: Guia[] = [
  {
    slug: "como-comecar-a-investir-do-zero",
    titulo: "Como começar a investir do zero em 2026 (guia para iniciantes)",
    descricao:
      "Um passo a passo simples e sem economês para sair do zero: organizar as contas, montar a reserva e dar o primeiro passo nos investimentos — mesmo com pouco dinheiro.",
    leituraMin: 7,
    intro: [
      "Se você nunca investiu e sente que isso é coisa de gente rica, complicada ou até golpe, respira: começar é mais simples do que parece, e dá pra fazer com pouco dinheiro. Este guia te leva do zero, sem jargão.",
      "A regra mais importante vem primeiro: investir de verdade é devagar e previsível. Quem promete te deixar rico rápido está te enganando. O que funciona é o caminho chato e constante — e é exatamente ele que a gente vai montar aqui.",
    ],
    secoes: [
      {
        titulo: "Passo 1: organize antes de investir",
        paragrafos: [
          "Antes de pensar em render, tire as dívidas caras do caminho (cartão de crédito e cheque especial cobram juros altíssimos — nenhum investimento seguro rende mais que isso). Quitar essas dívidas é o melhor 'investimento' que existe.",
          "Em seguida, anote por um mês para onde vai o seu dinheiro. Não precisa de planilha complexa: só entender quanto entra e quanto sai já muda o jogo.",
        ],
      },
      {
        titulo: "Passo 2: monte sua reserva de emergência",
        paragrafos: [
          "Antes de buscar rendimento, você precisa de um colchão para imprevistos (perder o emprego, um conserto inesperado). O ideal é juntar de 3 a 6 meses dos seus gastos.",
          "Essa reserva fica em um investimento seguro e fácil de sacar — normalmente na renda fixa. O objetivo dela não é render muito, é estar lá quando você precisar.",
        ],
      },
      {
        titulo: "Passo 3: dê o primeiro passo (com pouco)",
        paragrafos: [
          "Com as dívidas sob controle e a reserva começando, você pode dar o primeiro passo nos investimentos. Não precisa de muito: dá pra começar com R$ 50 ou R$ 100.",
          "O segredo não é acertar o investimento 'mágico', e sim criar o hábito de colocar um pouco todo mês e deixar o tempo trabalhar. Esse hábito vale mais do que qualquer dica.",
        ],
      },
      {
        titulo: "Passo 4: entenda no que você está investindo",
        paragrafos: [
          "Você não precisa virar especialista, mas precisa entender o básico de onde coloca seu dinheiro. Comece pelos investimentos mais simples e seguros e vá avançando conforme ganha confiança.",
          "Nunca invista em algo que você não consegue explicar para um amigo em uma frase. Se não entendeu, não coloque dinheiro — essa regra sozinha te protege de quase todos os golpes.",
        ],
      },
    ],
    faq: [
      {
        pergunta: "Quanto preciso para começar a investir?",
        resposta:
          "Dá para começar com pouco — R$ 50 ou R$ 100 já são suficientes em vários investimentos, como o Tesouro Direto. O mais importante é a constância, não o valor inicial.",
      },
      {
        pergunta: "Onde devo investir minha reserva de emergência?",
        resposta:
          "Em um investimento seguro e de fácil resgate, geralmente da renda fixa. O objetivo da reserva é segurança e liquidez, não rentabilidade máxima.",
      },
      {
        pergunta: "Investir é perigoso para iniciantes?",
        resposta:
          "Começando pelos investimentos mais simples e seguros, o risco é baixo. O verdadeiro perigo são as promessas de ganho rápido e garantido, que costumam ser golpe.",
      },
    ],
    ctas: [
      {
        texto: "Comece pela trilha do zero, sem economês, no seu ritmo.",
        href: "/aprender",
        label: "Fazer a trilha do zero",
      },
      {
        texto: "Veja todos os tipos de investimento explicados de forma simples.",
        href: "/tipos-de-investimento",
        label: "Conhecer os tipos",
      },
    ],
    relacionados: [
      "como-investir-com-pouco-dinheiro",
      "investir-e-golpe",
      "fii-ou-renda-fixa",
    ],
    atualizadoEm: HOJE,
  },
  {
    slug: "fii-ou-renda-fixa",
    titulo: "FII ou renda fixa: qual é melhor para você?",
    descricao:
      "Entenda a diferença entre Fundos Imobiliários e renda fixa sem jargão, com prós e contras de cada um — e descubra qual combina com o seu momento e objetivo.",
    leituraMin: 6,
    intro: [
      "Essa é uma das dúvidas mais comuns de quem está começando. A resposta honesta é: não existe um melhor para todo mundo — existe o que combina com o seu objetivo, o seu prazo e o quanto você aguenta ver o valor oscilar.",
      "Em vez de torcer por um lado, vale entender o papel de cada um. Muita gente acaba usando os dois, e isso costuma ser o mais inteligente.",
    ],
    secoes: [
      {
        titulo: "Renda fixa: previsível e segura",
        paragrafos: [
          "Na renda fixa, você empresta seu dinheiro (para o governo ou um banco) e recebe de volta com juros combinados. É mais previsível: você consegue estimar quanto vai receber.",
          "É o lugar natural da reserva de emergência e de objetivos de curto prazo, justamente porque oscila pouco e parte dela tem proteção até um certo valor.",
        ],
      },
      {
        titulo: "FIIs: renda mensal, com mais oscilação",
        paragrafos: [
          "Os Fundos Imobiliários te tornam dono de pedacinhos de imóveis (ou de dívidas do setor) e pagam a sua parte do aluguel/juros todo mês — em geral sem imposto sobre esses proventos.",
          "Em troca, o preço da cota sobe e desce na bolsa. No longo prazo, costumam render mais que a renda fixa, mas exigem estômago para a oscilação e horizonte mais longo.",
        ],
      },
      {
        titulo: "Como decidir (sem errar feio)",
        paragrafos: [
          "Vai precisar do dinheiro em menos de 1 ou 2 anos? Prefira a renda fixa. É a reserva de emergência? Renda fixa, sempre. Pode deixar o dinheiro rendendo por anos e quer uma renda mensal? Os FIIs entram bem aqui.",
          "Na prática, a maioria dos investidores combina os dois: a renda fixa dá a base de segurança, e os FIIs (e outros ativos) constroem a renda no longo prazo. Não precisa escolher só um lado.",
        ],
      },
    ],
    faq: [
      {
        pergunta: "FII rende mais que a renda fixa?",
        resposta:
          "No longo prazo costuma render mais, mas com mais oscilação no caminho. No curto prazo, a renda fixa é mais previsível e segura.",
      },
      {
        pergunta: "Posso ter FII e renda fixa ao mesmo tempo?",
        resposta:
          "Sim, e geralmente é o mais recomendado. A renda fixa dá segurança e liquidez; os FIIs ajudam a construir renda no longo prazo.",
      },
      {
        pergunta: "FII é renda fixa ou renda variável?",
        resposta:
          "FII é renda variável: o preço da cota muda na bolsa todos os dias. A renda mensal (os proventos) é relativamente estável, mas o valor da cota oscila.",
      },
    ],
    ctas: [
      {
        texto: "Veja FIIs ao vivo e descubra quais estão atrativos hoje.",
        href: "/oportunidades",
        label: "Abrir o screener de FIIs",
      },
      {
        texto: "Compare todos os tipos de investimento lado a lado.",
        href: "/tipos-de-investimento",
        label: "Ver os tipos",
      },
    ],
    relacionados: [
      "como-comecar-a-investir-do-zero",
      "como-investir-com-pouco-dinheiro",
    ],
    atualizadoEm: HOJE,
  },
  {
    slug: "como-investir-com-pouco-dinheiro",
    titulo: "Como investir com pouco dinheiro: começando com R$ 50 ou R$ 100",
    descricao:
      "Você não precisa ser rico para investir. Veja como começar com pouco, quais investimentos aceitam valores baixos e por que o hábito vale mais que o valor.",
    leituraMin: 5,
    intro: [
      "Um dos maiores mitos sobre investir é que 'só vale a pena com muito dinheiro'. Não é verdade. Hoje dá para começar com R$ 50 ou R$ 100 — e começar pequeno cedo costuma vencer começar grande tarde.",
      "O que faz a diferença não é o valor inicial, é a constância: colocar um pouco todo mês e deixar o tempo fazer o trabalho pesado.",
    ],
    secoes: [
      {
        titulo: "Por que pouco já é suficiente",
        paragrafos: [
          "Vários investimentos aceitam valores baixos. No Tesouro Direto, por exemplo, dá para investir com poucos reais. Muitos FIIs têm cotas que custam menos de R$ 100.",
          "Começar com pouco também tem uma vantagem escondida: você aprende com calma, sem medo de errar com muito dinheiro. O primeiro investimento é tanto sobre aprender quanto sobre render.",
        ],
      },
      {
        titulo: "O poder do hábito (a bola de neve)",
        paragrafos: [
          "Imagine uma bolinha de neve rolando morro abaixo: começa pequena e vai crescendo. Reinvestir o que você ganha e aportar todo mês cria esse efeito ao longo dos anos.",
          "Quem coloca R$ 100 por mês com disciplina, por muitos anos, costuma terminar na frente de quem investiu um valor grande uma vez só e parou. Tempo e constância são os ingredientes secretos.",
        ],
      },
      {
        titulo: "Por onde começar com pouco",
        paragrafos: [
          "Garanta primeiro uma reserva de emergência na renda fixa. Com isso encaminhado, você pode destinar um valor pequeno e fixo todo mês para começar a investir com mais foco em renda e crescimento.",
          "Defina um valor que não pese no seu orçamento — melhor um valor pequeno que você consegue manter todo mês do que um valor grande que você abandona em dois meses.",
        ],
      },
    ],
    faq: [
      {
        pergunta: "Vale a pena investir R$ 100 por mês?",
        resposta:
          "Sim. O mais importante é a constância: R$ 100 por mês, reinvestidos ao longo dos anos, crescem bem por causa do efeito bola de neve.",
      },
      {
        pergunta: "Qual o melhor investimento para quem tem pouco dinheiro?",
        resposta:
          "Para começar, opções simples e seguras da renda fixa (como o Tesouro Direto) costumam ser ideais. Depois, dá para diversificar com FIIs de cotas baratas.",
      },
    ],
    ctas: [
      {
        texto:
          "Simule sua bola de neve: veja sua renda crescer aportando todo mês.",
        href: "/bola-de-neve",
        label: "Simular a bola de neve",
      },
      {
        texto: "Descubra quanto precisa investir para a renda que você quer.",
        href: "/calculadora-renda",
        label: "Abrir a calculadora",
      },
    ],
    relacionados: ["como-comecar-a-investir-do-zero", "fii-ou-renda-fixa"],
    atualizadoEm: HOJE,
  },
  {
    slug: "investir-e-golpe",
    titulo: "Investir é golpe? Como identificar uma furada e investir com segurança",
    descricao:
      "Seu medo de cair em golpe é saudável. Aprenda a reconhecer as promessas falsas em segundos e entenda por que o investimento de verdade é seguro e transparente.",
    leituraMin: 5,
    intro: [
      "Se você desconfia de tudo que promete te enriquecer, parabéns: seu instinto está certo. A internet está cheia de golpes disfarçados de investimento, e desconfiar é a sua melhor defesa.",
      "A boa notícia é que dá para separar o golpe do investimento de verdade com poucas regras simples. Depois de aprendê-las, você nunca mais cai numa furada.",
    ],
    secoes: [
      {
        titulo: "Os sinais de golpe (decore estes)",
        paragrafos: [
          "Promessa de lucro alto e garantido ('rende 10% ao mês, sem risco') é o sinal mais clássico — não existe. Risco e retorno andam juntos: quanto maior o prêmio prometido, maior a cilada.",
          "Pressão para decidir agora, grupos fechados de WhatsApp, 'robôs' que ganham sozinhos e alguém pedindo para 'investir o seu dinheiro por você' são todos sinais vermelhos.",
        ],
      },
      {
        titulo: "Como o investimento de verdade funciona",
        paragrafos: [
          "O investimento real acontece dentro da sua própria conta, na sua corretora, no seu nome. Você nunca entrega dinheiro na mão de uma pessoa. É tão transparente quanto ver o extrato do banco.",
          "E ele é, sinceramente, meio chato: rende devagar, tem altos e baixos, e nunca é 'certeza de lucro'. É justamente por ser assim que ele é seguro.",
        ],
      },
      {
        titulo: "A regra de ouro que te protege",
        paragrafos: [
          "Se promete ficar rico rápido e sem risco, é golpe. Sempre. Não tem exceção. Guarde essa frase e ela sozinha já evita a maioria das furadas.",
          "E nunca invista no que você não entende. Se você não consegue explicar em uma frase para onde vai o seu dinheiro e como ele rende, não coloque um centavo.",
        ],
      },
    ],
    faq: [
      {
        pergunta: "Como saber se um investimento é golpe?",
        resposta:
          "Desconfie de promessas de lucro alto e garantido, pressão para decidir rápido e de quem pede para investir o seu dinheiro por você. Investimento de verdade fica na sua conta, no seu nome, e nunca garante lucro.",
      },
      {
        pergunta: "Existe investimento sem risco e com lucro garantido?",
        resposta:
          "Não. Todo investimento tem algum risco, e retornos muito acima do normal sempre vêm com risco maior. 'Lucro garantido e alto' é a marca registrada do golpe.",
      },
      {
        pergunta: "É seguro investir pela bolsa?",
        resposta:
          "Sim. Os investimentos são registrados no seu nome, em ambiente regulado, e você acompanha tudo pela sua corretora e pela B3. O cuidado é com quem promete ganhos milagrosos por fora.",
      },
    ],
    ctas: [
      {
        texto:
          "Comece pelo módulo que desarma o medo, com exemplos do dia a dia.",
        href: "/aprender/isso-e-golpe",
        label: "Ler: isso aqui é golpe?",
      },
    ],
    relacionados: [
      "como-comecar-a-investir-do-zero",
      "como-investir-com-pouco-dinheiro",
    ],
    atualizadoEm: HOJE,
  },
  {
    slug: "como-receber-dividendos-todo-mes",
    titulo: "Como receber dividendos todos os meses (guia da renda passiva)",
    descricao:
      "Entenda o que são dividendos e proventos e como montar uma carteira que pinga dinheiro na conta todo mês — sem promessas milagrosas.",
    leituraMin: 6,
    intro: [
      "Receber um dinheiro na conta todo mês, sem precisar vender nada, é o sonho de quem busca renda passiva. E não é mágica: é o que acontece quando você é dono de coisas que pagam — como aluguéis e lucros de empresas.",
      "Este guia explica, sem jargão, o que são dividendos e proventos e como organizar uma carteira para receber com regularidade.",
    ],
    secoes: [
      {
        titulo: "O que são dividendos e proventos",
        paragrafos: [
          "Quando você é dono de um pedacinho de uma empresa (ação) ou de imóveis (FII), você tem direito a uma parte dos lucros e aluguéis. Esse pagamento é o dividendo (nas ações) ou provento (nos FIIs).",
          "É como ter uma galinha dos ovos de ouro: você não precisa vender a galinha para ganhar — basta ficar com ela e receber os ovos. No caso dos FIIs, esses ovos costumam cair todo mês e em geral sem imposto.",
        ],
      },
      {
        titulo: "Como montar uma renda que cai todo mês",
        paragrafos: [
          "Muitos Fundos Imobiliários pagam proventos mensalmente. Montando uma carteira com vários FIIs, você cria um fluxo de dinheiro entrando praticamente todo mês.",
          "O segredo é a constância: comprar aos poucos, reinvestir o que recebe (a bola de neve) e diversificar entre tipos diferentes para a renda não depender de um único fundo.",
        ],
      },
      {
        titulo: "Quanto preciso para viver de renda",
        paragrafos: [
          "Depende de quanto você quer receber por mês e do rendimento médio dos seus investimentos. A conta é simples e a gente faz ela pra você: diga a renda desejada e veja o patrimônio necessário.",
          "Spoiler honesto: não dá para viver de renda da noite para o dia. É um caminho de anos — mas totalmente possível com constância.",
        ],
      },
    ],
    faq: [
      {
        pergunta: "FII paga dividendos todo mês?",
        resposta:
          "A maioria dos Fundos Imobiliários distribui proventos mensalmente, e geralmente sem imposto para a pessoa física. Já as ações costumam pagar dividendos em períodos variados.",
      },
      {
        pergunta: "Preciso de muito dinheiro para receber dividendos?",
        resposta:
          "Não para começar. Você recebe proporcional ao que tem. Com pouco, os valores são pequenos; eles crescem conforme você aporta e reinveste ao longo do tempo.",
      },
    ],
    ctas: [
      {
        texto: "Projete quanto de proventos sua carteira deve receber por mês.",
        href: "/calendario",
        label: "Ver o calendário de proventos",
      },
      {
        texto: "Descubra quanto precisa investir para a renda mensal que quer.",
        href: "/calculadora-renda",
        label: "Calcular minha renda",
      },
    ],
    relacionados: ["fii-ou-renda-fixa", "como-comecar-a-investir-do-zero"],
    atualizadoEm: HOJE,
  },
  {
    slug: "reserva-de-emergencia",
    titulo: "Reserva de emergência: o que é, quanto ter e onde guardar",
    descricao:
      "Antes de investir para crescer, você precisa de um colchão para imprevistos. Veja quanto juntar e onde deixar essa reserva com segurança.",
    leituraMin: 5,
    intro: [
      "A reserva de emergência é a base de tudo. É o dinheiro que te protege quando a vida surpreende: uma demissão, um conserto inesperado, uma emergência de saúde. Sem ela, qualquer susto vira dívida.",
      "Montar a reserva vem antes de buscar rendimento alto. É o passo que dá tranquilidade para investir o resto sem medo.",
    ],
    secoes: [
      {
        titulo: "O que é (e por que vem primeiro)",
        paragrafos: [
          "É uma quantia guardada só para imprevistos, separada do dinheiro do dia a dia e dos investimentos de longo prazo. A função dela não é render muito — é estar disponível na hora do aperto.",
          "Com a reserva pronta, você não precisa resgatar investimentos no pior momento (quando estão em baixa) nem recorrer a dívidas caras.",
        ],
      },
      {
        titulo: "Quanto ter",
        paragrafos: [
          "A regra geral é de 3 a 6 meses dos seus gastos mensais. Se sua renda é instável (autônomo, freelancer), mire mais perto de 6 a 12 meses.",
          "Some quanto você gasta por mês com o essencial e multiplique. Esse é o seu alvo — dá para construir aos poucos.",
        ],
      },
      {
        titulo: "Onde guardar",
        paragrafos: [
          "A reserva precisa de duas coisas: segurança e resgate rápido (liquidez). Por isso ela fica na renda fixa mais conservadora e de fácil acesso — não em ações, FIIs ou cripto, que oscilam.",
          "O objetivo aqui não é ganhar dinheiro, é não perder e ter o dinheiro à mão. O crescimento fica por conta dos outros investimentos, depois que a reserva estiver pronta.",
        ],
      },
    ],
    faq: [
      {
        pergunta: "Posso deixar minha reserva de emergência em FIIs ou ações?",
        resposta:
          "Não é recomendado. Esses investimentos oscilam e você pode precisar sacar justamente quando estiverem em baixa. A reserva fica na renda fixa segura e de fácil resgate.",
      },
      {
        pergunta: "Quanto devo ter de reserva?",
        resposta:
          "Em geral de 3 a 6 meses das suas despesas. Para renda instável, mire de 6 a 12 meses.",
      },
    ],
    ctas: [
      {
        texto: "Veja onde guardar com segurança nos tipos de renda fixa.",
        href: "/tipos-de-investimento",
        label: "Ver renda fixa",
      },
    ],
    relacionados: [
      "como-comecar-a-investir-do-zero",
      "como-investir-com-pouco-dinheiro",
    ],
    atualizadoEm: HOJE,
  },
];

export function getGuia(slug: string): Guia | undefined {
  return GUIAS.find((g) => g.slug === slug);
}
