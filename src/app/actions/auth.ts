"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function origemDaRequisicao(): Promise<string> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export async function entrar(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!emailValido(email)) {
    return { ok: false, message: "Informe um email válido." };
  }
  if (!password) {
    return { ok: false, message: "Informe sua senha." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      ok: false,
      message:
        error.message === "Invalid login credentials"
          ? "Email ou senha incorretos."
          : "Não foi possível entrar agora. Tente novamente.",
    };
  }

  redirect("/carteira");
}

export async function cadastrar(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const password2 = String(formData.get("password2") ?? "");

  if (!emailValido(email)) {
    return { ok: false, message: "Informe um email válido." };
  }
  if (password.length < 8) {
    return { ok: false, message: "A senha precisa ter ao menos 8 caracteres." };
  }
  if (password !== password2) {
    return { ok: false, message: "As senhas não coincidem." };
  }

  const origin = await origemDaRequisicao();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/carteira`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("registered")) {
      return {
        ok: false,
        message:
          "Esse email já está cadastrado. Tente entrar ou recuperar a senha.",
      };
    }
    return {
      ok: false,
      message: "Não foi possível cadastrar agora. Tente novamente.",
    };
  }

  return {
    ok: true,
    message:
      "Cadastro feito! Acesse seu email para confirmar a conta antes de entrar.",
  };
}

export async function sair() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function esqueciSenha(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!emailValido(email)) {
    return { ok: false, message: "Informe um email válido." };
  }

  const origin = await origemDaRequisicao();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/redefinir-senha`,
  });

  if (error) {
    return {
      ok: false,
      message: "Não foi possível enviar o email agora. Tente novamente.",
    };
  }

  return {
    ok: true,
    message:
      "Se esse email existir na base, em alguns minutos chega um link para redefinir a senha.",
  };
}

export async function redefinirSenha(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const password = String(formData.get("password") ?? "");
  const password2 = String(formData.get("password2") ?? "");

  if (password.length < 8) {
    return { ok: false, message: "A senha precisa ter ao menos 8 caracteres." };
  }
  if (password !== password2) {
    return { ok: false, message: "As senhas não coincidem." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      ok: false,
      message:
        "Não foi possível redefinir a senha. O link pode ter expirado — peça um novo.",
    };
  }

  redirect("/carteira");
}
