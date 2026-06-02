"use client";

import { useState } from "react";

// Mantem apenas digitos e uma virgula decimal (aceita ponto e converte).
function sanitize(raw: string): string {
  let s = raw.replace(/[^\d.,]/g, "").replace(/\./g, ",");
  const i = s.indexOf(",");
  if (i !== -1) {
    s = s.slice(0, i + 1) + s.slice(i + 1).replace(/,/g, "");
  }
  return s;
}

function parse(s: string): number {
  if (!s || s === ",") return 0;
  const n = parseFloat(s.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

// 0 vira string vazia (mostra o placeholder) — evita o "0" preso na tela.
function format(value: number): string {
  if (!Number.isFinite(value) || value === 0) return "";
  return String(value).replace(".", ",");
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
  prefix,
  help,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  prefix?: string;
  help?: string;
  placeholder?: string;
}) {
  // Buffer de edicao: enquanto o campo esta focado, respeitamos o texto
  // digitado (permite virgula, apagar tudo etc.) e ressincronizamos no blur.
  const [buffer, setBuffer] = useState<string | null>(null);
  const display = buffer ?? format(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const s = sanitize(e.target.value);
    let n = parse(s);
    if (typeof max === "number" && n > max) {
      n = max;
      setBuffer(format(n));
    } else {
      setBuffer(s);
    }
    onChange(n);
  }

  function handleBlur() {
    if (typeof min === "number" && value !== 0 && value < min) {
      onChange(min);
    }
    setBuffer(null);
  }

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-stretch rounded-lg border border-slate-300 bg-white shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
        {prefix ? (
          <span className="flex items-center px-3 text-sm font-medium text-slate-500">
            {prefix}
          </span>
        ) : null}
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={display}
          placeholder={placeholder ?? "0"}
          onFocus={(e) => e.currentTarget.select()}
          onChange={handleChange}
          onBlur={handleBlur}
          className="flex-1 bg-transparent px-3 py-2.5 text-base text-slate-900 placeholder-slate-400 outline-none"
        />
        {suffix ? (
          <span className="flex items-center px-3 text-sm font-medium text-slate-500">
            {suffix}
          </span>
        ) : null}
      </div>
      {help ? <span className="text-xs text-slate-500">{help}</span> : null}
    </label>
  );
}
