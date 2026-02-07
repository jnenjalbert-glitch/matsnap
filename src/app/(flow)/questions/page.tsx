"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFlowStore } from "@/stores/flow-store";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuestionnaireForm } from "@/components/questions/QuestionnaireForm";

export default function QuestionsPage() {
  const router = useRouter();
  const faceMetrics = useFlowStore((s) => s.faceMetrics);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && !faceMetrics) {
      router.replace("/scan");
    }
  }, [hydrated, faceMetrics, router]);

  if (!hydrated || !faceMetrics) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="h-96 rounded-2xl bg-zinc-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
      <ProgressBar currentStep={2} />
      <div>
        <h1 className="text-2xl font-bold">About Your Hair</h1>
        <p className="text-zinc-500 mt-1">
          Tell us about your hair so we can find the best cuts for you
        </p>
      </div>
      <QuestionnaireForm />
    </div>
  );
}
