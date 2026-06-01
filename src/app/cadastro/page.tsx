import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/AuthCard";
import { FormCadastro } from "./FormCadastro";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta gratuita na Bolsa Cheia.",
};

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/carteira");

  return (
    <AuthCard
      title="Criar conta grátis"
      subtitle="Acesse de qualquer dispositivo e mantenha sua carteira sincronizada."
      footer={
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600 shadow-sm">
          Já tem conta?{" "}
          <Link
            href="/entrar"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Entrar
          </Link>
        </div>
      }
    >
      <FormCadastro />
    </AuthCard>
  );
}
