"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useFlowStore } from "@/stores/flow-store";
import { getRecommendations } from "@/lib/recommendation/engine";
import { seedHaircuts } from "@/data/seed-haircuts";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { HaircutCard } from "@/components/results/HaircutCard";

export default function ResultsPage() {
  const router = useRouter();
  const faceShape = useFlowStore((s) => s.faceShape);
  const answers = useFlowStore((s) => s.questionnaireAnswers);
  const recommendations = useFlowStore((s) => s.recommendations);
  const setRecommendations = useFlowStore((s) => s.setRecommendations);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    if (!faceShape || !answers) {
      router.replace(!faceShape ? "/scan" : "/questions");
      return;
    }

    if (recommendations.length === 0) {
      const recs = getRecommendations(seedHaircuts, faceShape, answers, 5);
      setRecommendations(recs);
    }
  }, [hydrated, faceShape, answers, recommendations.length, setRecommendations, router]);

  if (!hydrated || !faceShape || !answers) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="h-96 rounded-2xl bg-zinc-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
      <ProgressBar currentStep={3} />
      <div>
        <h1 className="text-2xl font-bold">Your Recommendations</h1>
        <p className="text-zinc-500 mt-1">
          Based on your <span className="font-semibold capitalize">{faceShape}</span> face
          shape and <span className="font-semibold">{answers.hairType.replace("_", " ")}</span> hair
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, i) => (
          <HaircutCard key={rec.haircut.id} result={rec} rank={i + 1} />
        ))}
      </div>

      {recommendations.length > 0 && (
        <button
          onClick={() => router.push("/choose")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
        >
          Choose Your Favorites
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
