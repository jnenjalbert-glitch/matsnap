import Link from "next/link";
import { Camera, Sparkles, FileText, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Find your perfect
          <br />
          <span className="text-emerald-600">haircut</span>
        </h1>
        <p className="text-lg text-zinc-500 max-w-sm mx-auto">
          AI-powered face scanning recommends the best styles for your unique
          face shape.
        </p>
        <Link
          href="/scan"
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-8 py-3.5 text-white font-medium hover:bg-zinc-800 transition-colors"
        >
          Start Scan
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* How it works */}
      <div className="space-y-6">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-zinc-400">
          How it works
        </h2>

        <div className="grid gap-4">
          <div className="flex items-start gap-4 rounded-2xl border border-zinc-100 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">1. Scan your face</h3>
              <p className="text-sm text-zinc-500 mt-0.5">
                Take a selfie and our AI analyzes your face shape using 468
                facial landmarks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-zinc-100 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">2. Get matched</h3>
              <p className="text-sm text-zinc-500 mt-0.5">
                Our engine matches your face shape and hair type to the best
                styles from our library.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-zinc-100 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">3. Show your barber</h3>
              <p className="text-sm text-zinc-500 mt-0.5">
                Download a barber tech spec PDF with your picks and walk in
                with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Face shapes */}
      <div className="text-center space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          We detect 5 face shapes
        </h2>
        <div className="flex justify-center gap-3 flex-wrap">
          {["Oval", "Round", "Square", "Heart", "Diamond"].map((shape) => (
            <span
              key={shape}
              className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium"
            >
              {shape}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
