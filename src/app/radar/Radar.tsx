"use client";

import { useMemo, useState } from "react";
import { BrokerCta } from "@/components/BrokerCta";
import { CurrencyInput } from "@/components/CurrencyInput";
import {
  TickerInput,
  isValidTicker,
  isValidTickerAcao,
} from "@/components/TickerInput";
import { brlPrecise, percent } from "@/lib/format";

type Modo = "fii" | "acao";

type Classificacao = {
  label: string;
  color: "ok" | "neutro" | "ruim";
  explicacao: string;
};

function classifyPvp(pvp: number): Classificacao {
  if (pvp <= 0) return { label: "—", color: "neutro", explicacao: "Informe o VPA." };
  if (pvp < 0.9)
    return {
      label: "Descontado",
      color: "ok",
      explicacao:
        "Cotando abaixo do patrimônio. Pode ser oportunidade — ou sinal de problema no fundo. Investigue.",
    };
  if (pvp <= 1.05)
    return {
      label: "Próximo do justo",
      color: "neutro",
      explicacao:
        "Cota perto do valor patrimonial. Preço considerado justo no mercado de FIIs.",
    };
  if (pvp <= 1.2)
    return {
      label: "Levemente caro",
      color: "neutro",
      explicacao: "Acima do patrimônio. Aceitável se o fundo cresce bem.",
    };
  return {
    label: "Caro",
    color: "ruim",
    explicacao: "Cotação muito acima do patrimônio. Margem de segurança baixa.",
  };
}

function classifyPl(pl: number): Classificacao {
  if (pl <= 0)
    return {
      label: "—",
      color: "neutro",
      explicacao: "Informe o lucro por ação (LPA). Sem lucro, não dá pra calcular.",
    };
  if (pl < 8)
    return {
      label: "Barata",
      color: "ok",
      explicacao:
        "Você paga pouco por cada real de lucro. Pode ser oportunidade — ou o mercado espera queda nos lucros.",
    };
  if (pl <= 15)
    return {
      label: "Justa",
      color: "neutro",
      explicacao: "P/L em faixa comum para empresas sólidas da bolsa.",
    };
  if (pl <= 20)
    return {
      label: "Levemente cara",
      color: "neutro",
      explicacao: "Acima da média. Faz sentido se a empresa cresce rápido.",
    };
  return {
    label: "Cara",
    color: "ruim",
    explicacao: "P/L alto. O mercado já precifica muito crescimento — risco maior.",
  };
}

function classifyDyFii(dy: number): Classificacao {
  if (dy <= 0)
    return { label: "—", color: "neutro", explicacao: "Informe o provento mensal." };
  if (dy >= 12)
    return {
      label: "Yield agressivo",
      color: "ok",
      explicacao:
        "DY muito alto. Pode ser ótimo, mas yield acima do mercado costuma vir com risco — confira a sustentabilidade.",
    };
  if (dy >= 9)
    return {
      label: "Bom",
      color: "ok",
      explicacao: "Acima da média do IFIX. Atrativo para renda mensal.",
    };
  if (dy >= 7)
    return {
      label: "Na média",
      color: "neutro",
      explicacao: "DY em linha com a média do mercado de FIIs.",
    };
  return {
    label: "Baixo",
    color: "ruim",
    explicacao: "Abaixo da média. Pode fazer sentido se você espera valorização da cota.",
  };
}

function classifyDyAcao(dy: number): Classificacao {
  if (dy <= 0)
    return {
      label: "—",
      color: "neutro",
      explicacao: "Informe os dividendos anuais por ação.",
    };
  if (dy >= 8)
    return {
      label: "Yield alto",
      color: "ok",
      explicacao:
        "Dividend Yield bem acima do mercado. Ótimo para renda — mas confira se o lucro sustenta esse pagamento.",
    };
  if (dy >= 5)
    return {
      label: "Bom",
      color: "ok",
      explicacao: "Boa pagadora de dividendos para o padrão da bolsa brasileira.",
    };
  if (dy >= 3)
    return {
      label: "Na média",
      color: "neutro",
      explicacao: "Dividendos na média do mercado de ações.",
    };
  return {
    label: "Baixo",
    color: "ruim",
    explicacao:
      "Paga poucos dividendos. Comum em empresas de crescimento, que reinvestem o lucro.",
  };
}

