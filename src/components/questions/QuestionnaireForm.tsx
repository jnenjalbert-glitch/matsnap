"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useFlowStore } from "@/stores/flow-store";
import { cn } from "@/lib/utils";
import type { HairType, ThinningLevel, QuestionnaireAnswers } from "@/types/questionnaire";

const HAIR_TYPES: { value: HairType; label: string; icon: string }[] = [
  { value: "straight", label: "Straight", icon: "│" },
  { value: "wavy", label: "Wavy", icon: "∿" },
  { value: "curly", label: "Curly", icon: "∞" },
  { value: "very_curly", label: "Very Curly", icon: "◎" },
  { value: "coily", label: "Coily", icon: "⊛" },
];

const THINNING_LEVELS: { value: ThinningLevel; label: string }[] = [
  { value: "none", label: "None" },
  { value: "slight", label: "Slight" },
  { value: "moderate", label: "Moderate" },
  { value: "significant", label: "Significant" },
];

const MAINTENANCE_LABELS = ["Very Low", "Low", "Medium", "High", "Very High"];

const VIBES = [
  "classic",
  "modern",
  "edgy",
  "professional",
  "relaxed",
  "bold",
  "minimal",
  "streetwear",
];

export function QuestionnaireForm() {
  const router = useRouter();
  const setAnswers = useFlowStore((s) => s.setQuestionnaireAnswers);

  const [hairType, setHairType] = useState<HairType | null>(null);
  const [thinning, setThinning] = useState<ThinningLevel | null>(null);
  const [maintenance, setMaintenance] = useState(3);
  const [vibes, setVibes] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleVibe = (v: string) => {
    setVibes((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const submit = () => {
    if (!hairType) {
      setValidationError("Please select your hair type");
      return;
    }
    if (!thinning) {
      setValidationError("Please select your thinning level");
      return;
    }
    if (vibes.length === 0) {
      setValidationError("Please select at least one vibe");
      return;
    }
    setValidationError(null);

    const answers: QuestionnaireAnswers = {
      hairType,
      thinning,
      maintenanceLevel: maintenance,
      vibePreferences: vibes,
    };

    setAnswers(answers);
    router.push("/results");
  };

  return (
    <div className="space-y-8">
      {/* Hair Type */}
      <section className="space-y-3">
        <h2 className="font-semibold text-lg">Hair Type</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {HAIR_TYPES.map((ht) => (
            <button
              key={ht.value}
              onClick={() => setHairType(ht.value)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-colors",
                hairType === ht.value
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-300"
              )}
            >
              <span className="text-2xl">{ht.icon}</span>
              <span className="text-xs font-medium">{ht.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Thinning */}
      <section className="space-y-3">
        <h2 className="font-semibold text-lg">Hair Thinning</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {THINNING_LEVELS.map((tl) => (
            <button
              key={tl.value}
              onClick={() => setThinning(tl.value)}
              className={cn(
                "rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors",
                thinning === tl.value
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-300"
              )}
            >
              {tl.label}
            </button>
          ))}
        </div>
      </section>

      {/* Maintenance */}
      <section className="space-y-3">
        <h2 className="font-semibold text-lg">
          Maintenance Level
        </h2>
        <div className="space-y-2">
          <input
            type="range"
            min={1}
            max={5}
            value={maintenance}
            onChange={(e) => setMaintenance(Number(e.target.value))}
            className="w-full accent-zinc-900"
          />
          <div className="flex justify-between text-xs text-zinc-400">
            {MAINTENANCE_LABELS.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Vibe */}
      <section className="space-y-3">
        <h2 className="font-semibold text-lg">Your Vibe</h2>
        <p className="text-sm text-zinc-500">Select all that apply</p>
        <div className="flex flex-wrap gap-2">
          {VIBES.map((v) => (
            <button
              key={v}
              onClick={() => toggleVibe(v)}
              className={cn(
                "rounded-full border-2 px-4 py-2 text-sm font-medium capitalize transition-colors",
                vibes.includes(v)
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 hover:border-zinc-300"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </section>

      {/* Validation error */}
      {validationError && (
        <div className="text-red-500 text-sm font-medium">{validationError}</div>
      )}

      {/* Submit */}
      <button
        onClick={submit}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
      >
        See Recommendations
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
