"use client";

import dynamic from "next/dynamic";
import { ProgressBar } from "@/components/ui/ProgressBar";

const ScanView = dynamic(() => import("@/components/scan/ScanView"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[4/3] w-full rounded-2xl bg-zinc-100 animate-pulse" />
  ),
});

export default function ScanPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
      <ProgressBar currentStep={1} />
      <div>
        <h1 className="text-2xl font-bold">Face Scan</h1>
        <p className="text-zinc-500 mt-1">
          Position your face in the frame and take a photo
        </p>
      </div>
      <ScanView />
    </div>
  );
}
