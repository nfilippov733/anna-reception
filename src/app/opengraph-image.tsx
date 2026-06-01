import { ImageResponse } from "next/og";

export const alt = "ANNA Reception — your missed calls are now revenue";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded 1200×630 social card. Solid peach background (no transparency, so it
// never renders on a checkerboard), espresso headline, terracotta accents.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#faedeb",
          padding: "72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* soft terracotta accent */}
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -140,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "#e9624e",
            opacity: 0.16,
            display: "flex",
          }}
        />

        {/* brand mark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 16, height: 16, borderRadius: 9999, background: "#cc4a33", display: "flex" }} />
          <div style={{ fontSize: 30, fontWeight: 700, color: "#270e0b", marginLeft: 14 }}>Reception</div>
          <div style={{ fontSize: 26, color: "#9a6b62", marginLeft: 10 }}>by ANNA</div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              color: "#270e0b",
              lineHeight: 1.02,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            Your missed calls are now revenue.
          </div>
          <div style={{ fontSize: 30, color: "#5e4b47", marginTop: 26, maxWidth: 880, lineHeight: 1.3 }}>
            Answered, booked &amp; chased — across phone, WhatsApp, Instagram &amp; web.
          </div>
        </div>

        {/* footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 24, color: "#5e4b47", display: "flex" }}>24/7 · UK · 200+ integrations</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#cc4a33",
              color: "#ffffff",
              fontSize: 28,
              fontWeight: 700,
              padding: "14px 30px",
              borderRadius: 9999,
            }}
          >
            From £99/mo
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
