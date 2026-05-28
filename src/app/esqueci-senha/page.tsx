import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { FormEsqueciSenha } from "./FormEsqueciSenha";

export const metadata: Metadata = {
  title: "Esqueci minha senha · FII Brasil",
  description: "Receba um link por email para redefinir sua senha.",
};

export default function Page() {
  return (
    <AuthCard
      title="Esqueci minha senha"
      subtitle="Digite seu email e enviamos um link para redefinir a senha."
      footer={
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600 shadow-sm">
          Lembrou da senha?{" "}
          <Link
            href="/entrar"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Entrar
          </Link>
        </div>
      }
    >
      <FormEsqueciSenha />
    </AuthCard>
  );
}
