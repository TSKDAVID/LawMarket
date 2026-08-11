"use client";

import { errorStrings } from "@/locales/error-strings";

/**
 * Catastrophic failure boundary — renders its own document, bilingual
 * (the locale segment itself has failed), typeset as a clause.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="ka">
      <body
        style={{
          margin: 0,
          background: "#f6efe3",
          color: "#1c1210",
          fontFamily: "Georgia, serif",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "96px 24px" }}>
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "#453a36",
            }}
          >
            § 500 — LAWMARKET
          </p>
          <h1 style={{ fontSize: 40, lineHeight: 1.15, fontWeight: 400, margin: "20px 0 0" }}>
            {errorStrings.ka.title}
          </h1>
          <p style={{ color: "#453a36", margin: "16px 0 0" }}>{errorStrings.ka.body}</p>
          <p style={{ color: "#453a36", margin: "8px 0 0" }}>{errorStrings.en.body}</p>
          <hr
            style={{
              border: 0,
              borderTop: "1px solid #1c1210",
              margin: "40px 0",
              maxWidth: 416,
            }}
          />
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#6b1423",
              color: "#f6efe3",
              border: 0,
              borderRadius: 0,
              padding: "14px 28px",
              fontSize: 15,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            {errorStrings.ka.retry} / {errorStrings.en.retry}
          </button>
        </div>
      </body>
    </html>
  );
}
