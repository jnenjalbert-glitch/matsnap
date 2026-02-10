"use client";

import { useState } from "react";
import { Sparkles, Loader2, X } from "lucide-react";
import { useFlowStore } from "@/stores/flow-store";

interface PreviewButtonProps {
  haircutId: string;
  haircutName: string;
  haircutDescription: string;
}

export function PreviewButton({
  haircutId,
  haircutName,
  haircutDescription,
}: PreviewButtonProps) {
  const selfieDataUrl = useFlowStore((s) => s.selfieDataUrl);
  const previewImages = useFlowStore((s) => s.previewImages);
  const setPreviewImage = useFlowStore((s) => s.setPreviewImage);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const previewUrl = previewImages[haircutId];

  const generate = async () => {
    if (!selfieDataUrl) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selfieDataUrl,
          haircutName,
          haircutDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate preview");
        return;
      }

      setPreviewImage(haircutId, data.previewUrl);
      setShowModal(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      {previewUrl ? (
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[0.82rem] font-medium rounded-[8px] cursor-pointer transition-colors"
          style={{
            background: "var(--color-purple-bg)",
            color: "var(--color-purple)",
            border: "none",
            fontFamily: "inherit",
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          View AI Preview
        </button>
      ) : (
        <button
          onClick={generate}
          disabled={loading || !selfieDataUrl}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[0.82rem] font-medium rounded-[8px] cursor-pointer transition-colors"
          style={{
            background: "var(--color-bg-raised)",
            color: "var(--color-text-secondary)",
            border: "1px solid var(--color-border-DEFAULT)",
            fontFamily: "inherit",
            opacity: loading || !selfieDataUrl ? 0.5 : 1,
          }}
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Preview on me
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-[0.75rem] mt-1" style={{ color: "var(--color-danger)" }}>{error}</p>
      )}

      {/* Preview modal */}
      {showModal && previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-[14px] p-5 space-y-4"
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border-DEFAULT)",
              boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3
                className="text-lg"
                style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)", fontWeight: 400 }}
              >
                {haircutName}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-[8px] p-1 cursor-pointer transition-colors"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-text-muted)",
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Side by side comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-[0.75rem] font-medium text-center" style={{ color: "var(--color-text-faint)" }}>Current</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selfieDataUrl!}
                  alt="Your current look"
                  className="w-full rounded-[8px] object-cover"
                  style={{ aspectRatio: "1", transform: "scaleX(-1)", border: "1px solid var(--color-border-DEFAULT)" }}
                />
              </div>
              <div className="space-y-1">
                <p className="text-[0.75rem] font-medium text-center" style={{ color: "var(--color-purple)" }}>AI Preview</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={`Preview with ${haircutName}`}
                  className="w-full rounded-[8px] object-cover"
                  style={{ aspectRatio: "1", border: "1px solid var(--color-border-DEFAULT)" }}
                />
              </div>
            </div>

            <p className="text-[0.75rem] text-center" style={{ color: "var(--color-text-faint)" }}>
              AI-generated preview — actual results may vary
            </p>
          </div>
        </div>
      )}
    </>
  );
}
