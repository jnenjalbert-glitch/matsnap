"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFlowStore } from "@/stores/flow-store";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Logo } from "@/components/ui/Logo";

interface UploadedPhoto {
  id: number;
  label: string;
  dataUrl: string;
}

const ANGLE_LABELS = ["Front", "Left Side", "Right Side", "Back", "Inspiration", "Inspiration"];

export default function PhotosPage() {
  const router = useRouter();
  const setPhotosComplete = useFlowStore((s) => s.setPhotosComplete);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = 6 - photos.length;
    const toAdd = Array.from(files).slice(0, remaining);

    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPhotos((prev) => {
          if (prev.length >= 6) return prev;
          const label = ANGLE_LABELS[prev.length] || `Photo ${prev.length + 1}`;
          return [...prev, { id: Date.now() + Math.random(), label, dataUrl }];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id: number) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleContinue = () => {
    // Store the first photo as selfie for AI preview
    const selfie = photos.length > 0 ? photos[0].dataUrl : null;
    setPhotosComplete(selfie);
    router.push("/questions");
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
    setCameraError(null);
  }, []);

  const openCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      setCameraOpen(true);
      // Attach stream after state update renders the video element
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    } catch {
      setCameraError("Could not access camera. Please check permissions.");
    }
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror the capture to match the preview
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setPhotos((prev) => {
      if (prev.length >= 6) return prev;
      const label = ANGLE_LABELS[prev.length] || `Photo ${prev.length + 1}`;
      return [...prev, { id: Date.now() + Math.random(), label, dataUrl }];
    });
    stopCamera();
  }, [stopCamera]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="mx-auto max-w-[640px] px-6 py-6">
      <div className="py-5">
        <Logo />
      </div>
      <ProgressBar currentStep={1} />

      <div
        className="rounded-[14px] p-7 stagger"
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border-DEFAULT)",
        }}
      >
        <div
          className="text-[1.7rem] mb-1"
          style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)", fontWeight: 400, letterSpacing: "-0.02em" }}
        >
          Upload Your Photos
        </div>
        <div className="text-[0.9rem] mb-6" style={{ color: "var(--color-text-muted)", lineHeight: 1.5 }}>
          Share photos of your current hair from different angles, plus any inspiration shots. Up to 6 photos.
        </div>

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--color-border-light)"; e.currentTarget.style.background = "var(--color-accent-glow)"; }}
          onDragLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border-DEFAULT)"; e.currentTarget.style.background = "transparent"; }}
          onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--color-border-DEFAULT)"; e.currentTarget.style.background = "transparent"; handleFiles(e.dataTransfer.files); }}
          className="text-center cursor-pointer py-12 px-6 rounded-[14px] transition-colors"
          style={{
            border: "2px dashed var(--color-border-DEFAULT)",
          }}
        >
          <div
            className="w-12 h-12 mx-auto mb-3 rounded-[8px] flex items-center justify-center text-[1.2rem]"
            style={{
              background: "var(--color-bg-raised)",
              border: "1px solid var(--color-border-DEFAULT)",
              color: "var(--color-text-muted)",
            }}
          >
            &#128247;
          </div>
          <div className="text-[0.9rem]" style={{ color: "var(--color-text-muted)" }}>
            Drag & drop photos here, or{" "}
            <span style={{ color: "var(--color-accent)", textDecoration: "underline", cursor: "pointer" }}>browse</span>
          </div>
          <div className="text-[0.78rem] mt-1" style={{ color: "var(--color-text-faint)" }}>
            JPG, PNG, HEIC — max 10 MB each
          </div>
        </div>

        {/* Camera capture button */}
        <button
          onClick={openCamera}
          disabled={photos.length >= 6}
          className="w-full flex items-center justify-center gap-2 py-3 mt-3 rounded-[8px] text-[0.88rem] font-medium cursor-pointer transition-colors"
          style={{
            background: "var(--color-bg-raised)",
            border: "1px solid var(--color-border-DEFAULT)",
            color: "var(--color-text-secondary)",
            fontFamily: "inherit",
            opacity: photos.length >= 6 ? 0.4 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Take a Photo
        </button>

        {cameraError && (
          <div className="text-[0.82rem] mt-2 text-center" style={{ color: "var(--color-danger)" }}>
            {cameraError}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Camera modal */}
        {cameraOpen && (
          <div
            className="fixed inset-0 z-[2000] flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.85)" }}
          >
            <div
              className="relative w-full max-w-[520px] rounded-[14px] overflow-hidden"
              style={{
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-border-DEFAULT)",
              }}
            >
              {/* Camera preview */}
              <div className="relative" style={{ aspectRatio: "4/3", background: "#000" }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 p-5">
                <button
                  onClick={stopCamera}
                  className="px-5 py-2.5 rounded-[8px] text-[0.85rem] font-medium cursor-pointer transition-colors"
                  style={{
                    background: "var(--color-bg-raised)",
                    border: "1px solid var(--color-border-DEFAULT)",
                    color: "var(--color-text-secondary)",
                    fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={capturePhoto}
                  className="px-7 py-2.5 rounded-[8px] text-[0.85rem] font-medium cursor-pointer transition-colors flex items-center gap-2"
                  style={{
                    background: "var(--color-accent)",
                    color: "#fff",
                    border: "none",
                    fontFamily: "inherit",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Capture
                </button>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Photo grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5 mt-5">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-[8px]"
                style={{
                  aspectRatio: "1",
                  border: "1px solid var(--color-border-DEFAULT)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.dataUrl} alt={photo.label} className="w-full h-full object-cover" />
                <div
                  className="absolute bottom-0 left-0 right-0 px-1.5 py-0.5 text-[0.72rem]"
                  style={{
                    color: "var(--color-text-secondary)",
                    background: "linear-gradient(to top, rgba(15,13,11,0.85), transparent)",
                  }}
                >
                  {photo.label}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removePhoto(photo.id); }}
                  className="absolute top-1.5 right-1.5 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[0.7rem] cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                  style={{
                    background: "rgba(15,13,11,0.8)",
                    border: "1px solid var(--color-border-DEFAULT)",
                    color: "var(--color-text-muted)",
                    fontFamily: "inherit",
                  }}
                >
                  &#10005;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={photos.length === 0}
          className="w-full py-3 rounded-[8px] text-[0.9rem] font-medium cursor-pointer mt-6 transition-colors"
          style={{
            background: photos.length > 0 ? "var(--color-accent)" : "var(--color-bg-raised)",
            color: photos.length > 0 ? "#fff" : "var(--color-text-faint)",
            border: "none",
            fontFamily: "inherit",
            opacity: photos.length > 0 ? 1 : 0.4,
            pointerEvents: photos.length > 0 ? "auto" : "none",
          }}
        >
          Continue with {photos.length} photo{photos.length !== 1 ? "s" : ""} &rarr;
        </button>
      </div>
    </div>
  );
}
