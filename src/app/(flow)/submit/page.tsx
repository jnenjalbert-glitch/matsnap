"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Download, RotateCcw } from "lucide-react";
import { useFlowStore } from "@/stores/flow-store";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { generateBarberSpec } from "@/lib/pdf/generate-barber-spec";

export default function SubmitPage() {
  const router = useRouter();
  const store = useFlowStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && store.selectedHaircutIds.length === 0) {
      router.replace("/scan");
    }
  }, [hydrated, store.selectedHaircutIds.length, router]);

  const selectedCuts = store.recommendations.filter((r) =>
    store.selectedHaircutIds.includes(r.haircut.id)
  );

  const downloadPdf = useCallback(() => {
    generateBarberSpec({
      faceShape: store.faceShape!,
      faceMetrics: store.faceMetrics!,
      answers: store.questionnaireAnswers!,
      selectedCuts,
      previewImages: store.previewImages,
    });
  }, [store.faceShape, store.faceMetrics, store.questionnaireAnswers, selectedCuts, store.previewImages]);

  const startOver = () => {
    store.reset();
    router.push("/scan");
  };

  if (!hydrated || store.selectedHaircutIds.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="h-96 rounded-2xl bg-zinc-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
      <ProgressBar currentStep={5} />
      <div>
        <h1 className="text-2xl font-bold">Barber Tech Spec</h1>
        <p className="text-zinc-500 mt-1">
          Show this to your barber for the perfect cut
        </p>
      </div>

      {/* Face Info */}
      <div className="rounded-2xl border border-zinc-200 p-5 space-y-4">
        <h2 className="font-semibold text-lg">Face Profile</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-zinc-50 p-3">
            <div className="text-xs text-zinc-400">Face Shape</div>
            <div className="text-lg font-bold capitalize">{store.faceShape}</div>
          </div>
          <div className="rounded-xl bg-zinc-50 p-3">
            <div className="text-xs text-zinc-400">Hair Type</div>
            <div className="text-lg font-bold capitalize">
              {store.questionnaireAnswers?.hairType.replace("_", " ")}
            </div>
          </div>
          <div className="rounded-xl bg-zinc-50 p-3">
            <div className="text-xs text-zinc-400">L/W Ratio</div>
            <div className="text-lg font-bold">
              {store.faceMetrics?.faceLengthToWidthRatio.toFixed(2)}
            </div>
          </div>
          <div className="rounded-xl bg-zinc-50 p-3">
            <div className="text-xs text-zinc-400">Maintenance</div>
            <div className="text-lg font-bold">
              {store.questionnaireAnswers?.maintenanceLevel}/5
            </div>
          </div>
        </div>
      </div>

      {/* Selected Cuts */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Selected Haircuts</h2>
        {selectedCuts.map((rec, i) => (
          <div
            key={rec.haircut.id}
            className="rounded-2xl border border-zinc-200 p-5 space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                {i + 1}
              </span>
              <h3 className="text-lg font-bold">{rec.haircut.name}</h3>
            </div>
            <p className="text-sm text-zinc-600">{rec.haircut.description}</p>
            {store.previewImages[rec.haircut.id] && (
              <div className="grid grid-cols-2 gap-3 py-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-zinc-400 text-center">Current</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={store.selfieDataUrl!}
                    alt="Current look"
                    className="w-full rounded-xl object-cover aspect-square"
                    style={{ transform: "scaleX(-1)" }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-purple-500 text-center">AI Preview</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={store.previewImages[rec.haircut.id]}
                    alt={`Preview with ${rec.haircut.name}`}
                    className="w-full rounded-xl object-cover aspect-square"
                  />
                </div>
              </div>
            )}
            {rec.explanation && (
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Why: </span>
                {rec.explanation}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {rec.haircut.vibeTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={startOver}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-300 font-medium hover:bg-zinc-50 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Start Over
        </button>
        <button
          onClick={downloadPdf}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
}
