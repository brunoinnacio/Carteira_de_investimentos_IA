"use client";

export function IntegerInput({
  label,
  value,
  onChange,
  help,
  placeholder,
  error,
  max,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  help?: string;
  placeholder?: string;
  error?: string;
  max?: number;
}) {
  const display = value > 0 ? String(Math.floor(value)) : "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits) {
      onChange(0);
      return;
    }
    let n = parseInt(digits, 10);
    if (!Number.isFinite(n)) n = 0;
    if (typeof max === "number" && n > max) n = max;
    onChange(n);
  }

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={display}
        placeholder={placeholder ?? "0"}
        aria-invalid={error ? true : undefined}
        onFocus={(e) => e.currentTarget.select()}
        onChange={handleChange}
        className={`h-[42px] rounded-lg border bg-white px-3 text-base text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:ring-2 ${
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
