import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/AuthCard";
import { FormEntrar } from "./FormEntrar";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta no Renda-se.",
};

type PageProps = {
  searchParams: Promise<{ erro?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/carteira");

  const sp = await searchParams;
  const erroInicial = sp.erro ?? null;

  return (
    <AuthCard
      title="Entrar"
      subtitle="Acesse sua conta para salvar sua carteira na nuvem."
      footer={
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600 shadow-sm">
          Ainda não tem conta?{" "}
          <Link
            href="/cadastro"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Cadastre-se grátis
          </Link>
        </div>
      }
    >
      <FormEntrar erroInicial={erroInicial} />
    </AuthCard>
  );
}
