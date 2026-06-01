import { rfKey, type Posicao } from "@/lib/carteira";

/**
 * Carteira de DEMONSTRAÇÃO (~R$ 100 mil), anônima e diversificada.
 * Usada pelo botão "carregar carteira de exemplo" para a pessoa ver o site
 * funcionando por completo (alocação, calendário de proventos, multi-classe)
 * sem precisar dos próprios dados.
 *
 * Os preços médios são fictícios mas realistas; o provento mensal/cota dos FIIs
 * alimenta o calendário. Não é recomendação de investimento.
 */
function rf(nome: string, valor: number): Posicao {
  return {
    ticker: rfKey(nome),
    nome,
    quantidade: 1,
    precoMedio: valor,
    proventoMensalPorCota: 0,
    classe: "rendaFixa",
  };
}

export const CARTEIRA_EXEMPLO: Posicao[] = [
  // --- Renda fixa (~R$ 40 mil) ---
  rf("Tesouro Selic 2029", 20000),
  rf("CDB 110% do CDI — Banco médio", 12000),
  rf("LCI Imobiliária 95% do CDI", 8000),

  // --- FIIs (~R$ 39,5 mil) — pagam quase todo mês ---
  { ticker: "MXRF11", quantidade: 1000, precoMedio: 9.8, proventoMensalPorCota: 0.1, classe: "fii" },
  { ticker: "BTLG11", quantidade: 80, precoMedio: 103.0, proventoMensalPorCota: 0.81, classe: "fii" },
  { ticker: "HGLG11", quantidade: 30, precoMedio: 158.0, proventoMensalPorCota: 1.1, classe: "fii" },
  { ticker: "KNCR11", quantidade: 60, precoMedio: 105.0, proventoMensalPorCota: 1.05, classe: "fii" },
  { ticker: "XPML11", quantidade: 50, precoMedio: 106.0, proventoMensalPorCota: 0.85, classe: "fii" },
  { ticker: "HGRU11", quantidade: 40, precoMedio: 128.0, proventoMensalPorCota: 0.85, classe: "fii" },

  // --- Ações (~R$ 19,4 mil) — dividendos irregulares, deixados em 0 ---
  { ticker: "TAEE11", quantidade: 200, precoMedio: 39.0, proventoMensalPorCota: 0, classe: "acao" },
  { ticker: "ITUB4", quantidade: 200, precoMedio: 32.0, proventoMensalPorCota: 0, classe: "acao" },
  { ticker: "BBAS3", quantidade: 200, precoMedio: 26.0, proventoMensalPorCota: 0, classe: "acao" },
];
