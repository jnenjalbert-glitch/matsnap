"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFlowStore } from "@/stores/flow-store";
import { getRecommendations } from "@/lib/recommendation/engine";
import { seedHaircuts } from "@/data/seed-haircuts";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StyleCard } from "@/components/results/StyleCard";
import { Logo } from "@/components/ui/Logo";

export default function StylesPage() {
  const router = useRouter();
  const photosUploaded = useFlowStore((s) => s.photosUploaded);
  const faceShape = useFlowStore((s) => s.faceShape);
  const answers = useFlowStore((s) => s.questionnaireAnswers);
  const recommendations = useFlowStore((s) => s.recommendations);
  const setRecommendations = useFlowStore((s) => s.setRecommendations);
  const selectedIds = useFlowStore((s) => s.selectedHaircutIds);
  const setSelected = useFlowStore((s) => s.setSelectedHaircuts);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    if (!photosUploaded || !answers) {
      router.replace(!photosUploaded ? "/photos" : "/questions");
      return;
    }

    if (recommendations.length === 0) {
      // Use detected face shape or default to "oval" for broadest matches
      const shape = faceShape || "oval";
      const recs = getRecommendations(seedHaircuts, shape, answers, 6);
      setRecommendations(recs);
    }
  }, [hydrated, photosUploaded, faceShape, answers, recommendations.length, setRecommendations, router]);

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelected(selectedIds.filter((x) => x !== id));
    } else if (selectedIds.length < 3) {
      setSelected([...selectedIds, id]);
    }
  };

  const confirmSelections = () => {
    if (selectedIds.length > 0) {
      router.push("/submit");
    }
  };

  if (!hydrated || !photosUploaded || !answers) {
    return (
      <div className="mx-auto max-w-[960px] px-6 py-6">
        <div className="h-96 rounded-[14px] animate-pulse" style={{ background: "var(--color-bg-raised)" }} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[960px] px-6 py-6">
      <div className="py-5">
        <Logo />
      </div>
      <ProgressBar currentStep={3} />

      <div className="text-center mb-7">
        <div
          className="text-[1.7rem] mb-1"
          style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)", fontWeight: 400, letterSpacing: "-0.02em" }}
        >
          Your Recommended Styles
        </div>
        <div className="text-[0.9rem]" style={{ color: "var(--color-text-muted)" }}>
          Pick up to <strong style={{ color: "var(--color-text-primary)" }}>3 favorites</strong> to share with your stylist.
        </div>
      </div>

      {/* 3-column style grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 stagger">
        {recommendations.map((rec, i) => {
          const isSelected = selectedIds.includes(rec.haircut.id);
          const selectionRank = isSelected ? selectedIds.indexOf(rec.haircut.id) + 1 : null;
          const isDisabled = !isSelected && selectedIds.length >= 3;

          return (
            <StyleCard
              key={rec.haircut.id}
              result={rec}
              rank={i + 1}
              selected={isSelected}
              selectionRank={selectionRank}
              disabled={isDisabled}
              onToggle={() => toggle(rec.haircut.id)}
            />
          );
        })}
      </div>

      {/* Sticky selection bar */}
      <div className="sticky bottom-0 left-0 right-0 py-4 px-6 flex items-center justify-between selection-bar-bg">
        <div>
          <div className="text-[0.9rem]" style={{ color: "var(--color-text-secondary)" }}>
            {selectedIds.length === 0
              ? "No styles selected yet"
              : `${selectedIds.length} style${selectedIds.length !== 1 ? "s" : ""} selected`}
          </div>
          {selectedIds.length > 0 && (
            <div className="text-[0.78rem] mt-0.5" style={{ color: "var(--color-text-faint)" }}>
              {selectedIds.map((id, i) => {
                const rec = recommendations.find((r) => r.haircut.id === id);
                return `#${i + 1}: ${rec?.haircut.name}`;
              }).join(" · ")}
            </div>
          )}
        </div>
        <button
          onClick={confirmSelections}
          disabled={selectedIds.length === 0}
          className="px-7 py-3 rounded-[8px] text-[0.9rem] font-medium cursor-pointer transition-colors"
          style={{
            background: selectedIds.length > 0 ? "var(--color-accent)" : "var(--color-bg-raised)",
            color: selectedIds.length > 0 ? "#fff" : "var(--color-text-faint)",
            border: "none",
            fontFamily: "inherit",
            opacity: selectedIds.length > 0 ? 1 : 0.4,
            pointerEvents: selectedIds.length > 0 ? "auto" : "none",
          }}
        >
          Confirm Choices &rarr;
        </button>
      </div>
    </div>
  );
}
