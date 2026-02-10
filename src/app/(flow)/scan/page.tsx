"use client";

import dynamic from "next/dynamic";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Logo } from "@/components/ui/Logo";

const ScanView = dynamic(() => import("@/components/scan/ScanView"), {
  ssr: false,
  loading: () => (
    <div
      className="aspect-[4/3] w-full rounded-[14px] animate-pulse"
      style={{ background: "var(--color-bg-raised)" }}
    />
  ),
});

export default function ScanPage() {
  return (
    <div className="mx-auto max-w-[640px] px-6 py-6">
      <div className="py-5">
        <Logo />
      </div>
      <ProgressBar currentStep={1} />
      <div
        className="rounded-[14px] p-7 stagger"
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border-DEFAULT)",
        }}
      >
        <div
          className="text-[1.7rem] mb-1"
          style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)", fontWeight: 400, letterSpacing: "-0.02em" }}
        >
          Scan Your Face
        </div>
        <div className="text-[0.9rem] mb-6" style={{ color: "var(--color-text-muted)", lineHeight: 1.5 }}>
          Position your face in the frame and take a photo. Our AI will analyze your face shape using 468 facial landmarks.
        </div>
        <ScanView />
      </div>
    </div>
  );
}
