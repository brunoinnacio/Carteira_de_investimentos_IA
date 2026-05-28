"use client";

import { useEffect, useMemo, useState } from "react";

export type Cotacao = {
  ticker: string;
  preco: number;
  fechamentoAnterior: number | null;
  variacaoPercentual: number | null;
  atualizadoEm: string;
};

type CotacoesResp = {
  cotacoes: Record<string, Cotacao>;
  falhas: { ticker: string; erro: string }[];
  consultadoEm: string;
};

export function useCotacoes(tickers: string[]) {
  const key = useMemo(
    () =>
      Array.from(new Set(tickers.filter(Boolean).map((t) => t.toUpperCase())))
        .sort()
        .join(","),
    [tickers]
  );

  const [cotacoes, setCotacoes] = useState<Record<string, Cotacao>>({});
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizadoEm, setAtualizadoEm] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    if (!key) {
      setCotacoes({});
      setAtualizadoEm(null);
      return;
    }
    let cancelado = false;
    setCarregando(true);
    setErro(null);
    fetch(`/api/cotacoes?tickers=${encodeURIComponent(key)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = (await r.json()) as CotacoesResp;
        if (cancelado) return;
        setCotacoes(data.cotacoes ?? {});
        setAtualizadoEm(data.consultadoEm ?? new Date().toISOString());
      })
      .catch((e: unknown) => {
        if (cancelado) return;
        setErro(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [key, reloadIndex]);

  return {
    cotacoes,
    carregando,
    erro,
    atualizadoEm,
    recarregar: () => setReloadIndex((i) => i + 1),
  };
}
