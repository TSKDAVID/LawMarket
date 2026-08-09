import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Law Market — Legal help in Georgia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ESPRESSO = "#1c1210";
const CREAM = "#f6efe3";
const BURGUNDY = "#6b1423";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: ESPRESSO,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative", width: 56, height: 56, display: "flex" }}>
            <div
              style={{
                position: "absolute",
                left: 15,
                top: 7,
                width: 14,
                height: 4,
                background: CREAM,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 19,
                top: 10,
                width: 8,
                height: 36,
                background: CREAM,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 19,
                top: 44,
                width: 24,
                height: 5,
                background: CREAM,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 52,
              fontWeight: 600,
              color: CREAM,
              letterSpacing: "-0.02em",
            }}
          >
            aw Market
          </span>
        </div>
        <p
          style={{
            marginTop: 32,
            fontSize: 28,
            color: "rgba(246,239,227,0.55)",
            maxWidth: 600,
            lineHeight: 1.4,
          }}
        >
          Fixed-price legal services from verified lawyers in Georgia.
        </p>
        <div
          style={{
            marginTop: 48,
            width: 48,
            height: 3,
            background: BURGUNDY,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
