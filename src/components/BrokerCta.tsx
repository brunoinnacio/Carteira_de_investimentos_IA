"use client";

import { useEffect, useState } from "react";

type Broker = {
  id: string;
  name: string;
  url: string;
  perfil: string;
};

const BROKERS: Broker[] = [
  {
    id: "nuinvest",
    name: "NuInvest",
    url: "https://nuinvest.com.br/",
    perfil: "Ideal para iniciantes · taxa zero",
  },
  {
    id: "rico",
    name: "Rico",
    url: "https://www.rico.com.vc/",
    perfil: "Plataforma popular · corretagem zero",
  },
  {
    id: "btg",
    name: "BTG Pactual",
    url: "https://www.btgpactual.com/investimentos",
    perfil: "Banco de investimento · ampla oferta de FIIs",
  },
  {
    id: "xp",
    name: "XP Investimentos",
    url: "https://www.xpi.com.br/abra-sua-conta/",
    perfil: "Maior plataforma do Brasil · relatórios próprios",
  },
  {
    id: "clear",
    name: "Clear",
    url: "https://www.clear.com.br/",
    perfil: "Corretagem zero · interface enxuta",
  },
  {
    id: "inter",
    name: "Banco Inter",
    url: "https://www.bancointer.com.br/investimentos/",
    perfil: "Tudo no app de banco · FIIs com taxa zero",
  },
];

const AFFILIATE_URL = process.env.NEXT_PUBLIC_AFFILIATE_URL ?? "";
const AFFILIATE_LABEL =
  process.env.NEXT_PUBLIC_AFFILIATE_LABEL ?? "Abrir conta na corretora";

function BrokerModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="broker-modal-title"
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <div className="mb-1 flex items-start justify-between gap-4">
          <div>
            <h2
              id="broker-modal-title"
              className="text-xl font-semibold text-slate-900"
            >
              Escolha uma corretora
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Você precisa de conta em corretora para comprar FIIs. Todas as
              opções abaixo permitem comprar FII com corretagem zero.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fechar"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <ul className="mt-5 grid gap-2">
          {BROKERS.map((b) => (
            <li key={b.id}>
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-blue-500 hover:bg-blue-50"
              >
                <div>
                  <p className="font-semibold text-slate-900">{b.name}</p>
                  <p className="text-xs text-slate-500">{b.perfil}</p>
                </div>
                <span className="text-sm font-semibold text-blue-700">
                  Abrir →
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs text-slate-500">
          Os links abrem o site oficial de cada corretora em uma nova aba.
          Nenhum dado seu é compartilhado.
        </p>
      </div>
    </div>
  );
}

function BrokerButton({
  variant,
  onClick,
}: {
  variant: "card" | "inline";
  onClick: () => void;
}) {
  const baseClasses =
    variant === "inline"
      ? "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
      : "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700";

  if (AFFILIATE_URL) {
    return (
      <a
        href={AFFILIATE_URL}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={baseClasses}
      >
        {AFFILIATE_LABEL} →
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {AFFILIATE_LABEL} →
    </button>
  );
}

export function BrokerCta({
  variant = "card",
}: {
  variant?: "card" | "inline";
}) {
  const [open, setOpen] = useState(false);

  if (variant === "inline") {
    return (
      <>
        <BrokerButton variant="inline" onClick={() => setOpen(true)} />
        {open ? <BrokerModal onClose={() => setOpen(false)} /> : null}
      </>
    );
  }

  return (
    <>
      <aside className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
          Próximo passo
        </p>
        <h3 className="mt-1.5 text-base font-semibold text-blue-900">
          Pronto para começar a investir em FIIs?
        </h3>
        <p className="mt-1.5 text-sm text-blue-900/80">
          Você precisa de uma conta em corretora para comprar FIIs. Escolha
          entre as principais do Brasil — todas com corretagem zero.
        </p>
        <div className="mt-4">
          <BrokerButton variant="card" onClick={() => setOpen(true)} />
        </div>
      </aside>
      {open ? <BrokerModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}
