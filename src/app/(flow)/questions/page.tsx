"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFlowStore } from "@/stores/flow-store";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuestionnaireForm } from "@/components/questions/QuestionnaireForm";
import { Logo } from "@/components/ui/Logo";

export default function QuestionsPage() {
  const router = useRouter();
  const photosUploaded = useFlowStore((s) => s.photosUploaded);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && !photosUploaded) {
      router.replace("/photos");
    }
  }, [hydrated, photosUploaded, router]);

  if (!hydrated || !photosUploaded) {
    return (
      <div className="mx-auto max-w-[640px] px-6 py-6">
        <div className="h-96 rounded-[14px] animate-pulse" style={{ background: "var(--color-bg-raised)" }} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[640px] px-6 py-6">
      <div className="py-5">
        <Logo />
      </div>
      <ProgressBar currentStep={2} />
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
          Tell Us About Your Hair
        </div>
        <div className="text-[0.9rem] mb-6" style={{ color: "var(--color-text-muted)", lineHeight: 1.5 }}>
          These questions help your stylist recommend the best styles for you.
        </div>
        <QuestionnaireForm />
      </div>
    </div>
  );
}
