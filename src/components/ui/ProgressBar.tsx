"use client";

import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Scan", path: "/scan" },
  { label: "Questions", path: "/questions" },
  { label: "Results", path: "/results" },
  { label: "Choose", path: "/choose" },
  { label: "Summary", path: "/submit" },
];

export function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between gap-2 px-4 py-3">
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isComplete = stepNum < currentStep;

        return (
          <div key={step.path} className="flex items-center gap-2 flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  isComplete && "bg-emerald-500 text-white",
                  isActive && "bg-zinc-900 text-white",
                  !isComplete && !isActive && "bg-zinc-200 text-zinc-500"
                )}
              >
                {isComplete ? "✓" : stepNum}
              </div>
              <span
                className={cn(
                  "text-xs",
                  isActive ? "font-semibold text-zinc-900" : "text-zinc-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 -mt-5",
                  isComplete ? "bg-emerald-500" : "bg-zinc-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
