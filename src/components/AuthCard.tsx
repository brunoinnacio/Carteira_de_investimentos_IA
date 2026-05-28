import Link from "next/link";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="flex-1">
      <section className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 pt-10 pb-10 sm:pt-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 self-start text-sm font-medium text-slate-500 hover:text-blue-700"
        >
          ← Voltar para o site
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1.5 text-sm text-slate-600">{subtitle}</p>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>
        {footer}
      </section>
    </main>
  );
}
