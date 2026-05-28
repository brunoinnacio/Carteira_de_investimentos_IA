import { NextResponse } from "next/server";

const TICKER_REGEX = /^[A-Z]{4}1[12]$/;

type YahooChart = {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
        previousClose?: number;
        regularMarketTime?: number;
        symbol?: string;
      };
    }>;
    error?: { code?: string; description?: string } | null;
  };
};

type CotacaoOk = {
  ticker: string;
  preco: number;
  fechamentoAnterior: number | null;
  variacaoPercentual: number | null;
  atualizadoEm: string;
};

type CotacaoErr = { ticker: string; erro: string };

async function fetchYahoo(ticker: string): Promise<CotacaoOk | CotacaoErr> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.SA?interval=1d&range=5d`;
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; FIIBrasil/1.0; +https://fiibrasil.vercel.app)",
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });
    if (!r.ok) {
      return { ticker, erro: `HTTP ${r.status}` };
    }
    const data = (await r.json()) as YahooChart;
    const meta = data?.chart?.result?.[0]?.meta;
    const preco = meta?.regularMarketPrice;
    if (typeof preco !== "number") {
      return { ticker, erro: "cotacao indisponivel" };
    }
    const previo = typeof meta?.previousClose === "number" ? meta.previousClose : null;
    const variacao =
      previo && previo > 0 ? ((preco - previo) / previo) * 100 : null;
    return {
      ticker,
      preco,
      fechamentoAnterior: previo,
      variacaoPercentual: variacao,
      atualizadoEm: meta?.regularMarketTime
        ? new Date(meta.regularMarketTime * 1000).toISOString()
        : new Date().toISOString(),
    };
  } catch (e) {
    return {
      ticker,
      erro: e instanceof Error ? e.message : "erro desconhecido",
    };
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = url.searchParams.get("tickers") ?? "";
  const tickers = Array.from(
    new Set(
      raw
        .split(",")
        .map((t) => t.trim().toUpperCase())
        .filter((t) => TICKER_REGEX.test(t))
    )
  );

  if (tickers.length === 0) {
    return NextResponse.json(
      { erro: "informe ?tickers=XXXX11,YYYY11 (ate 50 codigos)" },
      { status: 400 }
    );
  }
  if (tickers.length > 50) {
    return NextResponse.json(
      { erro: "maximo 50 tickers por chamada" },
      { status: 400 }
    );
  }

  const resultados = await Promise.all(tickers.map(fetchYahoo));

  const sucesso: Record<string, CotacaoOk> = {};
  const falhas: CotacaoErr[] = [];
  for (const r of resultados) {
    if ("preco" in r) sucesso[r.ticker] = r;
    else falhas.push(r);
  }

  return NextResponse.json(
    {
      cotacoes: sucesso,
      falhas,
      consultadoEm: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
