/**
 * Trilha "Comece do zero" — educação financeira sem economês.
 *
 * Princípio: cada módulo explica UMA ideia usando uma analogia universal,
 * que funciona tanto para uma criança de 8 anos quanto para um adulto de 50.
 * Sem "Selic", "CDI", "IPCA" no corpo do texto — só linguagem do dia a dia.
 */

export type Secao = {
  titulo: string;
  paragrafos: string[];
};

export type Experimente = {
  texto: string;
  href: string;
  label: string;
};

export type Modulo = {
  slug: string;
  numero: number;
  nivel: "Medo zero" | "Primeiros passos" | "Mão na massa";
  emoji: string;
  titulo: string;
  /** Frase curta de vitrine (card e meta description). */
  resumo: string;
  /** A analogia central do módulo. */
  analogia: {
    titulo: string;
    texto: string;
  };
  /** O mesmo conceito explicado para uma criança. */
  paraCrianca: string;
  /** O mesmo conceito na vida adulta, prático. */
  naPratica: string;
  secoes: Secao[];
  /** Aviso anti-golpe, quando faz sentido no módulo. */
  alertaGolpe?: string;
  /** As 2-3 frases que a pessoa precisa levar pra casa. */
  pontosChave: string[];
  /** Liga o módulo a uma ferramenta que já existe no site. */
  experimente?: Experimente;
};

