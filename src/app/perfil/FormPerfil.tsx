"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { atualizarPerfil, type AuthResult } from "@/app/actions/auth";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Salvar"}
    </button>
  );
}

export function FormPerfil({
  nomeInicial,
  email,
}: {
  nomeInicial: string;
  email: string;
}) {
  const [state, formAction] = useActionState<AuthResult | null, FormData>(
    atualizarPerfil,
    null
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">Nome</span>
        <input
          name="nome"
          type="text"
          required
          minLength={2}
          autoComplete="name"
          defaultValue={nomeInicial}
          placeholder="Como podemos te chamar?"
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
        <span className="text-xs text-slate-400">
          Aparece no menu e nas suas saudações pelo site.
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">Email</span>
        <input
          type="email"
          value={email}
          disabled
          className="h-11 cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 text-base text-slate-500 shadow-sm"
        />
        <span className="text-xs text-slate-400">
          O email da conta não pode ser alterado por aqui.
        </span>
      </label>

      {state ? (
        <p
          role="alert"
          className={`rounded-lg border px-3 py-2 text-sm ${
            state.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <div>
        <Submit />
      </div>
    </form>
  );
}
