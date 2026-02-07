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
          className="flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          View Preview
        </button>
      ) : (
        <button
          onClick={generate}
          disabled={loading || !selfieDataUrl}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}

      {/* Preview modal */}
      {showModal && previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{haircutName}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 hover:bg-zinc-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Side by side comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-400 text-center">Current</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selfieDataUrl!}
                  alt="Your current look"
                  className="w-full rounded-xl object-cover aspect-square"
                  style={{ transform: "scaleX(-1)" }}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-purple-500 text-center">Preview</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={`Preview with ${haircutName}`}
                  className="w-full rounded-xl object-cover aspect-square"
                />
              </div>
            </div>

            <p className="text-xs text-zinc-400 text-center">
              AI-generated preview — actual results may vary
            </p>
          </div>
        </div>
      )}
    </>
  );
}
