"use client";

import { useRouter } from "next/navigation";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const router = useRouter();

  const iconSize = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const fontSize = size === "sm" ? "1.1rem" : size === "lg" ? "1.8rem" : "1.35rem";
  const subSize = size === "sm" ? "0.55rem" : size === "lg" ? "0.75rem" : "0.65rem";

  return (
    <div
      className="flex items-center gap-2.5 cursor-pointer select-none"
      onClick={() => router.push("/")}
    >
      {/* Gradient icon with scissors */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: iconSize * 0.25,
          background: "linear-gradient(135deg, #FF3CAC, #8B5CF6)",
        }}
      >
        <svg
          width={iconSize * 0.55}
          height={iconSize * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <line x1="20" y1="4" x2="8.12" y2="15.88" />
          <line x1="14.47" y1="14.48" x2="20" y2="20" />
          <line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{ lineHeight: 1 }}>
        <div
          style={{
            fontFamily: "var(--font-instrument-serif), var(--font-display)",
            fontSize,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: "var(--color-text-primary)" }}>mat</span>
          <span className="text-gradient">snap</span>
        </div>
        <div
          style={{
            fontSize: subSize,
            letterSpacing: "0.08em",
            color: "#a78bfa",
            marginTop: "1px",
          }}
        >
          .studio
        </div>
      </div>
    </div>
  );
}
