import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "codeskills.tech — AI Coding Skills en Español";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#08080a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <span style={{ fontSize: "64px" }}>⚡</span>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#e4e4e7",
            }}
          >
            code
            <span style={{ color: "#f59e0b" }}>skills</span>
            <span style={{ color: "#71717a" }}>.tech</span>
          </span>
        </div>
        <p
          style={{
            fontSize: "24px",
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          AI Coding Skills en Español para devs LATAM
        </p>
      </div>
    ),
    { ...size }
  );
}
