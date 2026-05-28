export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} FII Brasil · feito por Bruno Inácio
        </p>
        <p>Conteúdo educacional · não é recomendação de investimento</p>
      </div>
    </footer>
  );
}
