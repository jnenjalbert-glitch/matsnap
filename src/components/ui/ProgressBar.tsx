"use client";

const STEPS = [
  { label: "Photos", num: 1 },
  { label: "Questions", num: 2 },
  { label: "Styles", num: 3 },
  { label: "Confirm", num: 4 },
];

export function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-7">
      {STEPS.map((step, i) => {
        const isDone = step.num < currentStep;
        const isActive = step.num === currentStep;

        return (
          <div key={step.num} className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[0.8rem] font-semibold transition-all"
                style={{
                  background: isActive
                    ? "var(--color-accent)"
                    : isDone
                    ? "var(--color-accent-dim)"
                    : "var(--color-bg-raised)",
                  color: isActive
                    ? "#fff"
                    : isDone
                    ? "var(--color-accent)"
                    : "var(--color-text-faint)",
                  boxShadow: isActive ? "0 0 20px rgba(139,92,246,0.25)" : "none",
                }}
              >
                {isDone ? "✓" : step.num}
              </div>
              <span
                className="text-[0.75rem]"
                style={{
                  color: isActive ? "var(--color-accent)" : "var(--color-text-muted)",
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-8 h-px"
                style={{
                  background: isDone ? "var(--color-accent)" : "var(--color-border-DEFAULT)",
                  opacity: isDone ? 0.3 : 1,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
