"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlowSwitcher } from "@/components/ui/FlowSwitcher";
import { Logo } from "@/components/ui/Logo";

export default function LandingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const startConsultation = () => {
    // Store client info in sessionStorage for later use
    sessionStorage.setItem(
      "matsnap-client",
      JSON.stringify({ name, email, phone })
    );
    router.push("/photos");
  };

  return (
    <div className="landing-gradient relative min-h-screen" style={{ background: "var(--color-bg-deep)" }}>
      <FlowSwitcher current="client" />

      <div className="mx-auto max-w-[960px] px-6">
        {/* Header */}
        <div className="flex items-center justify-between py-5">
          <Logo />
          <a
            href="/stylist"
            className="text-[0.85rem] transition-colors"
            style={{ color: "var(--color-text-faint)", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-faint)")}
          >
            Stylist Login &rarr;
          </a>
        </div>

        {/* Landing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center stagger" style={{ minHeight: "calc(100vh - 80px)" }}>
          {/* Left - Copy */}
          <div className="max-w-[480px]">
            <div
              className="inline-block mb-6 px-4 py-1.5 rounded-full text-[0.72rem] font-medium uppercase tracking-[0.08em]"
              style={{
                border: "1px solid var(--color-border-DEFAULT)",
                color: "var(--color-text-muted)",
              }}
            >
              &#10022; Consultation Made Simple
            </div>
            <h1
              className="text-[3.2rem] leading-[1.1] tracking-tight mb-5"
              style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)", fontWeight: 400, letterSpacing: "-0.03em" }}
            >
              Your next great<br />
              <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>haircut</em> starts here
            </h1>
            <p
              className="text-[1.05rem] leading-[1.65] mb-7 max-w-[400px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Upload photos of your current hair, answer a few quick questions, and receive personalized style recommendations — all before you sit in the chair.
            </p>
            <div className="flex gap-6 text-[0.85rem]" style={{ color: "var(--color-text-muted)" }}>
              {["\u2726 5 minutes", "No account", "Private & secure"].map((text) => (
                <span key={text} className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[0.6rem]"
                    style={{ background: "var(--color-accent-dim)", color: "var(--color-accent)" }}
                  >
                    ✓
                  </span>
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div>
            <div
              className="rounded-[14px] p-9"
              style={{
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-border-DEFAULT)",
              }}
            >
              <div
                className="text-[1.5rem] mb-1"
                style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)" }}
              >
                Get started
              </div>
              <div className="text-[0.85rem] mb-6" style={{ color: "var(--color-text-muted)" }}>
                Tell us about yourself to begin.
              </div>

              <div className="mb-[18px]">
                <label className="block text-[0.82rem] font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-3 rounded-[8px] text-[0.92rem] outline-none transition-colors"
                  style={{
                    background: "var(--color-bg-raised)",
                    border: "1px solid var(--color-border-DEFAULT)",
                    color: "var(--color-text-primary)",
                    fontFamily: "inherit",
                  }}
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-border-focus)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border-DEFAULT)")}
                />
              </div>

              <div className="mb-[18px]">
                <label className="block text-[0.82rem] font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Email
                </label>
                <input
                  className="w-full px-4 py-3 rounded-[8px] text-[0.92rem] outline-none transition-colors"
                  style={{
                    background: "var(--color-bg-raised)",
                    border: "1px solid var(--color-border-DEFAULT)",
                    color: "var(--color-text-primary)",
                    fontFamily: "inherit",
                  }}
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-border-focus)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border-DEFAULT)")}
                />
              </div>

              <div className="mb-[18px]">
                <label className="block text-[0.82rem] font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Phone <span style={{ color: "var(--color-text-faint)", fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  className="w-full px-4 py-3 rounded-[8px] text-[0.92rem] outline-none transition-colors"
                  style={{
                    background: "var(--color-bg-raised)",
                    border: "1px solid var(--color-border-DEFAULT)",
                    color: "var(--color-text-primary)",
                    fontFamily: "inherit",
                  }}
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-border-focus)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border-DEFAULT)")}
                />
              </div>

              <button
                onClick={startConsultation}
                className="w-full py-3 rounded-[8px] text-[0.9rem] font-medium cursor-pointer mt-1.5 transition-colors"
                style={{
                  background: "var(--color-accent)",
                  color: "#fff",
                  border: "none",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-accent)")}
              >
                Start My Consultation &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
