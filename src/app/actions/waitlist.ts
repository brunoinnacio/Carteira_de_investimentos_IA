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
  const rawSource = formData.get("source");
  const source =
    typeof rawSource === "string" && rawSource.trim()
      ? rawSource.trim().slice(0, 40)
      : "landing";

  if (!email) {
    return { ok: false, message: "Informe um email para continuar." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, message: "Esse email nao parece valido." };
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin
    .from("waitlist")
    .insert({ email, source });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: true,
        message:
          "Você já estava na lista. Sem email automático — vou avisar por aqui quando o sistema for lançado.",
      };
    }
    console.error("[waitlist] erro:", error);
    return {
      ok: false,
      message: "Não deu para registrar agora. Tenta de novo em instantes.",
    };
  }

  return {
    ok: true,
    message:
      "Pronto! Você está na lista. Nenhum email é enviado agora — só quando o sistema estiver no ar.",
  };
}
