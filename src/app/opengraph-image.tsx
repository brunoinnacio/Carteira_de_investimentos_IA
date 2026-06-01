import { ImageResponse } from "next/og";

export const alt =
  "FII Brasil · Calculadoras e Radar de Fundos Imobiliários";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0b1426",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            FII
          </div>
          <div
            style={{
              color: "#93c5fd",
              fontSize: "30px",
              fontWeight: 600,
              letterSpacing: "2px",
            }}
          >
            FII BRASIL
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: "62px",
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: "1000px",
            }}
          >
            Viva de renda com Fundos Imobiliários
          </div>
          <div
            style={{
              color: "#cbd5e1",
              fontSize: "30px",
              maxWidth: "920px",
            }}
          >
            Calculadoras, radar de oportunidades, calendário de proventos e
            glossário. Grátis e sem cadastro.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            color: "#93c5fd",
            fontSize: "24px",
          }}
        >
          <span>fiibrasil.vercel.app</span>
        </div>
      </div>
    ),
    size
  );
}
