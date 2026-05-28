"use server";

import { getSupabaseAdmin } from "@/lib/supabase";

export type WaitlistResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function joinWaitlist(
  _prevState: WaitlistResult | null,
  formData: FormData
): Promise<WaitlistResult> {
  const rawEmail = formData.get("email");
  const email =
    typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

  if (!email) {
    return { ok: false, message: "Informe um email para continuar." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, message: "Esse email nao parece valido." };
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin
    .from("waitlist")
    .insert({ email, source: "landing" });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: true,
        message: "Voce ja esta na lista — vou avisar quando lancar.",
      };
    }
    console.error("[waitlist] erro:", error);
    return {
      ok: false,
      message: "Nao deu para registrar agora. Tenta de novo em instantes.",
    };
  }

  return {
    ok: true,
    message: "Pronto! Voce esta na lista. Te aviso assim que lancar.",
  };
}
