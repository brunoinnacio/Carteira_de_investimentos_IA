import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_SHORT, SITE_URL } from "@/lib/site";

export const alt = `${SITE_NAME} · Aprenda a investir do zero`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HOST = SITE_URL.replace(/^https?:\/\//, "");

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
            {SITE_SHORT}
          </div>
          <div
            style={{
              color: "#93c5fd",
              fontSize: "30px",
              fontWeight: 600,
              letterSpacing: "2px",
            }}
          >
            {SITE_NAME.toUpperCase()}
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
            Aprenda a investir do zero, sem economês
          </div>
          <div
            style={{
              color: "#cbd5e1",
              fontSize: "30px",
              maxWidth: "920px",
            }}
          >
            FIIs, ações, renda fixa e mais — com calculadoras, guias e
            linguagem simples. Grátis.
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
          <span>{HOST}</span>
        </div>
      </div>
    ),
    size
  );
}
