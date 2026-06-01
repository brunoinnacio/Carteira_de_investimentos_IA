"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function primeiroNome(u: { user_metadata?: Record<string, unknown> } | null): string | null {
  const full =
    typeof u?.user_metadata?.full_name === "string"
      ? (u.user_metadata.full_name as string).trim()
      : "";
  if (!full) return null;
  return full.split(/\s+/)[0];
}

export function SaudacaoInicio() {
  const [nome, setNome] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let unsub = () => {};
    try {
      const supabase = createSupabaseBrowserClient();
      supabase.auth.getUser().then(({ data }) => {
        if (mounted) setNome(primeiroNome(data.user));
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        if (mounted) setNome(primeiroNome(session?.user ?? null));
      });
      unsub = () => sub.subscription.unsubscribe();
    } catch {
      /* ignore */
    }
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  if (!nome) return null;

  return (
    <p className="text-base font-medium text-blue-700">
      Olá, {nome} <span aria-hidden>👋</span>
    </p>
  );
}
