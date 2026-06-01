"use client";

import Link from "next/link";
import { useState } from "react";
import * as XLSX from "xlsx";
import {
  useCarteira,
  classeDe,
  inferirClasse,
  CLASSE_LABEL,
  type Posicao,
  type Classe,
} from "@/lib/carteira";
import { brlPrecise } from "@/lib/format";

const TICKER_REGEX_GLOBAL = /\b([A-Z]{4}1[12])\b/g;
// Ações/units/BDRs: 4 letras + 1 ou 2 dígitos (PETR4, ITUB3, TAEE11, AAPL34).
const TICKER_ANY_REGEX = /\b([A-Z]{4}\d{1,2})\b/;

async function readXlsxAsRows(file: File): Promise<unknown[][]> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName =
    wb.SheetNames.find((n) => n.toLowerCase().includes("moviment")) ??
    wb.SheetNames[0];
  if (!sheetName) return [];
  const ws = wb.Sheets[sheetName];
  if (!ws) return [];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    defval: null,
    raw: true,
    blankrows: false,
  });
  return rows;
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

  const tickersIgnorados: TickerIgnorado[] = [];

  const nFii = posicoes.filter((p) => p.classe === "fii").length;
  const nAcao = posicoes.filter((p) => p.classe === "acao").length;
  if (nAcao > 0) {
    avisos.push(
      `Reconheci ${nFii} FII(s) e ${nAcao} ação(ões) no extrato. As ações entram sem dividendo estimado — informe se quiser na carteira.`
    );
  }
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

export function Importacao() {
  const { substituir } = useCarteira();
  const [busy, setBusy] = useState(false);
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

    try {
      if (!isCsvByExt) {
        try {
          const xlsxRows = await readXlsxAsRows(file);
          attempts.push({
            kind: "xlsx",
            ok: true,
            message: `Lido como XLSX (${xlsxRows.length} linhas).`,
          });
          if (xlsxRows.length > 0) {
            rows = xlsxRows;
            source = "xlsx";
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

      if (!rows || rows.length === 0) {
        setError(FRIENDLY_ERROR);
        return;
      }

      try {
        const parsed = parseRows(rows);
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

  function confirmar() {
    if (!result || result.posicoes.length === 0) return;
    substituir(result.posicoes);
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
          Aceita .xlsx, .xls e .csv · arquivo de Movimentação da Área do
          Investidor
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
                      const estimado = p.precoMedio === 0;
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
                              {p.ticker}
                              <span
                                className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ${
                                  classeDe(p) === "acao"
                                    ? "bg-violet-100 text-violet-800 ring-violet-200"
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
                            {p.quantidade}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {estimado ? (
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
                disabled={result.posicoes.length === 0}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Substituir minha carteira por essa
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
