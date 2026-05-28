"use client";

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  prefix,
  help,
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
}) {
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
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            onChange(Number.isFinite(parsed) ? parsed : 0);
          }}
          className="flex-1 bg-transparent px-3 py-2.5 text-base text-slate-900 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
