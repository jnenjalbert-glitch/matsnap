"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { FlowSwitcher } from "@/components/ui/FlowSwitcher";

export default function StylistLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // For MVP, accept any password
    sessionStorage.setItem("matsnap-stylist", "true");
    router.push("/stylist/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <FlowSwitcher current="stylist" />

      <div
        className="max-w-[380px] w-full text-center rounded-[14px] p-9"
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border-DEFAULT)",
        }}
      >
        <div className="flex justify-center mb-5">
          <Logo />
        </div>
        <div
          className="text-[1.4rem] mb-1"
          style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)" }}
        >
          Stylist Dashboard
        </div>
        <div className="text-[0.85rem] mb-6" style={{ color: "var(--color-text-muted)" }}>
          Enter your password to access submissions.
        </div>

        <div className="text-left mb-5">
          <label className="block text-[0.82rem] font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
            Password
          </label>
          <input
            className="w-full px-4 py-3 rounded-[8px] text-[0.92rem] outline-none transition-colors"
            style={{
              background: "var(--color-bg-raised)",
              border: "1px solid var(--color-border-DEFAULT)",
              color: "var(--color-text-primary)",
              fontFamily: "inherit",
            }}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-border-focus)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border-DEFAULT)")}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-[8px] text-[0.9rem] font-medium cursor-pointer transition-colors"
          style={{
            background: "var(--color-accent)",
            color: "#fff",
            border: "none",
            fontFamily: "inherit",
          }}
        >
          Sign In
        </button>

        <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--color-border-DEFAULT)" }}>
          <a
            href="/"
            className="text-[0.85rem] transition-colors"
            style={{ color: "var(--color-text-faint)", textDecoration: "none" }}
          >
            &larr; Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
