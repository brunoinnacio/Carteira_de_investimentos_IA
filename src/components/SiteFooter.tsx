import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} {SITE_NAME} · feito por Bruno Inácio
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link
            href="/guias"
            className="hover:text-slate-700 hover:underline"
          >
            Guias
          </Link>
          <Link
            href="/glossario"
            className="hover:text-slate-700 hover:underline"
          >
            Glossário
          </Link>
          <Link
            href="/aviso-legal"
            className="hover:text-slate-700 hover:underline"
          >
            Aviso legal
          </Link>
          <span className="text-slate-400">
            Conteúdo educacional · não é recomendação de investimento
          </span>
        </div>
      </div>
    </footer>
  );
}
