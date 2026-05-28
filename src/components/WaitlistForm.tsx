"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { joinWaitlist, type WaitlistResult } from "@/app/actions/waitlist";

const initialState: WaitlistResult | null = null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 rounded-full bg-blue-600 px-6 text-base font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Enviando..." : "Quero entrar"}
    </button>
  );
}

export function WaitlistForm() {
  const [state, formAction] = useActionState(joinWaitlist, initialState);

  return (
    <div>
      <form
        action={formAction}
        className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="seu@email.com"
          className="h-12 flex-1 rounded-full border border-slate-700 bg-slate-900 px-5 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500"
        />
        <SubmitButton />
      </form>

      {state ? (
        <p
          role="status"
          className={`mt-4 text-sm ${
            state.ok ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {state.message}
        </p>
      ) : (
        <p className="mt-3 text-xs text-slate-500">
          Em breve. Sem spam — você só recebe quando tiver algo novo
          funcionando.
        </p>
      )}
    </div>
  );
}
