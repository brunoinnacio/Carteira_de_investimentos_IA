"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { joinWaitlist, type WaitlistResult } from "@/app/actions/waitlist";

const initialState: WaitlistResult | null = null;

function SubmitButton({ cta }: { cta?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Enviando..." : cta ?? "Quero entrar"}
    </button>
  );
}

export function WaitlistForm({
  source,
  cta,
}: {
  source?: string;
  cta?: string;
}) {
  const [state, formAction] = useActionState(joinWaitlist, initialState);

  return (
    <div>
      <form
        action={formAction}
        className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
      >
        {source ? <input type="hidden" name="source" value={source} /> : null}
        <input
          type="email"
          name="email"
          required
          placeholder="seu@email.com"
          className="h-11 flex-1 rounded-lg border border-slate-300 bg-white px-4 text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
        <SubmitButton cta={cta} />
      </form>

      {state ? (
        <p
          role="status"
          className={`mt-4 text-sm ${
            state.ok ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {state.message}
        </p>
      ) : (
        <p className="mt-3 text-xs text-slate-500">
          Lista de espera — você não recebe nenhum email automático agora.
          Será avisado por aqui quando o sistema estiver pronto.
        </p>
      )}
    </div>
  );
}
