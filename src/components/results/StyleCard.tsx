"use client";

import { useMemo } from "react";
import type { ScoredHaircut } from "@/types/haircut";
import { PreviewButton } from "./PreviewButton";

interface StyleCardProps {
  result: ScoredHaircut;
  rank: number;
  selected: boolean;
  selectionRank: number | null;
  disabled: boolean;
  onToggle: () => void;
}

export function StyleCard({
  result,
  rank,
  selected,
  selectionRank,
  disabled,
  onToggle,
}: StyleCardProps) {
  const { haircut } = result;

  // Pick a random image from the available pool (stable per mount)
  const imageUrl = useMemo(() => {
    const urls = haircut.exampleImageUrls.filter((u) => u.startsWith("http"));
    if (urls.length === 0) return null;
    return urls[Math.floor(Math.random() * urls.length)];
  }, [haircut.exampleImageUrls]);

  const maintenanceLabel =
    haircut.maintenanceLevel <= 2 ? "low" : haircut.maintenanceLevel >= 4 ? "high" : "medium";

  const maintenanceColor =
    maintenanceLabel === "low"
      ? { bg: "var(--color-success-bg)", color: "var(--color-success)" }
      : maintenanceLabel === "high"
      ? { bg: "var(--color-danger-bg)", color: "var(--color-danger)" }
      : { bg: "var(--color-warning-bg)", color: "var(--color-warning)" };

  return (
    <div
      onClick={onToggle}
      className="relative overflow-hidden cursor-pointer"
      style={{
        borderRadius: "var(--radius-md)",
        border: selected
          ? "1px solid var(--color-accent)"
          : "1px solid var(--color-border-DEFAULT)",
        background: "var(--color-bg-card)",
        opacity: disabled ? 0.35 : 1,
        pointerEvents: disabled ? "none" : "auto",
        boxShadow: selected
          ? "0 0 0 1px var(--color-accent), 0 4px 24px rgba(139,92,246,0.1)"
          : "none",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Rank badge */}
      {selectionRank && (
        <div
          className="absolute top-3 right-3 w-[30px] h-[30px] rounded-full flex items-center justify-center text-[0.85rem] font-bold z-10"
          style={{
            background: "var(--color-accent)",
            color: "#fff",
            boxShadow: "0 2px 8px rgba(139,92,246,0.4)",
          }}
        >
          {selectionRank}
        </div>
      )}

      {/* Image placeholder */}
      <div
        className="w-full flex items-center justify-center"
        style={{
          aspectRatio: "4/3",
          background: "var(--color-bg-raised)",
          borderBottom: "1px solid var(--color-border-DEFAULT)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={haircut.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-1 text-center px-4"
            style={{ color: "var(--color-text-faint)" }}
          >
            <span className="text-3xl">&#9986;</span>
            <span className="text-[0.72rem]">#{rank}</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <div
          className="text-[1.1rem] mb-1.5"
          style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)" }}
        >
          {haircut.name}
        </div>
        <div
          className="text-[0.82rem] mb-2.5 leading-[1.5]"
          style={{
            color: "var(--color-text-muted)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {haircut.description}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span
            className="text-[0.72rem] px-2.5 py-[3px] rounded-full"
            style={{ background: maintenanceColor.bg, color: maintenanceColor.color }}
          >
            {maintenanceLabel} maint.
          </span>
          {haircut.vibeTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[0.72rem] px-2.5 py-[3px] rounded-full capitalize"
              style={{ background: "var(--color-bg-raised)", color: "var(--color-text-muted)" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* AI Preview button - stop propagation so it doesn't toggle selection */}
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border-DEFAULT)" }} onClick={(e) => e.stopPropagation()}>
          <PreviewButton
            haircutId={haircut.id}
            haircutName={haircut.name}
            haircutDescription={haircut.description}
          />
        </div>
      </div>
    </div>
  );
}
