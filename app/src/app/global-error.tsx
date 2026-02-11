"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const handleReset = () => {
    reset();
  };

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#191919",
          fontFamily:
            "'Host Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420, padding: 24 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 600,
              marginBottom: 12,
              lineHeight: "normal",
            }}
          >
            Something went{" "}
            <span
              style={{
                background: "linear-gradient(to right, #ff6900, #ff964d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              wrong
            </span>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#8c8c8c",
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            An unexpected error occurred. Please try again or go back to the
            home page.
          </p>
          <div
            style={{ display: "flex", gap: 12, justifyContent: "center" }}
          >
            <button
              type="button"
              onClick={handleReset}
              style={{
                height: 48,
                padding: "0 20px",
                borderRadius: 9999,
                border: "none",
                backgroundColor: "#ff6900",
                color: "#fff",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 48,
                padding: "0 20px",
                borderRadius: 9999,
                border: "1px solid #474747",
                backgroundColor: "#303030",
                color: "#fff",
                fontSize: 16,
                textDecoration: "none",
              }}
            >
              Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
