"use client";

import { useState } from "react";

export function PasswordInput({
  name,
  label,
  placeholder,
  autoComplete,
  required,
  minLength,
}: {
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-stretch rounded-lg border border-slate-300 bg-white shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
        <input
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder ?? "••••••••"}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          className="flex-1 bg-transparent px-3 py-2.5 text-base text-slate-900 outline-none"
        />
        <button
          type="button"
          aria-label={show ? "Esconder senha" : "Mostrar senha"}
          aria-pressed={show}
          onClick={() => setShow((s) => !s)}
          className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-blue-700"
        >
          {show ? "Esconder" : "Mostrar"}
        </button>
      </div>
    </label>
  );
}
