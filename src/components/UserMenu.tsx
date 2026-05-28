"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { sair } from "@/app/actions/auth";

type UserLite = { id: string; email: string | null };

export function UserMenu() {
  const [user, setUser] = useState<UserLite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ? { id: data.user.id, email: data.user.email ?? null } : null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(
        session?.user
          ? { id: session.user.id, email: session.user.email ?? null }
          : null
      );
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg bg-white/5 px-3 py-3 text-xs text-slate-400">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="grid gap-2">
        <Link
          href="/entrar"
          className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
        >
          Entrar
        </Link>
        <Link
          href="/cadastro"
          className="rounded-lg border border-white/20 px-3 py-2 text-center text-sm font-medium text-slate-100 transition hover:bg-white/10"
        >
          Criar conta grátis
        </Link>
      </div>
    );
  }

  const inicial = (user.email ?? "?").slice(0, 1).toUpperCase();

  return (
    <div className="rounded-lg bg-white/5 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {inicial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {user.email ?? "Conectado"}
          </p>
          <p className="text-[11px] uppercase tracking-wider text-slate-400">
            Conta ativa
          </p>
        </div>
      </div>
      <form action={sair}>
        <button
          type="submit"
          className="mt-3 w-full rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10"
        >
          Sair
        </button>
      </form>
    </div>
  );
}
