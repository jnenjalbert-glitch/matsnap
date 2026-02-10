"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFlowStore } from "@/stores/flow-store";
import type { HairType, ThinningLevel, QuestionnaireAnswers } from "@/types/questionnaire";

const HAIR_TYPES: { value: HairType; label: string }[] = [
  { value: "straight", label: "Straight" },
  { value: "wavy", label: "Wavy" },
  { value: "curly", label: "Curly" },
  { value: "very_curly", label: "Coily / Kinky" },
];

const HAIR_LENGTHS = [
  { value: "very_short", label: 'Very Short (<2")' },
  { value: "short", label: 'Short (2-4")' },
  { value: "medium", label: 'Medium (4-8")' },
  { value: "long", label: 'Long (8-14")' },
  { value: "very_long", label: 'Very Long (14"+)' },
];

const CONCERNS = [
  "Thinning / Fine",
  "Thick / Heavy",
  "Frizz",
  "Damage / Split ends",
  "Gray coverage",
  "Cowlick",
  "None in particular",
];

const CHANGE_OPTIONS = [
  { value: "trim", label: "Just a trim" },
  { value: "moderate", label: "Moderate change" },
  { value: "bold", label: "Something totally new" },
  { value: "open", label: "Not sure \u2014 open to ideas" },
];

const LIFESTYLE_OPTIONS = [
  { value: "active", label: "Very active / sporty" },
  { value: "professional", label: "Business professional" },
  { value: "creative", label: "Creative / fashion-forward" },
  { value: "casual", label: "Casual / low-key" },
];

const STYLING_TIME_OPTIONS = [
  { value: 1, label: "Under 5 min" },
  { value: 2, label: "5-10 min" },
  { value: 3, label: "10-20 min" },
  { value: 5, label: "No limit" },
];

export function QuestionnaireForm() {
  const router = useRouter();
  const setAnswers = useFlowStore((s) => s.setQuestionnaireAnswers);

  const [hairType, setHairType] = useState<HairType | null>(null);
  const [hairLength, setHairLength] = useState<string | null>(null);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [change, setChange] = useState<string | null>(null);
  const [lifestyle, setLifestyle] = useState<string | null>(null);
  const [stylingTime, setStylingTime] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleConcern = (c: string) => {
    setConcerns((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const submit = () => {
    if (!hairType) { setValidationError("Please select your hair type"); return; }
    if (!hairLength) { setValidationError("Please select your hair length"); return; }
    if (!change) { setValidationError("Please select how much change you want"); return; }
    if (!lifestyle) { setValidationError("Please select your lifestyle"); return; }
    if (!stylingTime) { setValidationError("Please select your daily styling time"); return; }
    setValidationError(null);

    // Map to recommendation engine fields
    const thinning: ThinningLevel = concerns.includes("Thinning / Fine") ? "moderate" : "none";
    const vibeMap: Record<string, string[]> = {
      active: ["relaxed", "minimal"],
      professional: ["classic", "professional"],
      creative: ["edgy", "modern", "bold"],
      casual: ["relaxed", "modern"],
    };
    const changeVibes: Record<string, string[]> = {
      trim: ["classic"],
      moderate: ["modern"],
      bold: ["bold", "edgy"],
      open: ["modern", "bold"],
    };
    const vibePreferences = [
      ...(vibeMap[lifestyle] || []),
      ...(changeVibes[change] || []),
    ];

    const answers: QuestionnaireAnswers = {
      hairType,
      hairLength,
      concerns,
      change,
      lifestyle,
      stylingTime: STYLING_TIME_OPTIONS.find((o) => o.value === stylingTime)?.label,
      notes: notes || undefined,
      thinning,
      maintenanceLevel: stylingTime,
      vibePreferences,
    };

    setAnswers(answers);
    router.push("/results");
  };

  const pillStyle = (selected: boolean): React.CSSProperties => ({
    padding: "10px 18px",
    borderRadius: "var(--radius-full)",
    fontSize: "0.85rem",
    fontWeight: selected ? 500 : 400,
    background: selected ? "var(--color-accent-dim)" : "var(--color-bg-raised)",
    border: `1px solid ${selected ? "var(--color-accent)" : "var(--color-border-DEFAULT)"}`,
    color: selected ? "var(--color-accent)" : "var(--color-text-secondary)",
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    userSelect: "none" as const,
    fontFamily: "inherit",
  });

  return (
    <div className="space-y-7">
      {/* Hair Type */}
      <div>
        <label className="block text-[0.82rem] font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
          What&apos;s your hair type? *
        </label>
        <div className="flex flex-wrap gap-2">
          {HAIR_TYPES.map((ht) => (
            <button key={ht.value} onClick={() => setHairType(ht.value)} style={pillStyle(hairType === ht.value)}>
              {ht.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hair Length */}
      <div>
        <label className="block text-[0.82rem] font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
          Current hair length? *
        </label>
        <div className="flex flex-wrap gap-2">
          {HAIR_LENGTHS.map((hl) => (
            <button key={hl.value} onClick={() => setHairLength(hl.value)} style={pillStyle(hairLength === hl.value)}>
              {hl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Concerns */}
      <div>
        <label className="block text-[0.82rem] font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
          Any concerns? <span style={{ color: "var(--color-text-faint)", fontWeight: 400 }}>(select all)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CONCERNS.map((c) => (
            <button key={c} onClick={() => toggleConcern(c)} style={pillStyle(concerns.includes(c))}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* How much change */}
      <div>
        <label className="block text-[0.82rem] font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
          How much change? *
        </label>
        <div className="flex flex-wrap gap-2">
          {CHANGE_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setChange(opt.value)} style={pillStyle(change === opt.value)}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lifestyle */}
      <div>
        <label className="block text-[0.82rem] font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
          Lifestyle? *
        </label>
        <div className="flex flex-wrap gap-2">
          {LIFESTYLE_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setLifestyle(opt.value)} style={pillStyle(lifestyle === opt.value)}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Styling Time */}
      <div>
        <label className="block text-[0.82rem] font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
          Daily styling time? *
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLING_TIME_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setStylingTime(opt.value)} style={pillStyle(stylingTime === opt.value)}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-[0.82rem] font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
          Anything else? <span style={{ color: "var(--color-text-faint)", fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          className="w-full px-4 py-3 rounded-[8px] text-[0.92rem] outline-none transition-colors"
          style={{
            background: "var(--color-bg-raised)",
            border: "1px solid var(--color-border-DEFAULT)",
            color: "var(--color-text-primary)",
            fontFamily: "inherit",
            resize: "vertical",
            minHeight: "80px",
          }}
          placeholder="Allergies, past experiences, things you don&#39;t want&#8230;"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-border-focus)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border-DEFAULT)")}
        />
      </div>

      {/* Validation error */}
      {validationError && (
        <div className="text-[0.85rem]" style={{ color: "var(--color-danger)" }}>
          {validationError}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={submit}
        className="w-full py-3 rounded-[8px] text-[0.9rem] font-medium cursor-pointer transition-colors"
        style={{
          background: "var(--color-accent)",
          color: "#fff",
          border: "none",
          fontFamily: "inherit",
        }}
      >
        See My Recommendations &rarr;
      </button>
    </div>
  );
}
