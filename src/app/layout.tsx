import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteSidebar } from "@/components/SiteSidebar";
import { SiteFooter } from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FII Brasil · Calculadoras e Radar de Fundos Imobiliários",
  description:
    "Aprenda a viver de renda passiva com Fundos Imobiliários (FIIs). Calculadoras, calendário de proventos e radar de oportunidades. Grátis.",
  keywords: [
    "FII",
    "fundos imobiliários",
    "renda passiva",
    "investimentos",
    "dividendos",
    "calculadora FII",
  ],
  authors: [{ name: "Bruno Inácio" }],
  openGraph: {
    title: "FII Brasil · Calculadoras e Radar de Fundos Imobiliários",
    description:
      "Aprenda a viver de renda passiva com FIIs. Calculadoras, calendário de proventos e radar de oportunidades.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900">
        <SiteSidebar />
        <div className="flex min-h-screen flex-col lg:ml-64">
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
