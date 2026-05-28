"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { entrar, type AuthResult } from "@/app/actions/auth";
import { PasswordInput } from "@/components/PasswordInput";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 w-full rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}

export function FormEntrar({ erroInicial }: { erroInicial: string | null }) {
  const [state, formAction] = useActionState<AuthResult | null, FormData>(
    entrar,
    erroInicial ? { ok: false, message: erroInicial } : null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <PasswordInput
        name="password"
        label="Senha"
        autoComplete="current-password"
        required
      />

      <div className="-mt-1 flex justify-end">
        <Link
          href="/esqueci-senha"
          className="text-xs font-medium text-blue-700 hover:text-blue-800"
        >
          Esqueci minha senha
        </Link>
      </div>

      {state && !state.ok ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.message}
        </p>
      ) : null}

      <Submit />
    </form>
  );
}
