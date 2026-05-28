"use client";

function formatCurrencyBR(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function digitsToValue(digits: string): number {
  const cleaned = digits.replace(/\D/g, "");
  if (!cleaned) return 0;
  const cents = parseInt(cleaned, 10);
  return cents / 100;
}

export function CurrencyInput({
  label,
  value,
  onChange,
  help,
  placeholder,
  error,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  help?: string;
  placeholder?: string;
  error?: string;
}) {
  const display = formatCurrencyBR(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = digitsToValue(e.target.value);
    onChange(next);
  }

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div
        className={`flex items-stretch rounded-lg border bg-white shadow-sm focus-within:ring-2 ${
          error
            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
            : "border-slate-300 focus-within:border-blue-600 focus-within:ring-blue-100"
        }`}
      >
        <span className="flex items-center px-3 text-sm font-medium text-slate-500">
          R$
        </span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={display}
          placeholder={placeholder ?? "0,00"}
          aria-invalid={error ? true : undefined}
          onChange={handleChange}
          className="flex-1 bg-transparent px-2 py-2.5 text-base text-slate-900 outline-none"
        />
      </div>
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
