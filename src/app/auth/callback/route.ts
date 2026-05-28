import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/carteira";
  const errorDesc = url.searchParams.get("error_description");

  if (errorDesc) {
    return NextResponse.redirect(
      new URL(`/entrar?erro=${encodeURIComponent(errorDesc)}`, url.origin)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/entrar", url.origin));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(
        `/entrar?erro=${encodeURIComponent(
          "Link expirado ou inválido. Tente novamente."
        )}`,
        url.origin
      )
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
