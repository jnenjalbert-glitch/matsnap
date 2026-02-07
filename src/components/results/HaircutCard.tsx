"use client";

import { cn } from "@/lib/utils";
import { PreviewButton } from "./PreviewButton";
import type { ScoredHaircut } from "@/types/haircut";

interface HaircutCardProps {
  result: ScoredHaircut;
  rank: number;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: () => void;
}

export function HaircutCard({
  result,
  rank,
  selectable,
  selected,
  onToggle,
}: HaircutCardProps) {
  const { haircut, score, explanation } = result;

  return (
    <div
      onClick={selectable ? onToggle : undefined}
      className={cn(
        "rounded-2xl border-2 p-5 space-y-3 transition-all",
        selectable && "cursor-pointer",
        selected
          ? "border-emerald-500 bg-emerald-50"
          : "border-zinc-200 hover:border-zinc-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-zinc-400">
              #{rank}
            </span>
            <h3 className="text-lg font-bold">{haircut.name}</h3>
          </div>
          <p className="text-sm text-zinc-500 mt-1">{haircut.description}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1">
          <span className="text-sm font-semibold">{score}</span>
          <span className="text-xs text-zinc-400">pts</span>
        </div>
      </div>

      {explanation && (
        <div className="rounded-xl bg-blue-50 p-3">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Why this works for you: </span>
            {explanation}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {haircut.vibeTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-600"
            >
              {tag}
            </span>
          ))}
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
            Maintenance: {haircut.maintenanceLevel}/5
          </span>
        </div>
        {!selectable && (
          <PreviewButton
            haircutId={haircut.id}
            haircutName={haircut.name}
            haircutDescription={haircut.description}
          />
        )}
      </div>

      {selectable && (
        <div className="flex items-center gap-2 pt-1">
          <div
            className={cn(
              "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors",
              selected
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-zinc-300"
            )}
          >
            {selected && <span className="text-xs">✓</span>}
          </div>
          <span className="text-sm text-zinc-500">
            {selected ? "Selected" : "Tap to select"}
          </span>
        </div>
      )}
    </div>
  );
}
