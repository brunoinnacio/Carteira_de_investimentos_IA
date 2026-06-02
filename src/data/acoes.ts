/**
 * Lista curada de AÇÕES brasileiras pagadoras de dividendos, para o explorador
 * "Onde investir".
 *
 * IMPORTANTE — como manter:
 * - `dividendoAnual` (R$/ação pagos nos últimos 12 meses) e `lpa` (lucro por
 *   ação dos últimos 12 meses) mudam ao longo do ano. São uma FOTOGRAFIA da
 *   curadoria, informados aqui manualmente e APROXIMADOS. Confira sempre na
 *   fonte oficial (RI da empresa, Status Invest, B3).
 * - O PREÇO é buscado ao vivo (Yahoo Finance) em tempo de execução, então o
 *   Dividend Yield e o P/L são calculados sempre com o preço atual.
 *
 * Isto é conteúdo educacional, NÃO recomendação de investimento.
 * Atualize ACOES_SNAPSHOT_DATE sempre que revisar os números abaixo.
 */

export const ACOES_SNAPSHOT_DATE = "2026-06-01";

export type Setor =
  | "Bancos"
  | "Financeiro"
  | "Energia Elétrica"
  | "Transmissão"
  | "Saneamento"
  | "Seguros"
  | "Petróleo e Gás"
  | "Mineração"
  | "Telecom"
  | "Papel e Celulose"
  | "Indústria";

export type AcaoSeed = {
  ticker: string;
  nome: string;
  setor: Setor;
  /** Dividendos + JCP por ação nos últimos 12 meses (R$) — fotografia. */
  dividendoAnual: number;
  /** Lucro por ação dos últimos 12 meses (R$) — fotografia, para o P/L. */
  lpa: number;
};

export const ACOES: AcaoSeed[] = [
  // --- Bancos / Financeiro ---
  { ticker: "BBAS3", nome: "Banco do Brasil", setor: "Bancos", dividendoAnual: 3.2, lpa: 9.0 },
  { ticker: "ITUB4", nome: "Itaú Unibanco", setor: "Bancos", dividendoAnual: 1.4, lpa: 3.6 },
  { ticker: "BBDC4", nome: "Bradesco", setor: "Bancos", dividendoAnual: 1.1, lpa: 2.4 },
  { ticker: "SANB11", nome: "Santander Brasil", setor: "Bancos", dividendoAnual: 1.3, lpa: 3.0 },
  { ticker: "ITSA4", nome: "Itaúsa", setor: "Financeiro", dividendoAnual: 0.9, lpa: 1.5 },
  { ticker: "B3SA3", nome: "B3", setor: "Financeiro", dividendoAnual: 0.6, lpa: 1.0 },

  // --- Energia / Transmissão ---
  { ticker: "TAEE11", nome: "Taesa", setor: "Transmissão", dividendoAnual: 3.1, lpa: 3.2 },
  { ticker: "TRPL4", nome: "ISA CTEEP (Transmissão Paulista)", setor: "Transmissão", dividendoAnual: 2.2, lpa: 3.5 },
  { ticker: "CMIG4", nome: "Cemig", setor: "Energia Elétrica", dividendoAnual: 1.1, lpa: 1.8 },
  { ticker: "CPLE6", nome: "Copel", setor: "Energia Elétrica", dividendoAnual: 0.55, lpa: 1.2 },
  { ticker: "EGIE3", nome: "Engie Brasil", setor: "Energia Elétrica", dividendoAnual: 2.8, lpa: 3.4 },
  { ticker: "ELET3", nome: "Eletrobras", setor: "Energia Elétrica", dividendoAnual: 0.8, lpa: 4.0 },

  // --- Saneamento ---
  { ticker: "SBSP3", nome: "Sabesp", setor: "Saneamento", dividendoAnual: 1.6, lpa: 5.5 },
  { ticker: "SAPR11", nome: "Sanepar", setor: "Saneamento", dividendoAnual: 1.8, lpa: 3.2 },
  { ticker: "CSMG3", nome: "Copasa", setor: "Saneamento", dividendoAnual: 2.3, lpa: 4.0 },

  // --- Seguros ---
  { ticker: "BBSE3", nome: "BB Seguridade", setor: "Seguros", dividendoAnual: 2.9, lpa: 3.5 },
  { ticker: "CXSE3", nome: "Caixa Seguridade", setor: "Seguros", dividendoAnual: 1.1, lpa: 1.5 },
  { ticker: "PSSA3", nome: "Porto Seguro", setor: "Seguros", dividendoAnual: 2.4, lpa: 4.5 },

  // --- Commodities / Petróleo ---
  { ticker: "PETR4", nome: "Petrobras", setor: "Petróleo e Gás", dividendoAnual: 6.0, lpa: 9.0 },
  { ticker: "VALE3", nome: "Vale", setor: "Mineração", dividendoAnual: 4.5, lpa: 8.0 },
  { ticker: "SUZB3", nome: "Suzano", setor: "Papel e Celulose", dividendoAnual: 1.5, lpa: 5.0 },
  { ticker: "KLBN11", nome: "Klabin", setor: "Papel e Celulose", dividendoAnual: 0.9, lpa: 1.4 },

  // --- Telecom / Indústria ---
  { ticker: "VIVT3", nome: "Vivo (Telefônica Brasil)", setor: "Telecom", dividendoAnual: 3.0, lpa: 3.2 },
  { ticker: "WEGE3", nome: "WEG", setor: "Indústria", dividendoAnual: 0.7, lpa: 1.6 },
];

export const SETORES: Setor[] = [
  "Bancos",
  "Financeiro",
  "Energia Elétrica",
  "Transmissão",
  "Saneamento",
  "Seguros",
  "Petróleo e Gás",
  "Mineração",
  "Telecom",
  "Papel e Celulose",
  "Indústria",
];

export type ClassificacaoAcao = "Atrativo" | "Justo" | "Caro" | "Sem preço";

/**
 * Regra TRANSPARENTE de classificação para ações de dividendos (não é
 * recomendação):
 * - Atrativo: Dividend Yield anual >= 6% E P/L entre 0 e 12 (barata e paga bem).
 * - Caro: P/L >= 20, P/L <= 0 (sem lucro) OU Dividend Yield < 3%.
 * - Justo: o resto.
 */
export function classificarAcao(
  pl: number | null,
  dyAnual: number | null
): ClassificacaoAcao {
  if (pl === null || dyAnual === null) return "Sem preço";
  if (dyAnual >= 6 && pl > 0 && pl <= 12) return "Atrativo";
  if (pl >= 20 || pl <= 0 || dyAnual < 3) return "Caro";
  return "Justo";
}
