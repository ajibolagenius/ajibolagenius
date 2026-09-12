"use client";

import { useEffect } from "react";
import { trackException } from "@/lib/analytics";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    trackException(error);
    console.error("Global uncaught error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          backgroundColor: "#fdfbf7",
          color: "#18181b",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(230, 67, 1, 0.1)",
              color: "#e64301",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", margin: 0 }}>
            Application Error
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#71717a",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            A critical error interrupted the application. Please try refreshing
            the page.
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                color: "#a1a1aa",
                margin: 0,
              }}
            >
              Digest: {error.digest}
            </p>
          )}
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                backgroundColor: "#18181b",
                color: "#fdfbf7",
                border: "none",
                padding: "10px 18px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                backgroundColor: "transparent",
                color: "#18181b",
                border: "1px solid rgba(24, 24, 27, 0.2)",
                padding: "10px 18px",
                fontSize: "14px",
                fontWeight: "500",
                textDecoration: "none",
                borderRadius: "4px",
              }}
            >
              Return home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
