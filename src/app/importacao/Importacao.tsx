"use client";

import Link from "next/link";
import { useState } from "react";
import * as XLSX from "xlsx";
import {
  useCarteira,
  classeDe,
  inferirClasse,
  rfKey,
  CLASSE_LABEL,
  type Posicao,
  type Classe,
} from "@/lib/carteira";
import { brlPrecise } from "@/lib/format";
import { PROVENTO_MENSAL_POR_TICKER } from "@/data/fiis";

// Preenche o provento mensal/cota a partir da base curada de FIIs quando o
// arquivo da B3 não traz essa informação (caso do relatório de Posição).
function enriquecerProventos(posicoes: Posicao[]): {
  posicoes: Posicao[];
  preenchidos: string[];
} {
  const preenchidos: string[] = [];
  const out = posicoes.map((p) => {
    if (
      (p.classe === "fii" || classeDe(p) === "fii") &&
      p.proventoMensalPorCota === 0
    ) {
      const estimado = PROVENTO_MENSAL_POR_TICKER[p.ticker.toUpperCase()];
      if (typeof estimado === "number" && estimado > 0) {
        preenchidos.push(p.ticker);
        return { ...p, proventoMensalPorCota: estimado };
      }
    }
    return p;
  });
  return { posicoes: out, preenchidos };
}

// Referências de mercado (aproximadas) para estimar rendimentos quando a B3
// não informa. Editável por posição na carteira depois.
const CDI_ANUAL = 0.11; // ~ Selic/CDI
const IPCA_ANUAL = 0.045; // inflação de referência

// Dividend yield anual aproximado de pagadoras conhecidas; usado só como ponto
// de partida. Demais ações usam a média do mercado.
const DY_ANUAL_ACAO: Record<string, number> = {
  TAEE11: 0.085, TRPL4: 0.08, BBAS3: 0.09, BBSE3: 0.08, ITUB4: 0.055,
  ITSA4: 0.07, BBDC4: 0.06, PETR4: 0.1, VALE3: 0.07, CMIG4: 0.08,
  CPLE6: 0.06, EGIE3: 0.06, VIVT3: 0.06, SAPR11: 0.05, CXSE3: 0.07,
};
const DY_ANUAL_ACAO_PADRAO = 0.05;
const DY_ANUAL_FII_PADRAO = 0.09; // FII fora da nossa base curada

// Lê o nome do produto da renda fixa (Posição da B3) e estima a taxa anual de
// mercado pelo tipo: %CDI explícito, IPCA+, prefixado, Tesouro Selic, LCI/LCA,
// CRI/CRA/debênture, COE, ou CDB/genérico (~100% CDI).
function estimarTaxaAnualRF(nomeRaw: string): number {
  const n = (nomeRaw || "").toUpperCase();

  const mCdi = n.match(/(\d{2,3})(?:[.,]\d+)?\s*%\s*(?:DO\s*)?CDI/);
  if (mCdi) return (parseFloat(mCdi[1]) / 100) * CDI_ANUAL;

  if (n.includes("IPCA") || n.includes("NTN-B")) {
    const mReal = n.match(/IPCA\s*\+?\s*(\d{1,2}(?:[.,]\d+)?)\s*%/);
    const real = mReal ? parseFloat(mReal[1].replace(",", ".")) / 100 : 0.06;
    return IPCA_ANUAL + real;
  }

  if (
    n.includes("PREFIX") ||
    n.includes("PRÉ") ||
    n.includes("PRE-") ||
    n.includes("LTN") ||
    n.includes("NTN-F")
  ) {
    const mPre = n.match(/(\d{1,2}(?:[.,]\d+)?)\s*%/);
    return mPre ? parseFloat(mPre[1].replace(",", ".")) / 100 : CDI_ANUAL;
  }

  if (n.includes("SELIC") || n.includes("LFT")) return CDI_ANUAL;
  if (n.includes("LCI") || n.includes("LCA")) return 0.95 * CDI_ANUAL;
  if (
    n.includes("CRI") ||
    n.includes("CRA") ||
    n.includes("DEBÊNTURE") ||
    n.includes("DEBENTURE") ||
    n.includes("DEB ")
  ) {
    return IPCA_ANUAL + 0.065;
  }
  if (n.includes("COE")) return 0.07;

  return CDI_ANUAL; // CDB / RDB / LC / pós-fixado genérico
}

// Estima a taxa anual de uma posição conforme a classe e (na RF) o tipo do
// título. Retorna 0 quando não há base para estimar.
function taxaAnualEstimada(p: Posicao): number {
  const classe = classeDe(p);
  if (classe === "rendaFixa") return estimarTaxaAnualRF(p.nome ?? p.ticker);
  if (classe === "acao")
    return DY_ANUAL_ACAO[p.ticker.toUpperCase()] ?? DY_ANUAL_ACAO_PADRAO;
  if (classe === "fii") return DY_ANUAL_FII_PADRAO;
  return 0;
}

// Preenche o provento mensal/cota estimado das posições que ficaram em zero.
// Retorna quantas posições foram estimadas por classe. Muta os objetos.
function estimarRendaFaltante(posicoes: Posicao[]): Record<Classe, number> {
  const contagem: Record<Classe, number> = { fii: 0, acao: 0, rendaFixa: 0 };
  for (const p of posicoes) {
    if (p.proventoMensalPorCota > 0 || p.precoMedio <= 0) continue;
    const taxa = taxaAnualEstimada(p);
    if (!taxa) continue;
    p.proventoMensalPorCota = (p.precoMedio * taxa) / 12;
    contagem[classeDe(p)]++;
  }
  return contagem;
}

