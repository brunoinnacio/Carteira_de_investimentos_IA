/**
 * Lista curada de FIIs para o screener "Oportunidades".
 *
 * IMPORTANTE — como manter:
 * - `vpa` (Valor Patrimonial por cota) e `proventoMensal` (provento médio por
 *   cota) mudam devagar (mensal/trimestral). São uma FOTOGRAFIA da curadoria,
 *   informados aqui manualmente. Confira sempre na fonte oficial (relatório
 *   gerencial do fundo, B3, RI).
 * - O PREÇO é buscado ao vivo (Yahoo Finance) em tempo de execução, então
 *   P/VP e Dividend Yield são calculados sempre com o preço atual.
 *
 * Atualize SNAPSHOT_DATE sempre que revisar os números abaixo.
 */

export const SNAPSHOT_DATE = "2026-06-01";

export type Segmento =
  | "Papel"
  | "Logística"
  | "Lajes Corporativas"
  | "Shoppings"
  | "Renda Urbana"
  | "Fundo de Fundos"
  | "Híbrido"
  | "Agro";

export type Liquidez = "Alta" | "Média" | "Baixa";

export type FIISeed = {
  ticker: string;
  nome: string;
  segmento: Segmento;
  /** Valor patrimonial por cota (R$) — fotografia da curadoria. */
  vpa: number;
  /** Provento médio por cota nos últimos meses (R$/mês) — fotografia. */
  proventoMensal: number;
  /** Faixa de liquidez (volume médio diário). */
  liquidez: Liquidez;
};

export const FIIS: FIISeed[] = [
  // --- Papel / Recebíveis ---
  { ticker: "MXRF11", nome: "Maxi Renda", segmento: "Papel", vpa: 10.05, proventoMensal: 0.1, liquidez: "Alta" },
  { ticker: "KNCR11", nome: "Kinea Rendimentos", segmento: "Papel", vpa: 104, proventoMensal: 1.05, liquidez: "Alta" },
  { ticker: "KNIP11", nome: "Kinea Índices de Preços", segmento: "Papel", vpa: 98, proventoMensal: 0.95, liquidez: "Alta" },
  { ticker: "KNSC11", nome: "Kinea Securities", segmento: "Papel", vpa: 9.0, proventoMensal: 0.1, liquidez: "Alta" },
  { ticker: "CPTS11", nome: "Capitânia Securities", segmento: "Papel", vpa: 8.0, proventoMensal: 0.08, liquidez: "Alta" },
  { ticker: "RECR11", nome: "REC Recebíveis", segmento: "Papel", vpa: 9.5, proventoMensal: 0.1, liquidez: "Média" },
  { ticker: "IRDM11", nome: "Iridium Recebíveis", segmento: "Papel", vpa: 85, proventoMensal: 0.85, liquidez: "Alta" },
  { ticker: "VGIP11", nome: "Valora CRI Índices", segmento: "Papel", vpa: 92, proventoMensal: 1.0, liquidez: "Média" },

  // --- Logística ---
  { ticker: "HGLG11", nome: "CSHG Logística", segmento: "Logística", vpa: 160, proventoMensal: 1.1, liquidez: "Alta" },
  { ticker: "BTLG11", nome: "BTG Pactual Logística", segmento: "Logística", vpa: 103, proventoMensal: 0.81, liquidez: "Alta" },
  { ticker: "XPLG11", nome: "XP Log", segmento: "Logística", vpa: 100, proventoMensal: 0.78, liquidez: "Alta" },
  { ticker: "VILG11", nome: "Vinci Logística", segmento: "Logística", vpa: 110, proventoMensal: 0.8, liquidez: "Média" },

  // --- Lajes Corporativas ---
  { ticker: "HGRE11", nome: "CSHG Real Estate", segmento: "Lajes Corporativas", vpa: 150, proventoMensal: 0.95, liquidez: "Média" },
  { ticker: "PVBI11", nome: "VBI Prime Properties", segmento: "Lajes Corporativas", vpa: 100, proventoMensal: 0.65, liquidez: "Média" },

  // --- Shoppings ---
  { ticker: "XPML11", nome: "XP Malls", segmento: "Shoppings", vpa: 110, proventoMensal: 0.85, liquidez: "Alta" },
  { ticker: "VISC11", nome: "Vinci Shopping Centers", segmento: "Shoppings", vpa: 110, proventoMensal: 0.85, liquidez: "Alta" },
  { ticker: "MALL11", nome: "Malls Brasil Plural", segmento: "Shoppings", vpa: 110, proventoMensal: 0.95, liquidez: "Média" },
  { ticker: "HSML11", nome: "HSI Malls", segmento: "Shoppings", vpa: 95, proventoMensal: 0.8, liquidez: "Média" },
  { ticker: "HGBS11", nome: "Hedge Brasil Shopping", segmento: "Shoppings", vpa: 210, proventoMensal: 1.5, liquidez: "Média" },

  // --- Renda Urbana / Híbrido / Agro ---
  { ticker: "HGRU11", nome: "CSHG Renda Urbana", segmento: "Renda Urbana", vpa: 125, proventoMensal: 0.85, liquidez: "Alta" },
  { ticker: "TRXF11", nome: "TRX Real Estate", segmento: "Renda Urbana", vpa: 100, proventoMensal: 0.85, liquidez: "Média" },
  { ticker: "KNRI11", nome: "Kinea Renda Imobiliária", segmento: "Híbrido", vpa: 160, proventoMensal: 0.95, liquidez: "Alta" },
  { ticker: "RZTR11", nome: "Riza Terrax", segmento: "Agro", vpa: 100, proventoMensal: 1.0, liquidez: "Média" },

  // --- Fundo de Fundos ---
  { ticker: "RBRF11", nome: "RBR Alpha (FoF)", segmento: "Fundo de Fundos", vpa: 62, proventoMensal: 0.55, liquidez: "Média" },
  { ticker: "HFOF11", nome: "Hedge Top FoFII", segmento: "Fundo de Fundos", vpa: 70, proventoMensal: 0.55, liquidez: "Média" },
  { ticker: "BCFF11", nome: "BTG Pactual FoF", segmento: "Fundo de Fundos", vpa: 70, proventoMensal: 0.5, liquidez: "Média" },
];

/**
 * Provento médio mensal por cota (R$) indexado por ticker — usado para
 * pré-preencher a estimativa de renda na importação da carteira. É uma
 * fotografia da curadoria (SNAPSHOT_DATE); o usuário pode ajustar.
 */
export const PROVENTO_MENSAL_POR_TICKER: Record<string, number> =
  Object.fromEntries(FIIS.map((f) => [f.ticker, f.proventoMensal]));

export const SEGMENTOS: Segmento[] = [
  "Papel",
  "Logística",
  "Lajes Corporativas",
  "Shoppings",
  "Renda Urbana",
  "Híbrido",
  "Agro",
  "Fundo de Fundos",
];

export type Classificacao = "Atrativo" | "Justo" | "Caro" | "Sem preço";

/**
 * Regra TRANSPARENTE de classificação (não é recomendação):
 * - Atrativo: P/VP <= 0,98 E Dividend Yield anual >= 9%.
 * - Caro: P/VP >= 1,10 OU Dividend Yield anual < 7%.
 * - Justo: o resto.
 */
export function classificar(
  pvp: number | null,
  dyAnual: number | null
): Classificacao {
  if (pvp === null || dyAnual === null) return "Sem preço";
  if (pvp <= 0.98 && dyAnual >= 9) return "Atrativo";
  if (pvp >= 1.1 || dyAnual < 7) return "Caro";
  return "Justo";
}
