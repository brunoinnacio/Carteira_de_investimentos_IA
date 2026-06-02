"use client";

import { useState } from "react";
import { Screener } from "./Screener";
import { ScreenerAcoes } from "./ScreenerAcoes";

type Aba = "fiis" | "acoes";

export function ExploradorAtivos() {
  const [aba, setAba] = useState<Aba>("fiis");

  return (
    <div className="flex flex-col gap-6">
      <div className="inline-flex w-full max-w-md rounded-xl border border-slate-200 bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setAba("fiis")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            aba === "fiis"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
          aria-pressed={aba === "fiis"}
        >
          FIIs · renda mensal
        </button>
        <button
          type="button"
          onClick={() => setAba("acoes")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            aba === "acoes"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
          aria-pressed={aba === "acoes"}
        >
          Ações · dividendos
        </button>
      </div>

      <div>
        <p className="mb-5 text-sm text-slate-600">
          {aba === "fiis"
            ? "Fundos imobiliários ordenados por critérios objetivos. Preço ao vivo; P/VP e Dividend Yield calculados na hora."
            : "Ações pagadoras de dividendos. Preço ao vivo; P/L e Dividend Yield calculados na hora. Foco em renda — não em trade."}
        </p>
        {aba === "fiis" ? <Screener /> : <ScreenerAcoes />}
      </div>
    </div>
  );
}