// Adiciona um aviso transparente sobre quais rendimentos foram estimados.
function avisarEstimativaRenda(
  avisos: string[],
  contagem: Record<Classe, number>
) {
  const partes: string[] = [];
  if (contagem.rendaFixa > 0)
    partes.push(`${contagem.rendaFixa} título(s) de renda fixa`);
  if (contagem.acao > 0)
    partes.push(`dividendos de ${contagem.acao} ação(ões)`);
  if (contagem.fii > 0)
    partes.push(`${contagem.fii} FII(s) fora da base`);
  if (partes.length === 0) return;
  avisos.push(
    `A B3 não informa o rendimento de renda fixa nem os dividendos de ações. Estimei pela taxa de mercado de cada tipo (Tesouro Selic/CDB ~CDI, IPCA+, LCI/LCA, prefixado, COE) e pelo dividend yield médio: ${partes.join(
      ", "
    )}. Dá para ajustar a taxa de cada título direto na carteira (coluna "Taxa a.a.").`
  );
}

const TICKER_REGEX_GLOBAL = /\b([A-Z]{4}1[12])\b/g;
// Ações/units/BDRs: 4 letras + 1 ou 2 dígitos (PETR4, ITUB3, TAEE11, AAPL34).
const TICKER_ANY_REGEX = /\b([A-Z]{4}\d{1,2})\b/;

async function readXlsxWorkbook(file: File): Promise<XLSX.WorkBook> {
  const buffer = await file.arrayBuffer();
  return XLSX.read(buffer, { type: "array", cellDates: true });
}

function sheetToRows(wb: XLSX.WorkBook, sheetName: string): unknown[][] {
  const ws = wb.Sheets[sheetName];
  if (!ws) return [];
  return XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    defval: null,
    raw: true,
    blankrows: false,
  });
}

function pickMovimentacaoRows(wb: XLSX.WorkBook): unknown[][] {
  const sheetName =
    wb.SheetNames.find((n) => n.toLowerCase().includes("moviment")) ??
    wb.SheetNames[0];
  if (!sheetName) return [];
  return sheetToRows(wb, sheetName);
}

const FRIENDLY_ERROR =
  "Erro ao processar arquivo. Certifique-se de que é a planilha original baixada do portal da B3 (.xlsx, .xls ou .csv).";

type ReadSource = "xlsx" | "csv" | "none";

type ReadDiagnostics = {
  fileName: string;
  sizeBytes: number;
  ext: string;
  source: ReadSource;
  rowCount: number;
  preview: string[][];
  attempts: { kind: "xlsx" | "csv"; ok: boolean; message: string }[];
};

async function readAsText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder("iso-8859-1").decode(buffer);
  }
}

function detectSeparator(line: string): string {
  const semis = (line.match(/;/g) ?? []).length;
  const commas = (line.match(/,/g) ?? []).length;
  const tabs = (line.match(/\t/g) ?? []).length;
  if (tabs >= semis && tabs >= commas && tabs > 0) return "\t";
  return semis >= commas ? ";" : ",";
}

function parseCsvLine(line: string, sep: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === sep) {
        out.push(cur);
        cur = "";
      } else {
        cur += c;
      }
    }
  }
  out.push(cur);
  return out;
}

function parseCsv(text: string): unknown[][] {
  const clean = text.replace(/^\uFEFF/, "");
  const lines = clean.split(/\r?\n/);
  const firstNonEmpty = lines.find((l) => l.trim().length > 0) ?? "";
  if (!firstNonEmpty) return [];
  const sep = detectSeparator(firstNonEmpty);
  return lines
    .map((line) => parseCsvLine(line, sep))
    .filter((row) => row.some((c) => String(c ?? "").trim() !== ""));
}

type Movimento = {
  data: string;
  tipo: "compra" | "venda";
  ticker: string;
  quantidade: number;
  preco: number;
  valor: number;
  classe: Classe;
};

type TickerIgnorado = {
  ticker: string;
  motivo: "nao-fii" | "so-provento";
  descricao?: string;
};

type ParseResult = {
  movimentos: Movimento[];
  posicoes: Posicao[];
  avisos: string[];
  modo: "header" | "heuristico";
  ignoradas: number;
  tickersIgnorados: TickerIgnorado[];
};

