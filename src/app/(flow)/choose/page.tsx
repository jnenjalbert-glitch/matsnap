"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useFlowStore } from "@/stores/flow-store";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { HaircutCard } from "@/components/results/HaircutCard";

export default function ChoosePage() {
  const router = useRouter();
  const recommendations = useFlowStore((s) => s.recommendations);
  const selectedIds = useFlowStore((s) => s.selectedHaircutIds);
  const setSelected = useFlowStore((s) => s.setSelectedHaircuts);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && recommendations.length === 0) {
      router.replace("/scan");
    }
  }, [hydrated, recommendations.length, router]);

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelected(selectedIds.filter((x) => x !== id));
    } else if (selectedIds.length < 3) {
      setSelected([...selectedIds, id]);
    }
  };

  if (!hydrated || recommendations.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="h-96 rounded-2xl bg-zinc-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
      <ProgressBar currentStep={4} />
      <div>
        <h1 className="text-2xl font-bold">Choose Your Favorites</h1>
        <p className="text-zinc-500 mt-1">
          Select up to 3 haircuts ({selectedIds.length}/3 selected)
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, i) => (
          <HaircutCard
            key={rec.haircut.id}
            result={rec}
            rank={i + 1}
            selectable
            selected={selectedIds.includes(rec.haircut.id)}
            onToggle={() => toggle(rec.haircut.id)}
          />
        ))}
      </div>

      <button
        onClick={() => router.push("/submit")}
        disabled={selectedIds.length === 0}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed"
      >
        Generate Barber Spec
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
