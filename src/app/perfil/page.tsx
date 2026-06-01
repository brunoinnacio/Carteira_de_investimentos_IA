import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FormPerfil } from "./FormPerfil";

export const metadata: Metadata = {
  title: "Meu perfil",
  description: "Atualize seu nome e veja os dados da sua conta.",
};

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar");

  const nomeInicial =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "";

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-2xl px-6 pt-6 pb-10 sm:pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Meu perfil
          </h1>
          <p className="mt-2 text-slate-600">
            Seus dados de conta. O nome aparece no menu lateral.
          </p>
        </div>

        <FormPerfil nomeInicial={nomeInicial} email={user.email ?? ""} />
      </section>
    </main>
  );
}
