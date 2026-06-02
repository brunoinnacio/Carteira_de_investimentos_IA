import type { NextConfig } from "next";

const securityHeaders = [
  // Não deixa o site ser embutido em iframe de terceiros (anti-clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Impede o browser de "adivinhar" o tipo de conteúdo (anti-MIME-sniffing).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Não vaza a URL completa de origem ao navegar para outros sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restringe APIs sensíveis do navegador.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Força HTTPS por 2 anos (inclui subdomínios). Só tem efeito sob HTTPS.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
