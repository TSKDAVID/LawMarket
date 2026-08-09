import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

const ESPRESSO = "#1c1210";
const CREAM = "#f6efe3";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ESPRESSO,
          borderRadius: 14,
        }}
      >
        <div style={{ position: "relative", width: 40, height: 40, display: "flex" }}>
          <div
            style={{
              position: "absolute",
              left: 11.2,
              top: 4.8,
              width: 10.4,
              height: 2.8,
              background: CREAM,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 14,
              top: 6.8,
              width: 5.6,
              height: 25.6,
              background: CREAM,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 14,
              top: 31.6,
              width: 16.8,
              height: 3.6,
              background: CREAM,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