export const MODULOS: Modulo[] = [
  {
    slug: "isso-e-golpe",
    numero: 1,
    nivel: "Medo zero",
    emoji: "🛡️",
    titulo: "Isso aqui é golpe? A verdade que ninguém te conta",
    resumo:
      "Por que ter medo é normal e inteligente — e como separar o investimento de verdade das falsas promessas.",
    analogia: {
      titulo: "Plantar uma árvore, não comprar um bilhete premiado",
      texto:
        "Investir de verdade é como plantar uma árvore de frutas. Você planta, rega, espera, e um dia ela começa a dar frutos todo ano — devagar e pra sempre. Golpe é quem te vende um 'bilhete mágico' que dobra seu dinheiro em uma semana. Árvore real cresce devagar. Quem promete fruta no dia seguinte está te enganando.",
    },
    paraCrianca:
      "Ninguém fica rico apertando um botão. É como plantar uma sementinha: demora pra virar árvore, mas depois dá fruta todo ano.",
    naPratica:
      "Desconfie de qualquer pessoa que promete ganho rápido e garantido. Investimento honesto rende devagar, tem altos e baixos, e nunca é 'certeza de lucro'.",
    secoes: [
      {
        titulo: "Seu medo está certo (e é seu maior aliado)",
        paragrafos: [
          "A internet está cheia de gente prometendo te deixar rico rápido. Se você desconfia disso, parabéns: seu instinto está funcionando. A maioria dessas promessas é golpe.",
          "A verdade é meio chata: o investimento que funciona é lento, exige paciência e nunca promete que você vai ganhar com certeza. É o oposto do que os golpistas vendem. E é justamente por ser chato que ele é seguro.",
        ],
      },
      {
        titulo: "Como reconhecer um golpe em 10 segundos",
        paragrafos: [
          "Promessa de lucro alto e garantido ('rende 10% ao mês, sem risco') — não existe. Risco e retorno andam de mãos dadas: quanto maior o prêmio prometido, maior a chance de cilada.",
          "Pressão pra decidir agora, grupos de WhatsApp secretos, 'robôs' que ganham sozinhos, ou alguém pedindo seu dinheiro pra 'investir por você'. Tudo isso é sinal vermelho.",
          "Investimento de verdade acontece dentro da sua própria conta, na sua corretora, no seu nome. Você nunca entrega dinheiro na mão de ninguém.",
        ],
      },
      {
        titulo: "Por que dá pra confiar no caminho devagar",
        paragrafos: [
          "Os Fundos Imobiliários (os FIIs) que ensinamos aqui são regulados, negociados na bolsa brasileira (a B3) e você acompanha tudo pelo seu celular. É tão transparente quanto ver o extrato do banco.",
          "Aqui no site, nada é 'dica quente'. A gente te ensina a entender e a olhar os números você mesmo — pra você nunca mais depender de promessa de ninguém.",
        ],
      },
    ],
    alertaGolpe:
      "Regra de ouro: se promete ficar rico rápido e sem risco, é golpe. Sempre. Investimento de verdade é devagar, transparente e fica no seu nome.",
    pontosChave: [
      "Ganho rápido e garantido não existe — é o disfarce favorito do golpe.",
      "Investimento real é lento, chato e fica na sua conta, no seu nome.",
      "Seu dinheiro nunca vai pra mão de uma pessoa 'que investe por você'.",
    ],
  },
  {
    slug: "dinheiro-parado-encolhe",
    numero: 2,
    nivel: "Medo zero",
    emoji: "🍦",
    titulo: "Por que o dinheiro parado vai encolhendo",
    resumo:
      "O sorvete que custava 1 real e hoje custa 6. Entenda, sem palavra difícil, por que guardar embaixo do colchão é perder devagar.",
    analogia: {
      titulo: "O sorvete que não para de subir de preço",
      texto:
        "Lembra quando o sorvete custava 1 real? Hoje custa uns 6. O sorvete é o mesmo — o que mudou é que o dinheiro foi perdendo força. Se você guardou aquele 1 real numa gaveta, hoje ele não compra nem metade de um sorvete. Dinheiro parado não fica do mesmo tamanho: ele encolhe sozinho com o tempo.",
    },
    paraCrianca:
      "Se você guardar uma moeda numa caixa por muitos anos, quando abrir ela vai comprar menos brinquedo do que comprava antes. O dinheiro 'mingua' parado.",
    naPratica:
      "Dinheiro parado na conta ou embaixo do colchão perde poder de compra todo ano. Por isso a gente investe: pra ele pelo menos acompanhar (ou superar) a subida dos preços.",
    secoes: [
      {
        titulo: "A subida silenciosa dos preços",
        paragrafos: [
          "Todo ano as coisas ficam um pouco mais caras: o pão, a gasolina, o aluguel, o sorvete. Quase ninguém percebe no dia a dia, mas em 10 anos a diferença é enorme.",
          "Isso significa que a mesma nota de R$ 100 compra cada vez menos. Guardar dinheiro parado é como segurar um cubo de gelo na mão: ele vai derretendo, mesmo que você não faça nada de errado.",
        ],
      },
      {
        titulo: "Investir é colocar um guarda-chuva",
        paragrafos: [
          "Quando você investe, seu dinheiro passa a render. A ideia mínima é render mais do que os preços sobem — assim ele não só para de encolher, como começa a crescer de verdade.",
          "Não precisa entender de economia pra isso. Precisa só entender uma frase: dinheiro parado encolhe; dinheiro investido tem chance de crescer.",
        ],
      },
    ],
    pontosChave: [
      "Os preços sobem todo ano — sua nota de R$ 100 compra cada vez menos.",
      "Dinheiro parado é um gelo derretendo: encolhe sozinho.",
      "Investir serve, antes de tudo, pra parar de perder valor.",
    ],
    experimente: {
      texto:
        "Veja na prática quanto você precisaria juntar pra ter uma renda que acompanhe os seus gastos.",
      href: "/calculadora-renda",
      label: "Abrir a calculadora",
    },
  },
  {
    slug: "dinheiro-trabalhando",
    numero: 3,
    nivel: "Primeiros passos",
    emoji: "🐔",
    titulo: "Como fazer o dinheiro trabalhar pra você",
    resumo:
      "A galinha dos ovos de ouro. A diferença entre gastar o dinheiro e comprar algo que te paga todo mês.",
    analogia: {
      titulo: "Não coma a galinha — fique com os ovos",
      texto:
        "Imagine que você tem uma galinha que bota um ovo de ouro por mês. Você pode vender a galinha hoje e ganhar um dinheirão de uma vez — e nunca mais ter nada. Ou pode ficar com a galinha e receber um ovo todo mês, pra sempre. Investir é juntar dinheiro pra comprar 'galinhas': coisas que te pagam um pouquinho todo mês, sem você precisar vendê-las.",
    },
    paraCrianca:
      "Em vez de comer a galinha de uma vez, você fica com ela e ganha um ovo de ouro todo mês. Quanto mais galinhas, mais ovos.",
    naPratica:
      "Há dois jeitos de usar dinheiro: gastar (ele some) ou comprar algo que gera renda (ele te paga de novo e de novo). Investir é encher seu galinheiro de coisas que pagam.",
    secoes: [
      {
        titulo: "Dois tipos de compra",
        paragrafos: [
          "Quando você compra um celular novo, o dinheiro foi embora e não volta. Quando você compra uma 'galinha que bota ovo' — como um pedacinho de um galpão alugado — ela te paga um aluguel todo mês e continua sua.",
          "A riqueza de verdade não é ter muito dinheiro parado. É ter muitas 'galinhas' pondo ovos pra você, todo mês, sem você trabalhar por isso.",
        ],
      },
      {
        titulo: "Renda passiva, sem palavra difícil",
        paragrafos: [
          "'Renda passiva' é só um nome chique pros ovos de ouro: dinheiro que cai na sua conta sem você fazer nada naquele mês. Você comprou a galinha uma vez; ela trabalha pra você o resto do tempo.",
          "O objetivo de quem investe pra viver de renda é simples: ter galinhas suficientes pra que os ovos paguem suas contas. Aí o trabalho vira opcional.",
        ],
      },
    ],
    pontosChave: [
      "Gastar faz o dinheiro sumir; investir compra algo que te paga de novo.",
      "Renda passiva = os 'ovos de ouro' que caem todo mês sem trabalho.",
      "Riqueza é ter muitas galinhas botando ovos, não dinheiro parado.",
    ],
  },
  {
    slug: "bola-de-neve",
    numero: 4,
    nivel: "Primeiros passos",
    emoji: "⛄",
    titulo: "A bola de neve: ficar rico devagar (e de verdade)",
    resumo:
      "Por que reinvestir os 'ovos de ouro' faz seu dinheiro crescer cada vez mais rápido com o tempo.",
    analogia: {
      titulo: "A bolinha de neve que vira avalanche",
      texto:
        "Pegue uma bolinha de neve e role ela morro abaixo. No começo ela cresce devagar. Mas quanto maior fica, mais neve gruda a cada volta — e ela vira uma bola gigante. Seu dinheiro faz o mesmo: cada ovo de ouro que você reinveste compra uma galinha nova, que bota mais ovos, que compram mais galinhas. O começo é lento; o final é impressionante.",
    },
    paraCrianca:
      "Se você usar cada ovo de ouro pra comprar uma galinha nova, em vez de gastar, logo você tem um monte de galinhas. É uma bola de neve que não para de crescer.",
    naPratica:
      "Reinvestir os rendimentos (em vez de gastar) é o que faz a mágica do tempo trabalhar a seu favor. Quanto mais cedo começa, maior a avalanche no fim.",
    secoes: [
      {
        titulo: "O tempo é o ingrediente secreto",
        paragrafos: [
          "A maior parte do crescimento acontece lá na frente, depois de muitos anos. Por isso paciência vale mais do que ter muito dinheiro: quem começou cedo e foi devagar quase sempre termina na frente de quem começou tarde com mais grana.",
          "Não é sobre acertar o 'momento certo' nem sobre escolher o investimento 'mágico'. É sobre começar, regar todo mês e deixar o tempo rolar a bola morro abaixo.",
        ],
      },
      {
        titulo: "Regar todo mês: o hábito que vence",
        paragrafos: [
          "Colocar um pouquinho todo mês (mesmo R$ 50) e reinvestir o que cai é o segredo nada secreto dos investidores de verdade. Sem emoção, sem pressa, sem adivinhação.",
          "A bola de neve só funciona se você não chuta ela de volta pro topo do morro — ou seja, se você não gasta os ovos no meio do caminho.",
        ],
      },
    ],
    pontosChave: [
      "Reinvestir os ganhos faz o crescimento acelerar com o tempo.",
      "Começar cedo vale mais do que começar com muito dinheiro.",
      "O hábito de aportar todo mês vence o 'momento perfeito'.",
    ],
    experimente: {
      texto:
        "Veja sua bola de neve crescer mês a mês: coloque um valor de aporte e descubra sua renda futura.",
      href: "/bola-de-neve",
      label: "Simular a bola de neve",
    },
  },
  {
    slug: "o-que-e-fii",
    numero: 5,
    nivel: "Primeiros passos",
    emoji: "🏬",
    titulo: "O que é um FII (explicado como pra uma criança)",
    resumo:
      "Ser dono de um pedacinho de um shopping ou galpão — e receber a sua parte do aluguel todo mês.",
    analogia: {
      titulo: "Dono de um pedacinho do shopping",
      texto:
        "Um shopping custa milhões — ninguém compra sozinho. Mas e se mil pessoas juntassem dinheiro e comprassem o shopping juntas? Cada uma viraria dona de um pedacinho. Todo mês, as lojas pagam aluguel, e esse aluguel é dividido entre os donos. Um FII é exatamente isso: um monte de gente comprando, juntas, prédios e galpões que dão aluguel — e você pode comprar um 'pedacinho' por menos de R$ 100.",
    },
    paraCrianca:
      "É como juntar a mesada com seus amigos pra comprar uma máquina de doces da escola. Todo mês ela dá lucro, e vocês dividem. Você é dono de um pedacinho.",
    naPratica:
      "FII (Fundo de Investimento Imobiliário) é um jeito de virar 'dono' de imóveis grandes comprando cotas baratas na bolsa. O aluguel desses imóveis vira um pagamento mensal pra você — geralmente sem desconto de imposto.",
    secoes: [
      {
        titulo: "Por que isso é genial pra quem tem pouco",
        paragrafos: [
          "Comprar um apartamento pra alugar exige muito dinheiro, dá trabalho (inquilino, reforma, vacância) e é difícil de vender rápido. Com um FII, você compra um pedacinho de vários imóveis ao mesmo tempo, com pouco dinheiro, e vende quando quiser pelo celular.",
          "E você não precisa cuidar de nada: tem uma equipe profissional administrando os imóveis. Você só recebe a sua parte do aluguel.",
        ],
      },
      {
        titulo: "De onde vem o 'ovo de ouro' do FII",
        paragrafos: [
          "Existem FIIs de 'tijolo' (donos de shoppings, galpões, prédios de escritório) que recebem aluguel de verdade. E existem FIIs de 'papel', que emprestam dinheiro pra construções e recebem juros — como se fossem o banco da obra.",
          "Nos dois casos, a ideia é a mesma: todo mês entra um dinheiro que é repartido entre os donos das cotas. Esse pagamento mensal é o que chamamos de 'provento'.",
        ],
      },
    ],
    pontosChave: [
      "FII = ser dono de um pedacinho de imóveis grandes, com pouco dinheiro.",
      "Todo mês você recebe a sua parte do aluguel (o 'provento').",
      "Tem profissional cuidando de tudo; você só acompanha pelo celular.",
    ],
    experimente: {
      texto:
        "Veja FIIs de verdade, com preço ao vivo, e descubra quais estão atrativos hoje pelos números.",
      href: "/oportunidades",
      label: "Explorar FIIs",
    },
  },
  {
    slug: "nao-bote-os-ovos",
    numero: 6,
    nivel: "Mão na massa",
    emoji: "🧺",
    titulo: "Não bote todos os ovos na mesma cesta",
    resumo:
      "O que é diversificar, por que isso te protege e como montar uma carteira variada sem complicação.",
    analogia: {
      titulo: "Várias cestas, vários tipos de ovo",
      texto:
        "Se você carrega todos os seus ovos numa cesta só e tropeça, perde tudo. Se divide em várias cestas, um tropeço quebra poucos ovos. Investir é igual: em vez de colocar todo o seu dinheiro em um único FII, você espalha em vários tipos diferentes. Se um vai mal, os outros seguram a sua renda.",
    },
    paraCrianca:
      "Não guarde todas as suas figurinhas no mesmo bolso. Se rasgar, você perde todas. Espalhe — assim sempre sobra a maioria.",
    naPratica:
      "Diversificar é dividir o dinheiro entre FIIs de tipos diferentes (shoppings, galpões, papel...) e até entre outros investimentos. Reduz o risco sem você precisar 'adivinhar' o melhor.",
    secoes: [
      {
        titulo: "Por que misturar tipos diferentes",
        paragrafos: [
          "Cada tipo de FII reage diferente ao que acontece no mundo. Quando os shoppings vão mal, os galpões podem ir bem; quando os imóveis sofrem, os FIIs de 'papel' podem se sair melhor. Misturar é ter sempre alguém puxando o time pra cima.",
          "Você não precisa de 50 FIIs. Uma carteira de 8 a 12 fundos de tipos variados já espalha bem o risco pra um iniciante.",
        ],
      },
      {
        titulo: "Caro ou barato? Olhe os números, não a fama",
        paragrafos: [
          "Antes de comprar, vale olhar se a cota está cara ou barata em relação ao que o fundo realmente vale, e quanto ela paga de aluguel. Não precisa decorar fórmula: o site faz a conta pra você e mostra um sinal de 'atrativo', 'justo' ou 'caro'.",
          "A regra é sempre a mesma e transparente — nada de 'dica quente'. Você decide, com os números na frente.",
        ],
      },
    ],
    pontosChave: [
      "Espalhar o dinheiro em tipos diferentes protege a sua renda.",
      "8 a 12 FIIs variados já diversificam bem pra quem está começando.",
      "Decida pelos números (caro/justo/atrativo), nunca pela fama.",
    ],
    experimente: {
      texto:
        "Cole os dados de um FII e veja na hora se ele está caro, justo ou atrativo.",
      href: "/radar",
      label: "Usar o radar",
    },
  },
  {
    slug: "lendo-sua-carteira",
    numero: 7,
    nivel: "Mão na massa",
    emoji: "🔮",
    titulo: "Vendo o futuro: sua planilha da B3 vira projeção",
    resumo:
      "Pegue o extrato da sua corretora, suba aqui e veja sua renda mensal projetada — sem montar planilha nenhuma.",
    analogia: {
      titulo: "O mapa do seu galinheiro",
      texto:
        "Depois que você tem algumas galinhas, fica difícil lembrar quantos ovos cada uma bota e quando. A planilha da B3 é a lista de todas as suas galinhas. Quando você sobe essa lista aqui no site, a gente desenha o mapa: quantos ovos de ouro vão cair, em quais meses, e quanto isso vira de renda. Você passa a enxergar o futuro do seu galinheiro.",
    },
    paraCrianca:
      "É como ter uma listinha de todas as suas galinhas e um calendário mostrando em que dia cada uma vai botar o ovo de ouro.",
    naPratica:
      "A B3 (a bolsa) deixa você baixar um extrato com tudo o que você tem. Importando esse arquivo aqui, o site monta sua carteira sozinho e projeta quanto de provento você deve receber por mês.",
    secoes: [
      {
        titulo: "Onde pegar a sua planilha",
        paragrafos: [
          "Entre na Área do Investidor da B3 (o site oficial onde ficam registrados seus investimentos), procure por 'Extrato de Movimentação' e baixe o arquivo. É de graça e leva um minuto.",
          "Esse arquivo tem tudo: o que você comprou, quanto, e quando. É a verdade oficial sobre os seus investimentos — não depende de você anotar nada.",
        ],
      },
      {
        titulo: "O que o site faz com ele",
        paragrafos: [
          "Você sobe o arquivo na ferramenta de importação e o site identifica seus FIIs, monta sua carteira e calcula o preço médio. Em seguida, o calendário projeta quanto de 'ovo de ouro' deve cair em cada um dos próximos meses.",
          "Pela primeira vez, em vez de um monte de números soltos, você vê uma resposta simples: 'a este ritmo, sua renda mensal é mais ou menos esta'. E aí dá pra planejar de verdade.",
        ],
      },
    ],
    pontosChave: [
      "A B3 te dá um extrato oficial e gratuito de tudo o que você tem.",
      "Importando aqui, sua carteira se monta sozinha — sem planilha manual.",
      "Você passa a ver sua renda mensal projetada e a planejar com clareza.",
    ],
    experimente: {
      texto:
        "Suba o extrato da B3 e veja sua carteira e a projeção de renda aparecerem na hora.",
      href: "/importacao",
      label: "Importar minha planilha",
    },
  },
];

export const NIVEIS = ["Medo zero", "Primeiros passos", "Mão na massa"] as const;

export function getModulo(slug: string): Modulo | undefined {
  return MODULOS.find((m) => m.slug === slug);
}

export function getVizinhos(slug: string): {
  anterior: Modulo | null;
  proximo: Modulo | null;
} {
  const i = MODULOS.findIndex((m) => m.slug === slug);
  return {
    anterior: i > 0 ? MODULOS[i - 1] : null,
    proximo: i >= 0 && i < MODULOS.length - 1 ? MODULOS[i + 1] : null,
  };
}
