export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://fiibrasil.vercel.app";

export const SITE_NAME = "Bolsa Cheia";

/** Sigla curta usada no "logo" (quadradinho azul). */
export const SITE_SHORT = "B";

/** Frase curta sob o nome, no topo do menu. */
export const SITE_TAGLINE = "Aprenda a investir";

export const SITE_DESCRIPTION =
  "Aprenda a investir do zero — FIIs, ações, renda fixa e mais — com calculadoras, guias e linguagem simples. Sem palavras difíceis, sem golpe. Grátis.";

/** Rotas públicas indexáveis, com prioridade relativa para o sitemap. */
export const PUBLIC_ROUTES: Array<{ path: string; priority: number }> = [
  { path: "/", priority: 1 },
  { path: "/aprender", priority: 0.95 },
  { path: "/kit", priority: 0.9 },
  { path: "/guias", priority: 0.9 },
  { path: "/tipos-de-investimento", priority: 0.95 },
  { path: "/oportunidades", priority: 0.95 },
  { path: "/calculadora-renda", priority: 0.9 },
  { path: "/bola-de-neve", priority: 0.9 },
  { path: "/aluguel-vs-fii", priority: 0.8 },
  { path: "/radar", priority: 0.8 },
  { path: "/calendario", priority: 0.7 },
  { path: "/carteira", priority: 0.7 },
  { path: "/importacao", priority: 0.7 },
  { path: "/glossario", priority: 0.8 },
  { path: "/aviso-legal", priority: 0.3 },
];
