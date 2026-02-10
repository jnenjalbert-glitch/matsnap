"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Download, RotateCcw, CalendarDays } from "lucide-react";
import { useFlowStore } from "@/stores/flow-store";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Logo } from "@/components/ui/Logo";
import { generateBarberSpec } from "@/lib/pdf/generate-barber-spec";
import { addSubmission } from "@/lib/submissions";

export default function ConfirmationPage() {
  const router = useRouter();
  const store = useFlowStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  // Save submission to localStorage so stylist dashboard can see it
  useEffect(() => {
    if (!hydrated || store.selectedHaircutIds.length === 0 || !store.questionnaireAnswers) return;

    // Get client info from sessionStorage (set on landing page)
    let clientInfo = { name: "Anonymous", email: "", phone: "" };
    try {
      const raw = sessionStorage.getItem("matsnap-client");
      if (raw) clientInfo = JSON.parse(raw);
    } catch { /* ignore */ }

    const answers = store.questionnaireAnswers;
    const subId = `sub-${Date.now()}`;

    addSubmission({
      id: subId,
      name: clientInfo.name || "Anonymous",
      email: clientInfo.email || "",
      phone: clientInfo.phone || "",
      status: "confirmed",
      date: new Date().toISOString(),
      hairType: answers.hairType || "",
      hairLength: answers.hairLength || "",
      concerns: answers.concerns?.join(", ") || "",
      change: answers.change || "",
      lifestyle: answers.lifestyle || "",
      time: answers.stylingTime || "",
      notes: answers.notes || "",
      selections: store.selectedHaircutIds.map((id, i) => ({
        haircutId: id,
        rank: i + 1,
      })),
    });
  }, [hydrated, store.selectedHaircutIds, store.questionnaireAnswers]);

  useEffect(() => {
    if (hydrated && store.selectedHaircutIds.length === 0) {
      router.replace("/photos");
    }
  }, [hydrated, store.selectedHaircutIds.length, router]);

  const selectedCuts = store.recommendations.filter((r) =>
    store.selectedHaircutIds.includes(r.haircut.id)
  );

  const downloadPdf = useCallback(() => {
    if (!store.questionnaireAnswers) return;
    generateBarberSpec({
      faceShape: store.faceShape,
      faceMetrics: store.faceMetrics,
      answers: store.questionnaireAnswers,
      selectedCuts,
      previewImages: store.previewImages,
    });
  }, [store.faceShape, store.faceMetrics, store.questionnaireAnswers, selectedCuts, store.previewImages]);

  const startOver = () => {
    store.reset();
    router.push("/");
  };

  if (!hydrated || store.selectedHaircutIds.length === 0) {
    return (
      <div className="mx-auto max-w-[640px] px-6 py-6">
        <div className="h-96 rounded-[14px] animate-pulse" style={{ background: "var(--color-bg-raised)" }} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[640px] px-6 py-6">
      <div className="py-5">
        <Logo />
      </div>
      <ProgressBar currentStep={4} />

      <div className="stagger">
        {/* Success card */}
        <div
          className="rounded-[14px] p-7 text-center mb-7"
          style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border-DEFAULT)",
          }}
        >
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-5 text-[1.8rem]"
            style={{ background: "var(--color-accent-dim)", color: "var(--color-accent)" }}
          >
            ✓
          </div>
          <div
            className="text-[1.7rem] mb-1"
            style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)", fontWeight: 400 }}
          >
            You&apos;re All Set!
          </div>
          <p className="text-[0.92rem] max-w-[380px] mx-auto leading-[1.6]" style={{ color: "var(--color-text-muted)" }}>
            Your style preferences have been submitted. Your stylist will review everything before your appointment.
          </p>
        </div>

        {/* Selections list */}
        <h3
          className="text-[1.2rem] mb-3.5"
          style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)" }}
        >
          Your Selections
        </h3>

        {selectedCuts.map((rec, i) => (
          <div
            key={rec.haircut.id}
            className="flex gap-4 items-start mb-2.5 p-[18px] rounded-[8px]"
            style={{
              background: "var(--color-bg-raised)",
              border: "1px solid var(--color-border-DEFAULT)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[0.85rem] shrink-0"
              style={{ background: "var(--color-accent-dim)", color: "var(--color-accent)" }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h4
                className="text-[1.1rem] mb-0.5"
                style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)" }}
              >
                {rec.haircut.name}
              </h4>
              <p className="text-[0.82rem] leading-[1.5]" style={{ color: "var(--color-text-muted)" }}>
                {rec.haircut.description}
              </p>
              {rec.explanation && (
                <p className="text-[0.82rem] mt-1.5" style={{ color: "var(--color-info)" }}>
                  <span className="font-semibold">Why: </span>
                  {rec.explanation}
                </p>
              )}
            </div>
            {/* AI Preview thumbnail if exists */}
            {store.previewImages[rec.haircut.id] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={store.previewImages[rec.haircut.id]}
                alt={`Preview: ${rec.haircut.name}`}
                className="w-16 h-16 rounded-[8px] object-cover shrink-0"
                style={{ border: "1px solid var(--color-border-DEFAULT)" }}
              />
            )}
          </div>
        ))}

        {/* Booking CTA */}
        <div
          className="text-center p-8 rounded-[14px] mt-6"
          style={{
            background: "var(--color-bg-raised)",
            border: "1px solid var(--color-border-DEFAULT)",
          }}
        >
          <h3
            className="text-[1.3rem] mb-1.5"
            style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)", fontWeight: 400 }}
          >
            Ready to book?
          </h3>
          <p className="text-[0.85rem] mb-5" style={{ color: "var(--color-text-muted)" }}>
            Schedule your appointment and bring these selections to life.
          </p>
          <button
            onClick={() => alert("Booking integration coming soon! For now, download the PDF and call your stylist.")}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-[8px] text-[0.9rem] font-medium cursor-pointer transition-colors"
            style={{
              background: "var(--color-accent)",
              color: "#fff",
              border: "none",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-accent)")}
          >
            <CalendarDays className="h-4 w-4" />
            Book Your Appointment
          </button>
        </div>

        {/* Secondary actions */}
        <div className="flex gap-3 justify-center mt-5">
          <button
            onClick={downloadPdf}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-[0.85rem] font-medium cursor-pointer transition-colors"
            style={{
              background: "var(--color-bg-card)",
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border-DEFAULT)",
              fontFamily: "inherit",
            }}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
          <button
            onClick={startOver}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-[0.85rem] font-medium cursor-pointer transition-colors"
            style={{
              background: "var(--color-bg-card)",
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border-DEFAULT)",
              fontFamily: "inherit",
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Start Over
          </button>
        </div>

        <p className="text-center text-[0.78rem] mt-7" style={{ color: "var(--color-text-faint)" }}>
          Bookmark this page to return anytime.
        </p>
      </div>
    </div>
  );
}
