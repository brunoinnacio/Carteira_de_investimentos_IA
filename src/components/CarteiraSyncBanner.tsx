"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Estado =
  | { status: "carregando" }
  | { status: "anonimo" }
  | { status: "logado"; email: string | null };

export function CarteiraSyncBanner() {
  const [estado, setEstado] = useState<Estado>({ status: "carregando" });

  useEffect(() => {
    let mounted = true;
    let unsub = () => {};

    try {
      const supabase = createSupabaseBrowserClient();

      supabase.auth.getUser().then(({ data }) => {
        if (!mounted) return;
        setEstado(
          data.user
            ? { status: "logado", email: data.user.email ?? null }
            : { status: "anonimo" }
        );
      });

      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        if (!mounted) return;
        setEstado(
          session?.user
            ? { status: "logado", email: session.user.email ?? null }
            : { status: "anonimo" }
        );
      });
      unsub = () => sub.subscription.unsubscribe();
    } catch {
      setEstado({ status: "anonimo" });
    }

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  if (estado.status === "carregando") return null;

  if (estado.status === "logado") {
    return (
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0 text-emerald-600"
          aria-hidden
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <p className="text-sm text-emerald-900">
          <span className="font-semibold">Carteira sincronizada na sua conta.</span>{" "}
          {estado.email ? `(${estado.email}) ` : ""}Você pode acessar de
          qualquer aparelho — os dados ficam salvos na nuvem.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0 text-slate-400"
        aria-hidden
      >
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <p>
        Usando <span className="font-medium text-slate-800">sem conta</span> — a
        carteira fica salva só neste navegador.{" "}
        <Link
          href="/cadastro"
          className="font-semibold text-blue-700 underline-offset-2 hover:underline"
        >
          Criar conta grátis
        </Link>{" "}
        para sincronizar e acessar de qualquer lugar.
      </p>
    </div>
  );
}
