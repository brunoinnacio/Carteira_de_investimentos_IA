import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/AuthCard";
import { FormRedefinirSenha } from "./FormRedefinirSenha";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Redefinir senha · FII Brasil",
  description: "Defina uma nova senha para sua conta.",
};

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect(
      "/entrar?erro=" +
        encodeURIComponent(
          "Abra esta página pelo link enviado por email para redefinir a senha."
        )
    );
  }

  return (
    <AuthCard
      title="Definir nova senha"
      subtitle={`Logado como ${data.user.email}. Escolha uma nova senha.`}
    >
      <FormRedefinirSenha />
    </AuthCard>
  );
}
