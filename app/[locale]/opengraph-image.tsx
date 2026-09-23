import { ImageResponse } from "next/og";

export const alt = "Dr. Ahmed Soliman — Consultant Orthopaedic & Sports Medicine Surgeon";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded social card (brand gradient + glass panel). */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 80% 10%, #48A4A4 0%, #104848 45%, #031111 100%)",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            padding: "64px 96px",
            borderRadius: 48,
            border: "2px solid rgba(255,255,255,0.35)",
            background: "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
            boxShadow: "0 40px 80px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ fontSize: 30, letterSpacing: 8, color: "#c9ecea", textTransform: "uppercase" }}>
            Orthopaedics · Sports Medicine
          </div>
          <div style={{ fontSize: 96, color: "white", fontWeight: 600 }}>Dr. Ahmed Soliman</div>
          <div style={{ width: 160, height: 3, background: "#8fd3d1" }} />
          <div style={{ fontSize: 34, color: "rgba(234,246,245,0.85)" }}>Surgical precision · Freedom of movement</div>
        </div>
      </div>
    ),
    size,
  );
}
