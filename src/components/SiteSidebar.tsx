"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserMenu } from "@/components/UserMenu";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  group: "Início" | "Calculadoras" | "Carteira" | "Aprender";
};

const items: NavItem[] = [
  {
    href: "/",
    label: "Início",
    group: "Início",
    icon: <path d="M3 12 12 3l9 9M5 10v10h5v-6h4v6h5V10" />,
  },
  {
    href: "/calculadora-renda",
    label: "Quanto investir",
    group: "Calculadoras",
    icon: <path d="M9 2h6v4H9zM5 6h14v16H5zM8 11h8M8 15h8M8 19h5" />,
  },
  {
    href: "/bola-de-neve",
    label: "Bola de neve",
    group: "Calculadoras",
    icon: <path d="M3 17 9 11l4 4 8-8M14 7h7v7" />,
  },
  {
    href: "/aluguel-vs-fii",
    label: "Aluguel vs FII",
    group: "Calculadoras",
    icon: <path d="M3 12 12 3l9 9M5 10v10h14V10M9 20v-5h6v5" />,
  },
  {
    href: "/radar",
    label: "Radar",
    group: "Calculadoras",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" />
      </>
    ),
  },
  {
    href: "/calendario",
    label: "Calendário",
    group: "Carteira",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 3v4M16 3v4" />
      </>
    ),
  },
  {
    href: "/carteira",
    label: "Minha carteira",
    group: "Carteira",
    icon: (
      <>
        <path d="M3 7h18v12H3z" />
        <path d="M3 7V5a2 2 0 0 1 2-2h10l2 4" />
        <circle cx="17" cy="13" r="1.5" />
      </>
    ),
  },
  {
    href: "/importacao",
    label: "Importar B3",
    group: "Carteira",
    icon: <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />,
  },
  {
    href: "/glossario",
    label: "Glossário",
    group: "Aprender",
    icon: (
      <>
        <path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z" />
        <path d="M4 17a3 3 0 0 1 3-3h12" />
        <path d="M9 8h6M9 12h4" />
      </>
    ),
  },
];

const groups: Array<NavItem["group"]> = [
  "Início",
  "Calculadoras",
  "Carteira",
  "Aprender",
];

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        active
          ? "bg-white/10 font-semibold text-white"
          : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
      }`}
    >
      {active ? (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-blue-400" />
      ) : null}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-[18px] w-[18px] shrink-0 ${
          active ? "text-blue-300" : "text-slate-500 group-hover:text-slate-300"
        }`}
        aria-hidden
      >
        {item.icon}
      </svg>
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function NavContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-[var(--color-navy)] text-slate-100">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-6 py-5"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-sm">
          FII
        </span>
        <div className="leading-tight">
          <p className="text-base font-semibold text-white">FII Brasil</p>
          <p className="text-[11px] uppercase tracking-wider text-slate-400">
            Renda passiva
          </p>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {groups.map((g) => (
          <div key={g} className="mb-4">
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {g}
            </p>
            <div className="flex flex-col gap-0.5">
              {items
                .filter((i) => i.group === g)
                .map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={pathname === item.href}
                    onClick={onNavigate}
                  />
                ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-3 pt-4 pb-20 lg:pb-24">
        <UserMenu />
      </div>
    </div>
  );
}

export function SiteSidebar() {
  const pathname = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <NavContent pathname={pathname} />
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
            FII
          </span>
          <span className="text-base font-semibold text-slate-900">
            FII Brasil
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
          aria-label="Abrir menu"
          aria-expanded={mobileOpen}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col shadow-2xl">
            <div className="flex items-center justify-end bg-[var(--color-navy)] px-3 pt-3">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10"
                aria-label="Fechar menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <NavContent
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