function classifyYoc(yoc: number, dy: number): Classificacao {
  if (yoc <= 0)
    return { label: "—", color: "neutro", explicacao: "Informe seu preço médio." };
  if (yoc >= dy * 1.2)
    return {
      label: "Você comprou bem",
      color: "ok",
      explicacao:
        "Seu Yield on Cost está acima do yield de mercado: você travou um rendimento maior do que quem compra hoje.",
    };
  if (yoc >= dy * 0.9)
    return {
      label: "Em linha com o mercado",
      color: "neutro",
      explicacao: "Seu YoC está parecido com o yield atual. Comprou perto do preço de hoje.",
    };
  return {
    label: "YoC baixo",
    color: "ruim",
    explicacao:
      "Você pagou caro: YoC ficou abaixo do yield atual. Quem compra hoje recebe mais por real investido.",
  };
}

function Badge({ c }: { c: Classificacao }) {
  const cls =
    c.color === "ok"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : c.color === "ruim"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : "border-slate-200 bg-slate-100 text-slate-700";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${cls}`}
    >
      {c.label}
    </span>
  );
}

export function Radar() {
  const [modo, setModo] = useState<Modo>("fii");

  const [ticker, setTicker] = useState("MXRF11");
  const [tickerTouched, setTickerTouched] = useState(false);
  const [preco, setPreco] = useState(10);
  const [precoMedio, setPrecoMedio] = useState(0);

  // FII
  const [provMensal, setProvMensal] = useState(0.1);
  const [vpa, setVpa] = useState(10);

  // Ação
  const [dividendoAnual, setDividendoAnual] = useState(2);
  const [lpa, setLpa] = useState(3);

  const isFii = modo === "fii";

  function trocarModo(novo: Modo) {
    if (novo === modo) return;
    setModo(novo);
    setTickerTouched(false);
    setTicker(novo === "fii" ? "MXRF11" : "BBAS3");
  }

  const tickerOk = isFii ? isValidTicker(ticker) : isValidTickerAcao(ticker);
  const tickerError =
    !tickerOk && ticker.length > 0 && tickerTouched
      ? isFii
        ? "Ticker inválido. Padrão esperado: XXXX11"
        : "Ticker inválido. Ex.: PETR4, BBAS3, TAEE11"
      : undefined;

  // Indicadores
  const pvp = vpa > 0 ? preco / vpa : 0;
  const pl = lpa > 0 ? preco / lpa : 0;
  const dyAnual = isFii
    ? preco > 0
      ? ((provMensal * 12) / preco) * 100
      : 0
    : preco > 0
    ? (dividendoAnual / preco) * 100
    : 0;
  const yoc =
    precoMedio > 0
      ? isFii
        ? ((provMensal * 12) / precoMedio) * 100
        : (dividendoAnual / precoMedio) * 100
      : 0;

  const cValor = useMemo(
    () => (isFii ? classifyPvp(pvp) : classifyPl(pl)),
    [isFii, pvp, pl]
  );
  const cDy = useMemo(
    () => (isFii ? classifyDyFii(dyAnual) : classifyDyAcao(dyAnual)),
    [isFii, dyAnual]
  );
  const cYoc = useMemo(() => classifyYoc(yoc, dyAnual), [yoc, dyAnual]);

  const todos: Classificacao[] = [cValor, cDy];
  const oks = todos.filter((c) => c.color === "ok").length;
  const ruins = todos.filter((c) => c.color === "ruim").length;

  let veredito: Classificacao;
  let veredictoBg: string;
  if (oks >= 2) {
    veredito = {
      label: "Atrativo",
      color: "ok",
      explicacao: isFii
        ? "P/VP e DY positivos. Bom candidato para uma análise mais profunda."
        : "Preço (P/L) e dividendos positivos. Bom candidato para uma análise mais profunda.",
    };
    veredictoBg = "border-blue-100 bg-blue-600 text-white";
  } else if (ruins >= 2) {
    veredito = {
      label: "Pouco atrativo agora",
      color: "ruim",
      explicacao: isFii
        ? "Indicadores ruins. Há FIIs melhores no mercado hoje."
        : "Indicadores ruins para renda. Há pagadoras melhores no mercado hoje.",
    };
    veredictoBg = "border-rose-200 bg-rose-50 text-rose-900";
  } else {
    veredito = {
      label: "Neutro",
      color: "neutro",
      explicacao:
        "Indicadores em linha com o mercado. A decisão depende do seu objetivo e da qualidade do ativo.",
    };
    veredictoBg = "border-slate-200 bg-white text-slate-900";
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="inline-flex w-full max-w-sm rounded-xl border border-slate-200 bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => trocarModo("fii")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            isFii ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
          aria-pressed={isFii}
        >
          FII
        </button>
        <button
          type="button"
          onClick={() => trocarModo("acao")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            !isFii ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
          aria-pressed={!isFii}
        >
          Ação
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            {isFii ? "Dados do FII" : "Dados da ação"}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Pega no Status Invest, Funds Explorer ou na própria B3.
          </p>

          <div className="mt-5 grid gap-4">
            <TickerInput
              label="Ticker"
              value={ticker}
              onChange={(v) => {
                setTicker(v);
                if (tickerTouched && v.length === 0) setTickerTouched(false);
              }}
              onBlur={() => setTickerTouched(true)}
              error={tickerError}
            />
            <CurrencyInput
              label={isFii ? "Preço atual da cota" : "Preço atual da ação"}
              value={preco}
              onChange={setPreco}
            />

            {isFii ? (
              <>
                <CurrencyInput
                  label="Último provento mensal por cota"
                  value={provMensal}
                  onChange={setProvMensal}
                  help="Pegue o último rendimento anunciado pelo FII."
                />
                <CurrencyInput
                  label="VPA (Valor patrimonial por cota)"
                  value={vpa}
                  onChange={setVpa}
                  help="Encontrado no informe mensal do fundo."
                />
              </>
            ) : (
              <>
                <CurrencyInput
                  label="Dividendos por ação (últimos 12 meses)"
                  value={dividendoAnual}
                  onChange={setDividendoAnual}
                  help="Some dividendos + JCP por ação no último ano."
                />
                <CurrencyInput
                  label="LPA (Lucro por ação, 12 meses)"
                  value={lpa}
                  onChange={setLpa}
                  help="Lucro líquido por ação. Usado para o P/L."
                />
              </>
            )}

            <CurrencyInput
              label="Seu preço médio (opcional)"
              value={precoMedio}
              onChange={setPrecoMedio}
              help="Se deixar zero, não calculo o Yield on Cost."
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={`rounded-2xl border p-6 shadow-sm ${veredictoBg}`}>
            <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
              Veredito para {ticker || "—"}
            </p>
            <p className="mt-1 text-2xl font-semibold sm:text-3xl">
              {veredito.label}
            </p>
            <p className="mt-1.5 text-sm opacity-90">{veredito.explicacao}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Indicador
              label={isFii ? "P/VP" : "P/L"}
              valor={
                isFii
                  ? pvp > 0
                    ? pvp.toFixed(2)
                    : "—"
                  : pl > 0
                  ? pl.toFixed(1)
                  : "—"
              }
              classific={cValor}
            />
            <Indicador
              label="Dividend Yield (a.a.)"
              valor={dyAnual > 0 ? percent(dyAnual) : "—"}
              classific={cDy}
            />
            <Indicador
              label="Yield on Cost (a.a.)"
              valor={yoc > 0 ? percent(yoc) : "—"}
              classific={cYoc}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Como ler</h3>
            <ul className="mt-3 space-y-2">
              {isFii ? (
                <>
                  <li>
                    <strong className="text-slate-900">P/VP &lt; 1</strong> —
                    você compra R$ 1 de patrimônio por menos de R$ 1. Pode ser
                    oportunidade ou armadilha.
                  </li>
                  <li>
                    <strong className="text-slate-900">
                      DY anualizado ≈ 9-11%
                    </strong>{" "}
                    — média do IFIX nos últimos anos. Muito acima, desconfie.
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <strong className="text-slate-900">P/L</strong> — quantos
                    anos de lucro você paga pelo preço de hoje. Quanto menor,
                    mais barata (mas investigue o porquê).
                  </li>
                  <li>
                    <strong className="text-slate-900">
                      DY anualizado ≈ 5-8%
                    </strong>{" "}
                    é uma boa pagadora na bolsa brasileira. Dividendos passados
                    não garantem os futuros.
                  </li>
                </>
              )}
              <li>
                <strong className="text-slate-900">Yield on Cost</strong> — o
                yield que você travou pelo preço médio que pagou. Quanto maior,
                melhor a sua compra.
              </li>
              {isFii ? (
                <li>
                  Provento mensal por cota é {brlPrecise(provMensal)} —
                  multiplique pelas suas cotas no{" "}
                  <a
                    href="/calendario"
                    className="font-semibold text-blue-700 hover:text-blue-800"
                  >
                    calendário
                  </a>{" "}
                  para projetar a renda.
                </li>
              ) : null}
            </ul>
          </div>

          <BrokerCta />
        </div>
      </div>
    </div>
  );
}

function Indicador({
  label,
  valor,
  classific,
}: {
  label: string;
  valor: string;
  classific: Classificacao;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
        {valor}
      </p>
      <div className="mt-2">
        <Badge c={classific} />
      </div>
      <p className="mt-2 text-xs text-slate-500">{classific.explicacao}</p>
    </div>
  );
}
