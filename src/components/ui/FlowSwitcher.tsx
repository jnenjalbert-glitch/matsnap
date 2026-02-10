"use client";

import { useRouter } from "next/navigation";

interface FlowSwitcherProps {
  current: "client" | "stylist";
}

export function FlowSwitcher({ current }: FlowSwitcherProps) {
  const router = useRouter();

  return (
    <div
      className="fixed top-4 right-4 z-[1000] flex gap-1 p-1 rounded-full"
      style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border-DEFAULT)",
        boxShadow: "0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px var(--color-border-DEFAULT)",
      }}
    >
      <button
        onClick={() => router.push("/")}
        className="px-4 py-[7px] rounded-full border-none text-[0.78rem] font-medium cursor-pointer transition-all"
        style={{
          fontFamily: "inherit",
          background: current === "client" ? "var(--color-accent)" : "transparent",
          color: current === "client" ? "#fff" : "var(--color-text-muted)",
        }}
      >
        Client
      </button>
      <button
        onClick={() => router.push("/stylist")}
        className="px-4 py-[7px] rounded-full border-none text-[0.78rem] font-medium cursor-pointer transition-all"
        style={{
          fontFamily: "inherit",
          background: current === "stylist" ? "var(--color-accent)" : "transparent",
          color: current === "stylist" ? "#fff" : "var(--color-text-muted)",
        }}
      >
        Stylist
      </button>
    </div>
  );
}
