"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, RotateCcw, ArrowRight, Loader2 } from "lucide-react";
import { initFaceLandmarker } from "@/lib/mediapipe/face-landmarker";
import { computeFaceMetrics } from "@/lib/mediapipe/face-metrics";
import { classifyFaceShape } from "@/lib/mediapipe/face-shape";
import { useFlowStore } from "@/stores/flow-store";
import type { FaceMetrics, FaceShape } from "@/types/face";

type Phase = "camera" | "loading" | "result";

export default function ScanView() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase, setPhase] = useState<Phase>("camera");
  const [modelReady, setModelReady] = useState(false);
  const [selfieDataUrl, setSelfieDataUrl] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<FaceMetrics | null>(null);
  const [shape, setShape] = useState<FaceShape | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setScanData = useFlowStore((s) => s.setScanData);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        setError("Camera access denied. Please allow camera permissions and refresh.");
        return;
      }

      try {
        await initFaceLandmarker();
        if (!cancelled) setModelReady(true);
      } catch {
        setError("Failed to load face detection model. Check your connection and refresh.");
      }
    }

    init();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setPhase("loading");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setSelfieDataUrl(dataUrl);

    streamRef.current?.getTracks().forEach((t) => t.stop());

    try {
      const landmarker = await initFaceLandmarker();
      const result = landmarker.detect(video);
      const landmarks = result.faceLandmarks?.[0];

      if (!landmarks || landmarks.length === 0) {
        setError("No face detected. Please try again with better lighting and face the camera directly.");
        setPhase("camera");
        return;
      }

      const m = computeFaceMetrics(landmarks);
      const s = classifyFaceShape(m);

      setMetrics(m);
      setShape(s);
      setPhase("result");
    } catch {
      setError("Face detection failed. Please try again.");
      setPhase("camera");
    }
  }, []);

  const retake = useCallback(async () => {
    setPhase("camera");
    setSelfieDataUrl(null);
    setMetrics(null);
    setShape(null);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setError("Camera access denied.");
    }
  }, []);

  const proceed = useCallback(() => {
    if (selfieDataUrl && metrics && shape) {
      setScanData(selfieDataUrl, metrics, shape);
      router.push("/questions");
    }
  }, [selfieDataUrl, metrics, shape, setScanData, router]);

  const SHAPE_LABELS: Record<FaceShape, string> = {
    oval: "Oval",
    round: "Round",
    square: "Square",
    heart: "Heart",
    diamond: "Diamond",
    oblong: "Oblong",
  };

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="text-[0.95rem]" style={{ color: "var(--color-danger)" }}>{error}</div>
        <button
          onClick={retake}
          className="px-6 py-2.5 rounded-[8px] text-[0.9rem] font-medium cursor-pointer transition-colors"
          style={{
            background: "var(--color-accent)",
            color: "#0f0d0b",
            border: "none",
            fontFamily: "inherit",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Camera / Photo view */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px]"
        style={{ background: "#000", border: "1px solid var(--color-border-DEFAULT)" }}
      >
        {phase === "camera" && (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            playsInline
            muted
            style={{ transform: "scaleX(-1)" }}
          />
        )}

        {(phase === "loading" || phase === "result") && selfieDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={selfieDataUrl}
            alt="Your selfie"
            className="h-full w-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
        )}

        {phase === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-10 w-10 animate-spin" style={{ color: "var(--color-accent)" }} />
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Capture button */}
      {phase === "camera" && (
        <button
          onClick={capture}
          disabled={!modelReady}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-[8px] text-[0.9rem] font-medium cursor-pointer transition-colors"
          style={{
            background: modelReady ? "var(--color-accent)" : "var(--color-bg-raised)",
            color: modelReady ? "#0f0d0b" : "var(--color-text-faint)",
            border: "none",
            fontFamily: "inherit",
            opacity: modelReady ? 1 : 0.6,
            pointerEvents: modelReady ? "auto" : "none",
          }}
        >
          <Camera className="h-5 w-5" />
          {modelReady ? "Take Photo" : "Loading face model..."}
        </button>
      )}

      {/* Results */}
      {phase === "result" && shape && metrics && (
        <>
          <div
            className="rounded-[14px] p-5 space-y-3"
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border-DEFAULT)",
            }}
          >
            <div className="text-[0.85rem]" style={{ color: "var(--color-text-muted)" }}>
              Your face shape
            </div>
            <div
              className="text-[2rem]"
              style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)", fontWeight: 400 }}
            >
              {SHAPE_LABELS[shape]}
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {[
                { label: "L/W", value: metrics.faceLengthToWidthRatio.toFixed(2) },
                { label: "Jaw/Cheek", value: metrics.jawToCheekboneRatio.toFixed(2) },
                { label: "Fhd/Cheek", value: metrics.foreheadToCheekboneRatio.toFixed(2) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[8px] p-3 text-center"
                  style={{ background: "var(--color-bg-raised)", border: "1px solid var(--color-border-DEFAULT)" }}
                >
                  <div className="text-[0.72rem] uppercase tracking-wide" style={{ color: "var(--color-text-faint)" }}>
                    {item.label}
                  </div>
                  <div className="font-semibold text-[0.9rem]" style={{ color: "var(--color-text-secondary)" }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={retake}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[8px] font-medium cursor-pointer transition-colors"
              style={{
                background: "var(--color-bg-card)",
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border-DEFAULT)",
                fontFamily: "inherit",
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Retake
            </button>
            <button
              onClick={proceed}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[8px] font-medium cursor-pointer transition-colors"
              style={{
                background: "var(--color-accent)",
                color: "#0f0d0b",
                border: "none",
                fontFamily: "inherit",
              }}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
