"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { redefinirSenha, type AuthResult } from "@/app/actions/auth";
import { PasswordInput } from "@/components/PasswordInput";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 w-full rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Salvar nova senha"}
    </button>
  );
}

export function FormRedefinirSenha() {
  const [state, formAction] = useActionState<AuthResult | null, FormData>(
    redefinirSenha,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <PasswordInput
        name="password"
        label="Nova senha"
        autoComplete="new-password"
        required
        minLength={8}
      />
      <PasswordInput
        name="password2"
        label="Confirme a nova senha"
        autoComplete="new-password"
        required
        minLength={8}
      />

      <p className="text-xs text-slate-500">Mínimo de 8 caracteres.</p>

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
