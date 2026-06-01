"use client";

export const TICKER_REGEX = /^[A-Z]{4}11$/;

export function isValidTicker(value: string): boolean {
  return TICKER_REGEX.test(value);
}

// Acoes/units/BDRs: 4 letras + 1 ou 2 digitos (PETR4, TAEE11, AAPL34).
export function isValidTickerAcao(value: string): boolean {
  return /^[A-Z]{4}\d{1,2}$/.test(value);
}

export function TickerInput({
  label,
  value,
  onChange,
  onBlur,
  error,
  help,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  onBlur?: () => void;
  error?: string;
  help?: string;
}) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleaned = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);
    onChange(cleaned);
  }

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        placeholder="XXXX11"
        maxLength={6}
        autoCapitalize="characters"
        spellCheck={false}
        aria-invalid={error ? true : undefined}
        onChange={handleChange}
        onBlur={onBlur}
        className={`h-[42px] rounded-lg border bg-white px-3 text-base font-semibold uppercase tracking-wide text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
            : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
        }`}
      />
      {error ? (
        <span role="alert" className="text-xs font-medium text-red-600">
          {error}
        </span>
      ) : help ? (
        <span className="text-xs text-slate-500">{help}</span>
      ) : null}
    </label>
  );
}