function normalizeHeader(s: unknown): string {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function findCol(headers: string[], ...candidates: string[]): number {
  const normalized = headers.map(normalizeHeader);
  for (const c of candidates) {
    const idx = normalized.indexOf(normalizeHeader(c));
    if (idx >= 0) return idx;
  }
  for (const c of candidates) {
    const target = normalizeHeader(c);
    if (!target) continue;
    const idx = normalized.findIndex((h) => h.includes(target));
    if (idx >= 0) return idx;
  }
  return -1;
}

function parseNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (v == null) return 0;
  const s = String(v).trim();
  if (!s) return 0;
  const cleaned = s
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function parseDate(v: unknown): string {
  if (v instanceof Date) {
    const yyyy = v.getFullYear();
    const mm = String(v.getMonth() + 1).padStart(2, "0");
    const dd = String(v.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  if (typeof v === "string") {
    const br = v.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (br) return `${br[3]}-${br[2]}-${br[1]}`;
    const iso = v.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
    return v;
  }
  return "";
}

function detectTipo(s: string): "compra" | "venda" | null {
  const x = s.toLowerCase();
  if (x.includes("compra")) return "compra";
  if (x.includes("venda")) return "venda";
  if (x.includes("transfer") && x.includes("liquid")) return "compra";
  if (x.includes("subscri")) return "compra";
  return null;
}

function isProductFII(produto: string): boolean {
  const s = produto.toLowerCase();
  return (
    s.includes("fii") ||
    s.includes("fdo inv imob") ||
    s.includes("fundo de invest") ||
    s.includes("imobiliario") ||
    s.includes("imobiliária") ||
    s.includes("imobiliario") ||
    s.includes("imobiliaria") ||
    s.includes("fiagro") ||
    s.includes("fundo imob")
  );
}

function classifyB3(
  entradaSaida: string,
  movimentacao: string
): "compra" | "venda" | "ignorar" {
  const m = movimentacao.toLowerCase();
  const e = entradaSaida.toLowerCase();

  if (
    m.includes("dividendo") ||
    m.includes("rendimento") ||
    m.includes("pagamento de rendiment") ||
    m.includes("juros") ||
    m.includes("amortiz") ||
    m.includes("fracao") ||
    m.includes("fração") ||
    m.includes("cofre") ||
    m.includes("imposto")
  ) {
    return "ignorar";
  }

  if (m.includes("transfer") && m.includes("liquid")) {
    return e.includes("debit") ? "venda" : "compra";
  }
  if (m.includes("compra")) return "compra";
  if (m.includes("venda")) return "venda";
  if (m.includes("subscri") && !m.includes("nao exer") && !m.includes("não exer")) {
    return e.includes("debit") ? "venda" : "compra";
  }
  if (m.includes("cessao") || m.includes("cessão")) {
    return "ignorar";
  }
  return "ignorar";
}

function findHeaderRow(rows: unknown[][]): number {
  const limit = Math.min(rows.length, 30);
  for (let i = 0; i < limit; i++) {
    const norm = asRow(rows[i]).map(normalizeHeader).join("|");
    const hasProduto = norm.includes("produto") || norm.includes("ticker");
    const hasQtd =
      norm.includes("quantidade") ||
      norm.includes("qtd") ||
      norm.includes("qtde");
    const hasMov =
      norm.includes("movimentacao") ||
      norm.includes("entradasaida") ||
      norm.includes("tipo") ||
      norm.includes("operacao");
    if (hasProduto && (hasQtd || hasMov)) return i;
  }
  return -1;
}

function parseRows(rows: unknown[][]): ParseResult {
  if (!rows.length) {
    return {
      movimentos: [],
      posicoes: [],
      avisos: ["Planilha vazia."],
      modo: "header",
      ignoradas: 0,
      tickersIgnorados: [],
    };
  }

  const headerRow = findHeaderRow(rows);
  let movimentos: Movimento[] = [];
  let ignoradas = 0;
  let modo: "header" | "heuristico" = "header";
  const avisos: string[] = [];
  const classeMap = new Map<string, Classe>();
  const proventoInfoMap = new Map<
    string,
    { qtd: number; valorPorCota: number }
  >();

  if (headerRow >= 0) {
    const headers = asRow(rows[headerRow]).map((h) => String(h ?? ""));
    const colData = findCol(headers, "Data", "Data Movimentação", "Data do Negócio");
    const colMov = findCol(
      headers,
      "Movimentação",
      "Movimentacao",
      "Tipo",
      "Operação",
      "Operacao",
      "C/V"
    );
    const colEntradaSaida = findCol(
      headers,
      "Entrada/Saída",
      "Entrada/Saida"
    );
    const colProduto = findCol(headers, "Produto", "Ticker", "Código", "Codigo");
    const colQtd = findCol(headers, "Quantidade", "Qtd", "Qtde");
    const colPreco = findCol(
      headers,
      "Preço unitário",
      "Preco unitario",
      "Preço",
      "Preco",
      "Preço Médio",
      "Preco Medio"
    );
    const colValor = findCol(
      headers,
      "Valor da Operação",
      "Valor da Operacao",
      "Valor",
      "Valor Total"
    );

    if (colProduto >= 0 && colQtd >= 0) {
      for (let i = headerRow + 1; i < rows.length; i++) {
        const row = asRow(rows[i]);
        if (!row.length || row.every((c) => c == null || String(c).trim() === "")) {
          continue;
        }
        const produto = String(row[colProduto] ?? "");
        const match = produto.match(TICKER_ANY_REGEX);
        if (!match) continue;
        const ticker = match[1];
        const classe: Classe = isProductFII(produto) ? "fii" : "acao";
        classeMap.set(ticker, classe);

        const entradaSaida =
          colEntradaSaida >= 0 ? String(row[colEntradaSaida] ?? "") : "";
        const movRaw = colMov >= 0 ? String(row[colMov] ?? "") : "";

        let tipo: "compra" | "venda" | "ignorar";
        if (colEntradaSaida >= 0 || /transfer|liquid|dividen|rendiment|subscri|cess/i.test(movRaw)) {
          tipo = classifyB3(entradaSaida, movRaw);
        } else {
          const fallback = detectTipo(movRaw);
          tipo = fallback ?? "compra";
        }

        if (tipo === "ignorar") {
          const ml = movRaw.toLowerCase();
          const ehProvento =
            ml.includes("dividendo") ||
            ml.includes("rendimento") ||
            ml.includes("pagamento de rendiment") ||
            ml.includes("juros") ||
            ml.includes("amortiz");
          // Só estimamos provento mensal para FIIs (pagam todo mês).
          // Ações pagam dividendos irregulares — deixamos para o usuário.
          if (ehProvento && classe === "fii") {
            const qtdProvento = parseNumber(row[colQtd]);
            const precoCota = colPreco >= 0 ? parseNumber(row[colPreco]) : 0;
            if (qtdProvento > 0) {
              const atual = proventoInfoMap.get(ticker) ?? {
                qtd: 0,
                valorPorCota: 0,
              };
              proventoInfoMap.set(ticker, {
                qtd: Math.max(atual.qtd, qtdProvento),
                valorPorCota:
                  precoCota > 0 ? precoCota : atual.valorPorCota,
              });
            }
          }
          ignoradas++;
          continue;
        }

        const quantidade = parseNumber(row[colQtd]);
        const preco = colPreco >= 0 ? parseNumber(row[colPreco]) : 0;
        const valor =
          colValor >= 0 ? parseNumber(row[colValor]) : preco * quantidade;
        const precoFinal =
          preco > 0 ? preco : quantidade > 0 ? valor / quantidade : 0;

        if (quantidade <= 0 || precoFinal <= 0) {
          ignoradas++;
          continue;
        }

        movimentos.push({
          data: parseDate(row[colData]),
          tipo,
          ticker,
          quantidade,
          preco: precoFinal,
          valor: valor || precoFinal * quantidade,
          classe,
        });
      }
    } else {
      avisos.push(
        "Cabeçalho encontrado mas colunas Produto/Quantidade não identificadas. Tentando modo heurístico."
      );
    }
  }

  if (movimentos.length === 0) {
    modo = "heuristico";
    movimentos = heuristicScan(rows);
    if (headerRow < 0) {
      avisos.push(
        "Não encontrei linha de cabeçalho padrão. Usei modo heurístico (busca por tickers FIIs em qualquer célula)."
      );
    }
  }

  if (movimentos.length === 0) {
    avisos.push(
      "Nenhum movimento de compra/venda (FII ou ação) foi reconhecido. Apenas proventos/eventos não afetam a carteira."
    );
  }

  const map = new Map<string, { qtd: number; custo: number }>();
  for (const m of movimentos) {
    const cur = map.get(m.ticker) ?? { qtd: 0, custo: 0 };
    if (m.tipo === "compra") {
      cur.qtd += m.quantidade;
      cur.custo += m.preco * m.quantidade;
    } else {
      const pmAtual = cur.qtd > 0 ? cur.custo / cur.qtd : 0;
      cur.qtd -= m.quantidade;
      cur.custo -= pmAtual * m.quantidade;
      if (cur.qtd <= 0) {
        cur.qtd = 0;
        cur.custo = 0;
      }
    }
    map.set(m.ticker, cur);
  }

  const posicoes: Posicao[] = Array.from(map.entries())
    .filter(([, v]) => v.qtd > 0)
    .map(([ticker, v]) => ({
      ticker,
      quantidade: Math.round(v.qtd),
      precoMedio: v.custo / v.qtd,
      proventoMensalPorCota: 0,
      classe: classeMap.get(ticker) ?? inferirClasse(ticker),
    }));

  const estimados: string[] = [];
  for (const [ticker, info] of proventoInfoMap.entries()) {
    const jaTem = posicoes.find((p) => p.ticker === ticker);
    if (jaTem) {
      if (jaTem.proventoMensalPorCota === 0 && info.valorPorCota > 0) {
        jaTem.proventoMensalPorCota = info.valorPorCota;
      }
      continue;
    }
    posicoes.push({
      ticker,
      quantidade: Math.round(info.qtd),
      precoMedio: 0,
      proventoMensalPorCota: info.valorPorCota,
      classe: "fii",
    });
    estimados.push(ticker);
  }
  posicoes.sort((a, b) => a.ticker.localeCompare(b.ticker));

  // Fallback: FIIs sem provento detectado no extrato recebem a estimativa da base.
  let proventoEstimadoBase = 0;
  for (const p of posicoes) {
    if (classeDe(p) === "fii" && p.proventoMensalPorCota === 0) {
      const est = PROVENTO_MENSAL_POR_TICKER[p.ticker.toUpperCase()];
      if (typeof est === "number" && est > 0) {
        p.proventoMensalPorCota = est;
        proventoEstimadoBase++;
      }
    }
  }
  if (proventoEstimadoBase > 0) {
    avisos.push(
      `Estimei o provento mensal de ${proventoEstimadoBase} FII(s) pela nossa base — o calendário já fica preenchido. Ajuste na carteira se quiser os valores exatos.`
    );
  }

  // Estima a renda das demais classes (ações, FIIs sem base) para a renda
  // mensal ser proporcional ao valor investido.
  const estimativa = estimarRendaFaltante(posicoes);

  const tickersIgnorados: TickerIgnorado[] = [];

  const nFii = posicoes.filter((p) => p.classe === "fii").length;
  const nAcao = posicoes.filter((p) => p.classe === "acao").length;
  if (nFii > 0 || nAcao > 0) {
    avisos.push(
      `Reconheci ${nFii} FII(s) e ${nAcao} ação(ões) no extrato.`
    );
  }
  avisarEstimativaRenda(avisos, estimativa);
  if (estimados.length > 0) {
    const lista = estimados.slice(0, 5).join(", ");
    avisos.push(
      `Adicionei ${estimados.length} FII(s) deduzido(s) dos proventos (sem compra no período): ${lista}${
        estimados.length > 5 ? "…" : ""
      }. A quantidade vem do extrato, mas o PREÇO MÉDIO precisa ser preenchido manualmente em /carteira (essas compras são anteriores ao período baixado).`
    );
  }

  return { movimentos, posicoes, avisos, modo, ignoradas, tickersIgnorados };
}

function heuristicScan(rows: unknown[][]): Movimento[] {
  const out: Movimento[] = [];
  for (const raw of rows) {
    const row = asRow(raw);
    if (row.length === 0) continue;
    const cells = row.map((c) => String(c ?? ""));
    const joined = cells.join(" | ").toUpperCase();
    const tickerMatch = joined.match(TICKER_REGEX_GLOBAL);
    if (!tickerMatch || tickerMatch.length === 0) continue;
    const ticker = tickerMatch[0];

    const numbers = cells
      .map((c) => ({ raw: c, n: parseNumber(c) }))
      .filter((x) => x.n > 0);
    if (numbers.length < 2) continue;

    const inteiros = numbers.filter((x) => Number.isInteger(x.n) && x.n < 100000);
    const decimais = numbers.filter((x) => !Number.isInteger(x.n) || x.n >= 100000);

    let quantidade = 0;
    let preco = 0;
    if (inteiros.length > 0) {
      quantidade = inteiros[0].n;
      preco = decimais.length > 0 ? decimais[0].n : numbers[1].n;
    } else {
      quantidade = numbers[0].n;
      preco = numbers[1].n;
    }
    if (quantidade <= 0 || preco <= 0) continue;

    const tipo = detectTipo(joined) ?? "compra";

    let data = "";
    for (const c of cells) {
      const d = parseDate(c);
      if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
        data = d;
        break;
      }
    }

    out.push({
      data,
      tipo,
      ticker,
      quantidade,
      preco,
      valor: quantidade * preco,
      classe: "fii",
    });
  }
  return out;
}

function asRow(r: unknown): unknown[] {
  if (Array.isArray(r)) return r;
  if (r == null) return [];
  return [r];
}

function previewRows(rows: unknown, n = 8): string[][] {
  const safeRows = Array.isArray(rows) ? rows : [];
  return safeRows.slice(0, n).map((r) =>
    asRow(r)
      .slice(0, 10)
      .map((c) => {
        if (c == null) return "";
        if (c instanceof Date) {
          try {
            return c.toISOString().slice(0, 10);
          } catch {
            return String(c);
          }
        }
        const s = String(c);
        return s.length > 40 ? s.slice(0, 40) + "…" : s;
      })
  );
}

// --- Relatório de POSIÇÃO da B3 (abas Acoes / Fundo de Investimento / Renda Fixa / COE) ---

const POSICAO_SHEETS = [
  "acoes",
  "fundodeinvestimento",
  "rendafixa",
  "coe",
  "tesourodireto",
];

function detectPosicao(wb: XLSX.WorkBook): boolean {
  const nomes = wb.SheetNames.map(normalizeHeader);
  if (nomes.includes("movimentacao")) return false;
  return nomes.some((n) => POSICAO_SHEETS.includes(n));
}

function limparNomeRF(produto: string): string {
  return produto.replace(/\s+/g, " ").trim().slice(0, 90);
}

// Abas de ativos negociáveis (Acoes, Fundo de Investimento): cada linha é um ativo
// com quantidade e valor atual. A Posição NÃO traz preço médio de compra, então
// usamos o preço de fechamento como ponto de partida.
function parseAtivoSheet(rows: unknown[][], classe: Classe): Posicao[] {
  if (!rows.length) return [];
  const headers = asRow(rows[0]).map((h) => String(h ?? ""));
  const cTicker = findCol(
    headers,
    "Código de Negociação",
    "Codigo de Negociacao",
    "Ticker",
    "Código",
    "Codigo"
  );
  const cProduto = findCol(headers, "Produto");
  const cQtd = findCol(headers, "Quantidade");
  const cPreco = findCol(
    headers,
    "Preço de Fechamento",
    "Preco de Fechamento",
    "Preço Fechamento"
  );
  const cValor = findCol(
    headers,
    "Valor Atualizado",
    "Valor Atualizado FECHAMENTO"
  );

  const out: Posicao[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = asRow(rows[i]);
    const produto = cProduto >= 0 ? String(row[cProduto] ?? "") : "";
    let ticker = cTicker >= 0 ? String(row[cTicker] ?? "").trim() : "";
    if (!ticker) {
      const m = produto.match(TICKER_ANY_REGEX);
      if (m) ticker = m[1];
    }
    if (!ticker) continue;

    const quantidade = parseNumber(row[cQtd]);
    const preco = cPreco >= 0 ? parseNumber(row[cPreco]) : 0;
    const valor = cValor >= 0 ? parseNumber(row[cValor]) : 0;
    if (quantidade <= 0) continue;
    // Direitos de subscrição / recibos sem valor de mercado: ignoramos.
    if (preco <= 0 && valor <= 0) continue;

    const precoMedio = preco > 0 ? preco : quantidade > 0 ? valor / quantidade : 0;
    out.push({
      ticker: ticker.toUpperCase(),
      quantidade: Math.round(quantidade),
      precoMedio,
      proventoMensalPorCota: 0,
      classe,
    });
  }
  out.sort((a, b) => a.ticker.localeCompare(b.ticker));
  return out;
}

// Abas sem ticker de mercado (Renda Fixa, COE): viram posições de renda fixa
// pelo valor atual (MTM, ou curva/fechamento como fallback).
function parseRendaFixaSheet(rows: unknown[][]): Posicao[] {
  if (!rows.length) return [];
  const headers = asRow(rows[0]).map((h) => String(h ?? ""));
  const cProduto = findCol(headers, "Produto", "Emissor");
  const cValores = [
    findCol(headers, "Valor Atualizado MTM"),
    findCol(headers, "Valor Atualizado FECHAMENTO"),
    findCol(headers, "Valor Atualizado CURVA"),
    findCol(headers, "Valor Aplicado"),
    findCol(headers, "Valor Atualizado"),
  ].filter((c) => c >= 0);

  const out: Posicao[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = asRow(rows[i]);
    const produto = cProduto >= 0 ? String(row[cProduto] ?? "").trim() : "";
    if (!produto || /^total$/i.test(produto)) continue;

    let valor = 0;
    for (const c of cValores) {
      const v = parseNumber(row[c]);
      if (v > 0) {
        valor = v;
        break;
      }
    }
    if (valor <= 0) continue;

    const nome = limparNomeRF(produto);
    out.push({
      ticker: rfKey(nome),
      nome,
      quantidade: 1,
      precoMedio: valor,
      proventoMensalPorCota: 0,
      classe: "rendaFixa",
    });
  }
  return out;
}

function parsePosicao(wb: XLSX.WorkBook): ParseResult {
  const byNorm = new Map<string, string>();
  for (const n of wb.SheetNames) byNorm.set(normalizeHeader(n), n);
  const rowsOf = (key: string): unknown[][] => {
    const real = byNorm.get(key);
    return real ? sheetToRows(wb, real) : [];
  };

  const acoes = parseAtivoSheet(rowsOf("acoes"), "acao");
  const fundos = parseAtivoSheet(rowsOf("fundodeinvestimento"), "fii");
  const rf = [
    ...parseRendaFixaSheet(rowsOf("rendafixa")),
    ...parseRendaFixaSheet(rowsOf("coe")),
    ...parseRendaFixaSheet(rowsOf("tesourodireto")),
  ];

  const { posicoes, preenchidos } = enriquecerProventos([
    ...fundos,
    ...acoes,
    ...rf,
  ]);

  // Estima a renda mensal de renda fixa, ações e FIIs fora da base (a Posição
  // da B3 não traz esses rendimentos). Sem isso, a renda mensal fica irreal.
  const estimativa = estimarRendaFaltante(posicoes);

  const avisos: string[] = [];
  const totalRF = rf.reduce((a, p) => a + p.precoMedio * p.quantidade, 0);
  avisos.push(
    `Importado da Posição da B3: ${fundos.length} FII(s), ${acoes.length} ação(ões) e ${rf.length} título(s) de renda fixa/COE.`
  );
  if (fundos.length + acoes.length > 0) {
    avisos.push(
      "A Posição da B3 traz o VALOR ATUAL, não o preço médio de compra. Usei o preço de fechamento como preço médio inicial — ajuste na carteira se quiser o custo real de cada ativo."
    );
  }
  if (preenchidos.length > 0) {
    avisos.push(
      `Estimei o provento mensal de ${preenchidos.length} FII(s) pela nossa base — o calendário de proventos já fica preenchido. Confira e ajuste na carteira se quiser os valores exatos.`
    );
  }
  if (rf.length > 0) {
    avisos.push(
      `Renda fixa/COE somam ${brlPrecise(totalRF)} pelo valor atualizado (não têm cotação de mercado).`
    );
  }
  avisarEstimativaRenda(avisos, estimativa);

  return {
    movimentos: [],
    posicoes,
    avisos,
    modo: "header",
    ignoradas: 0,
    tickersIgnorados: [],
  };
}

export function Importacao() {
  const { substituir } = useCarteira();
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [diag, setDiag] = useState<ReadDiagnostics | null>(null);
  const [showDiag, setShowDiag] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setResult(null);
    setFileName(file.name);
    setDiag(null);

    const ext = (file.name.toLowerCase().split(".").pop() ?? "").trim();
    const isCsvByExt = ext === "csv" || ext === "txt";
    const attempts: ReadDiagnostics["attempts"] = [];
    let rows: unknown[][] | null = null;
    let source: ReadSource = "none";
    let posicaoResult: ParseResult | null = null;

    try {
      if (!isCsvByExt) {
        try {
          const wb = await readXlsxWorkbook(file);
          if (detectPosicao(wb)) {
            posicaoResult = parsePosicao(wb);
            rows = sheetToRows(wb, wb.SheetNames[0]);
            source = "xlsx";
            attempts.push({
              kind: "xlsx",
              ok: true,
              message: `Relatório de POSIÇÃO detectado (abas: ${wb.SheetNames.join(
                ", "
              )}). ${posicaoResult.posicoes.length} ativo(s).`,
            });
          } else {
            const xlsxRows = pickMovimentacaoRows(wb);
            attempts.push({
              kind: "xlsx",
              ok: true,
              message: `Lido como XLSX/Movimentação (${xlsxRows.length} linhas).`,
            });
            if (xlsxRows.length > 0) {
              rows = xlsxRows;
              source = "xlsx";
            }
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          attempts.push({ kind: "xlsx", ok: false, message: msg });
          console.error("[importacao] xlsx falhou:", e);
        }
      }

      if (!rows) {
        try {
          const text = await readAsText(file);
          const csvRows = parseCsv(text);
          attempts.push({
            kind: "csv",
            ok: true,
            message: `Lido como CSV/TXT (${csvRows.length} linhas, separador auto-detectado).`,
          });
          if (csvRows.length > 0) {
            rows = csvRows;
            source = "csv";
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          attempts.push({ kind: "csv", ok: false, message: msg });
          console.error("[importacao] csv falhou:", e);
        }
      }

      let preview: string[][] = [];
      try {
        preview = previewRows(rows ?? []);
      } catch (e) {
        console.error("[importacao] preview falhou:", e);
      }

      const diagBase: ReadDiagnostics = {
        fileName: file.name,
        sizeBytes: file.size,
        ext,
        source,
        rowCount: Array.isArray(rows) ? rows.length : 0,
        preview,
        attempts,
      };
      setDiag(diagBase);
      setShowDiag(true);

      if (!posicaoResult && (!rows || rows.length === 0)) {
        setError(FRIENDLY_ERROR);
        return;
      }

      try {
        const parsed = posicaoResult ?? parseRows(rows as unknown[][]);
        setResult(parsed);
      } catch (e) {
        console.error("[importacao] erro ao processar linhas:", e);
        const msg = e instanceof Error ? e.message : String(e);
        attempts.push({
          kind: source === "xlsx" ? "xlsx" : "csv",
          ok: false,
          message: `parseRows: ${msg}`,
        });
        setDiag({ ...diagBase, attempts: [...attempts] });
        setError(FRIENDLY_ERROR);
      }
    } catch (e) {
      console.error("[importacao] erro inesperado:", e);
      const msg = e instanceof Error ? e.message : String(e);
      attempts.push({ kind: "csv", ok: false, message: `inesperado: ${msg}` });
      setDiag({
        fileName: file.name,
        sizeBytes: file.size,
        ext,
        source,
        rowCount: Array.isArray(rows) ? rows.length : 0,
        preview: [],
        attempts,
      });
      setShowDiag(true);
      setError(FRIENDLY_ERROR);
    } finally {
      setBusy(false);
    }
  }

  async function confirmar() {
    if (!result || result.posicoes.length === 0 || saving) return;
    setSaving(true);
    // IMPORTANTE: aguardar a gravação concluir ANTES de navegar. Para usuários
    // logados a gravação é na nuvem (assíncrona); recarregar a página antes de
    // terminar cancelava a requisição e o import se perdia.
    try {
      await substituir(result.posicoes);
    } finally {
      setSaving(false);
    }
    setResult(null);
    setFileName(null);
    if (typeof window !== "undefined") {
      window.location.href = "/carteira";
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <label
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-white p-10 text-center shadow-sm transition ${
          busy
            ? "border-slate-300"
            : "border-slate-300 hover:border-blue-500 hover:bg-blue-50/50"
        }`}
      >
        <input
          type="file"
          accept=".xlsx,.xls,.csv,.txt"
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <div className="text-3xl">📥</div>
        <p className="text-base font-medium text-slate-900">
          {busy
            ? "Lendo o arquivo..."
            : fileName
            ? fileName
            : "Clique para escolher o arquivo da B3"}
        </p>
        <p className="text-xs text-slate-500">
          Aceita .xlsx, .xls e .csv · relatório de <strong>Posição</strong>{" "}
          (recomendado, copia fiel) ou de Movimentação da Área do Investidor
        </p>
      </label>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </div>
      ) : null}

      {diag ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <button
            type="button"
            onClick={() => setShowDiag((v) => !v)}
            className="flex w-full items-center justify-between text-left font-semibold text-slate-900"
          >
            <span>
              Diagnóstico técnico ·{" "}
              <span
                className={
                  diag.source === "none" ? "text-rose-700" : "text-emerald-700"
                }
              >
                {diag.source === "xlsx"
                  ? "lido como XLSX"
                  : diag.source === "csv"
                  ? "lido como CSV/TXT"
                  : "não consegui ler"}
              </span>
            </span>
            <span className="text-xs text-slate-500">
              {showDiag ? "ocultar" : "mostrar"}
            </span>
          </button>

          {showDiag ? (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 sm:grid-cols-4">
                <div>
                  <span className="block font-semibold text-slate-500">Arquivo</span>
                  <span className="text-slate-800">{diag.fileName}</span>
                </div>
                <div>
                  <span className="block font-semibold text-slate-500">Tamanho</span>
                  <span className="text-slate-800">
                    {(diag.sizeBytes / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div>
                  <span className="block font-semibold text-slate-500">Extensão</span>
                  <span className="text-slate-800">.{diag.ext || "?"}</span>
                </div>
                <div>
                  <span className="block font-semibold text-slate-500">Linhas lidas</span>
                  <span className="text-slate-800">{diag.rowCount}</span>
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tentativas de leitura
                </p>
                <ul className="space-y-1 text-xs">
                  {diag.attempts.map((a, i) => (
                    <li
                      key={i}
                      className={
                        a.ok
                          ? "text-emerald-700"
                          : "text-rose-700"
                      }
                    >
                      <span className="font-semibold">[{a.kind}]</span>{" "}
                      {a.message}
                    </li>
                  ))}
                </ul>
              </div>

              {diag.preview.length > 0 ? (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Primeiras linhas (até 10 colunas)
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="min-w-full text-[11px]">
                      <tbody>
                        {diag.preview.map((r, i) => (
                          <tr key={i} className="border-b border-slate-100 last:border-0">
                            <td className="bg-slate-50 px-2 py-1 text-right font-mono text-slate-400">
                              {i}
                            </td>
                            {r.map((c, j) => (
                              <td
                                key={j}
                                className="border-l border-slate-100 px-2 py-1 font-mono text-slate-700"
                              >
                                {c}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              <p className="text-xs text-slate-500">
                Se o sistema não reconheceu seu arquivo, copie esse diagnóstico
                ou mande print pro suporte.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {result ? (
        <>
          {result.avisos.length > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {result.avisos.map((a, i) => (
                <p key={i}>{a}</p>
              ))}
            </div>
          ) : null}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Pré-visualização
              </h2>
              <p className="text-xs text-slate-500">
                {result.movimentos.length} compra/venda ·{" "}
                {result.posicoes.length} ticker(s) em carteira ·{" "}
                {result.ignoradas} linha(s) ignoradas (proventos/eventos) ·{" "}
                <span className="text-slate-400">modo {result.modo}</span>
              </p>
            </div>

            {result.posicoes.length === 0 ? (
              <p className="text-sm text-slate-500">
                Nenhuma posição resultou desse arquivo. Veja o diagnóstico acima
                para entender o que foi lido.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Ticker</th>
                      <th className="px-4 py-3 text-right">Cotas</th>
                      <th className="px-4 py-3 text-right">Preço médio</th>
                      <th className="px-4 py-3 text-right">Investido</th>
                      <th className="px-4 py-3 text-right">Provento/cota</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {result.posicoes.map((p) => {
                      const ehRF = classeDe(p) === "rendaFixa";
                      const estimado = !ehRF && p.precoMedio === 0;
                      return (
                        <tr
                          key={p.ticker}
                          className={
                            estimado
                              ? "bg-amber-50/40 text-slate-700"
                              : "text-slate-700"
                          }
                        >
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            <span className="flex items-center gap-2">
                              {ehRF ? p.nome ?? p.ticker.replace(/^RF:/, "") : p.ticker}
                              <span
                                className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ${
                                  classeDe(p) === "acao"
                                    ? "bg-violet-100 text-violet-800 ring-violet-200"
                                    : ehRF
                                    ? "bg-teal-100 text-teal-800 ring-teal-200"
                                    : "bg-blue-100 text-blue-800 ring-blue-200"
                                }`}
                              >
                                {CLASSE_LABEL[classeDe(p)]}
                              </span>
                              {estimado ? (
                                <span
                                  title="Quantidade deduzida do extrato de proventos. Preço médio precisa ser preenchido manualmente."
                                  className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-800 ring-1 ring-amber-200"
                                >
                                  PM ?
                                </span>
                              ) : null}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {ehRF ? (
                              <span className="text-slate-400">—</span>
                            ) : (
                              p.quantidade
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {ehRF ? (
                              <span className="text-slate-400">—</span>
                            ) : estimado ? (
                              <span className="text-amber-700">
                                a preencher
                              </span>
                            ) : (
                              brlPrecise(p.precoMedio)
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {estimado ? (
                              <span className="text-slate-400">—</span>
                            ) : (
                              brlPrecise(p.precoMedio * p.quantidade)
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {p.proventoMensalPorCota > 0 ? (
                              brlPrecise(p.proventoMensalPorCota)
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-50 text-sm font-semibold text-slate-900">
                    <tr>
                      <td className="px-4 py-3" colSpan={3}>
                        Total investido conhecido
                      </td>
                      <td className="px-4 py-3 text-right">
                        {brlPrecise(
                          result.posicoes.reduce(
                            (acc, p) => acc + p.precoMedio * p.quantidade,
                            0
                          )
                        )}
                      </td>
                      <td className="px-4 py-3" />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setFileName(null);
                }}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmar}
                disabled={result.posicoes.length === 0 || saving}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Salvando…" : "Substituir minha carteira por essa"}
              </button>
            </div>
          </div>

          {result.tickersIgnorados.length > 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Tickers ignorados ({result.tickersIgnorados.length})
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Apareceram no arquivo mas não entraram na carteira. Veja o
                motivo de cada um:
              </p>
              <ul className="mt-3 divide-y divide-slate-100">
                {result.tickersIgnorados.map((t) => (
                  <li
                    key={`${t.ticker}-${t.motivo}`}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2.5"
                  >
                    <span className="font-mono text-sm font-semibold text-slate-900">
                      {t.ticker}
                    </span>
                    {t.motivo === "nao-fii" ? (
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200">
                        não é FII
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-800 ring-1 ring-blue-200">
                        só provento (compra fora do período)
                      </span>
                    )}
                    {t.descricao ? (
                      <span className="text-xs text-slate-500">
                        {t.descricao}
                        {t.descricao.length >= 60 ? "…" : ""}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
              {result.tickersIgnorados.some((t) => t.motivo === "so-provento") ? (
                <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <strong className="text-slate-800">Dica:</strong> para
                  importar essas posições, baixe novamente o extrato em{" "}
                  <a
                    href="https://www.investidor.b3.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-700 hover:underline"
                  >
                    investidor.b3.com.br
                  </a>{" "}
                  com período mais amplo (ex: últimos 5 anos) para incluir as
                  compras originais.
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">Depois de importar:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
          <li>
            Edite cada ativo na{" "}
            <Link
              href="/carteira"
              className="font-semibold text-blue-700 hover:text-blue-800"
            >
              página da carteira
            </Link>{" "}
            para informar o provento/dividendo mensal (FIIs pagam todo mês).
          </li>
          <li>
            Veja a projeção no{" "}
            <Link
              href="/calendario"
              className="font-semibold text-blue-700 hover:text-blue-800"
            >
              calendário de proventos
            </Link>
            .
          </li>
        </ul>
      </div>
    </div>
  );
}
