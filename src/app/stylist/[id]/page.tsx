"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FlowSwitcher } from "@/components/ui/FlowSwitcher";
import { seedHaircuts } from "@/data/seed-haircuts";
import { getSubmissionById, type Submission } from "@/lib/submissions";

// Demo data for stylist detail view
const DEMO_DATA: Record<string, {
  name: string;
  email: string;
  phone: string;
  date: string;
  hairType: string;
  hairLength: string;
  concerns: string;
  change: string;
  lifestyle: string;
  time: string;
  notes: string;
  selections: { haircutId: string; rank: number; techNotes: string }[];
}> = {
  "sub-1": {
    name: "Sarah Mitchell",
    email: "sarah@email.com",
    phone: "(555) 234-5678",
    date: "2 hours ago",
    hairType: "Wavy",
    hairLength: "Medium",
    concerns: "Frizz",
    change: "Moderate",
    lifestyle: "Creative",
    time: "5-10 min",
    notes: "Prefers not too short on sides. Allergic to certain hair dyes.",
    selections: [
      { haircutId: "2", rank: 1, techNotes: "Point cut throughout crown for texture. Clipper fade #2 to #4 on sides. Leave 2-3\" on top. Use texturizing paste." },
      { haircutId: "11", rank: 2, techNotes: "Bangs: cheekbone length, point cut, triangular section. Layers start at collarbone. Razor cut ends for movement." },
      { haircutId: "6", rank: 3, techNotes: "Sides: #2 guard blend. Top: 4-5\", scissors only. Style with medium-hold cream for texture." },
    ],
  },
  "sub-2": {
    name: "Alex Rivera",
    email: "alex.r@gmail.com",
    phone: "",
    date: "1 day ago",
    hairType: "Straight",
    hairLength: "Short",
    concerns: "Thinning",
    change: "Bold",
    lifestyle: "Professional",
    time: "Under 5 min",
    notes: "",
    selections: [
      { haircutId: "1", rank: 1, techNotes: "Low taper fade, skin to #3. Scissor work on top 2-3\". Clean line at nape/temples. Light pomade." },
      { haircutId: "5", rank: 2, techNotes: "Classic crew, slightly longer front for quiff. Blend #2 sides. Keep it clean and professional." },
    ],
  },
  "sub-3": {
    name: "Jordan Chen",
    email: "j.chen@outlook.com",
    phone: "(555) 987-1234",
    date: "2 days ago",
    hairType: "Curly",
    hairLength: "Long",
    concerns: "Damage",
    change: "Trim",
    lifestyle: "Casual",
    time: "10-20 min",
    notes: "Just needs a shape-up, doesn't want to lose length.",
    selections: [
      { haircutId: "14", rank: 1, techNotes: "Cut dry on natural curl. Shape fringe to fall on forehead. Thin bulk on sides. Curl cream + diffuser." },
    ],
  },
  "sub-4": {
    name: "Priya Sharma",
    email: "priya.s@yahoo.com",
    phone: "(555) 456-7890",
    date: "4 days ago",
    hairType: "Straight",
    hairLength: "Very Long",
    concerns: "Thick, Gray",
    change: "Moderate",
    lifestyle: "Active",
    time: "5-10 min",
    notes: "Wants something easy to maintain for running and outdoor activities.",
    selections: [
      { haircutId: "17", rank: 1, techNotes: "Long layers starting at collarbone. Internal thinning to reduce bulk. Face-framing pieces." },
      { haircutId: "7", rank: 2, techNotes: "Side part with soft graduation. Light layering for movement. Blow-dry with round brush." },
    ],
  },
};

function formatDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

interface SubData {
  name: string;
  email: string;
  phone: string;
  date: string;
  hairType: string;
  hairLength: string;
  concerns: string;
  change: string;
  lifestyle: string;
  time: string;
  notes: string;
  selections: { haircutId: string; rank: number; techNotes: string }[];
}

function realToSubData(s: Submission): SubData {
  return {
    name: s.name,
    email: s.email,
    phone: s.phone,
    date: formatDate(s.date),
    hairType: s.hairType,
    hairLength: s.hairLength,
    concerns: s.concerns,
    change: s.change,
    lifestyle: s.lifestyle,
    time: s.time,
    notes: s.notes,
    selections: s.selections.map((sel) => ({
      ...sel,
      techNotes: `Selected by client as choice #${sel.rank}`,
    })),
  };
}

export default function StylistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [sub, setSub] = useState<SubData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const demo = DEMO_DATA[id];
    if (demo) {
      setSub(demo);
    } else {
      const real = getSubmissionById(id);
      if (real) setSub(realToSubData(real));
    }
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return (
      <div className="mx-auto max-w-[1120px] px-6 py-12">
        <div className="h-64 rounded-[14px] animate-pulse" style={{ background: "var(--color-bg-raised)" }} />
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="mx-auto max-w-[1120px] px-6 py-12 text-center">
        <div className="text-[1.2rem]" style={{ color: "var(--color-text-muted)" }}>
          Submission not found.
        </div>
        <button
          onClick={() => router.push("/stylist/dashboard")}
          className="mt-4 px-6 py-2 rounded-[8px] text-[0.9rem] cursor-pointer"
          style={{
            background: "var(--color-accent)",
            color: "#fff",
            border: "none",
            fontFamily: "inherit",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const profileData = [
    ["Type", sub.hairType],
    ["Length", sub.hairLength],
    ["Concerns", sub.concerns],
    ["Desired Change", sub.change],
    ["Lifestyle", sub.lifestyle],
    ["Styling Time", sub.time],
  ];

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-6">
      <FlowSwitcher current="stylist" />

      {/* Detail header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/stylist/dashboard")}
          className="w-9 h-9 rounded-[8px] flex items-center justify-center cursor-pointer transition-colors text-[0.85rem]"
          style={{
            border: "1px solid var(--color-border-DEFAULT)",
            background: "var(--color-bg-card)",
            color: "var(--color-text-muted)",
            fontFamily: "inherit",
          }}
        >
          &larr;
        </button>
        <div className="flex-1">
          <div
            className="text-[1.4rem]"
            style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)" }}
          >
            {sub.name}
          </div>
          <div className="text-[0.85rem]" style={{ color: "var(--color-text-muted)" }}>
            {sub.email} · Submitted {sub.date}
          </div>
        </div>
        <button
          onClick={() => alert("PDF download coming soon!")}
          className="px-5 py-2 rounded-[8px] text-[0.82rem] font-medium cursor-pointer transition-colors"
          style={{
            background: "var(--color-accent)",
            color: "#fff",
            border: "none",
            fontFamily: "inherit",
          }}
        >
          Download PDF
        </button>
      </div>

      {/* 2-column detail grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left column */}
        <div>
          {/* Hair Profile */}
          <div
            className="rounded-[14px] p-7 mb-5"
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border-DEFAULT)",
            }}
          >
            <h3
              className="text-[1.15rem] mb-5"
              style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)" }}
            >
              Hair Profile
            </h3>
            <div className="grid grid-cols-2 gap-3.5">
              {profileData.map(([key, value]) => (
                <div key={key}>
                  <dt
                    className="text-[0.72rem] uppercase tracking-[0.06em] mb-0.5"
                    style={{ color: "var(--color-text-faint)" }}
                  >
                    {key}
                  </dt>
                  <dd className="text-[0.9rem]" style={{ color: "var(--color-text-secondary)" }}>
                    {value || "\u2014"}
                  </dd>
                </div>
              ))}
            </div>
          </div>

          {/* Client Selections */}
          <div
            className="rounded-[14px] p-7"
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border-DEFAULT)",
            }}
          >
            <h3
              className="text-[1.15rem] mb-5"
              style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)" }}
            >
              Client Selections
            </h3>
            {sub.selections.map((sel) => {
              const haircut = seedHaircuts.find((h) => h.id === sel.haircutId);
              if (!haircut) return null;

              const maintenanceLabel =
                haircut.maintenanceLevel <= 2 ? "low" : haircut.maintenanceLevel >= 4 ? "high" : "medium";

              return (
                <div
                  key={sel.haircutId}
                  className="flex gap-3.5 items-start p-4 rounded-[8px] mb-2.5"
                  style={{
                    background: "var(--color-bg-raised)",
                    border: "1px solid var(--color-border-DEFAULT)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[0.85rem] shrink-0"
                    style={{ background: "var(--color-accent-dim)", color: "var(--color-accent)" }}
                  >
                    {sel.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-0.5">{haircut.name}</div>
                    <div className="text-[0.82rem] leading-[1.5] mb-2" style={{ color: "var(--color-text-muted)" }}>
                      {haircut.description}
                    </div>
                    <div
                      className="p-3.5 rounded-[8px] mt-2"
                      style={{
                        background: "var(--color-bg-deep)",
                        border: "1px solid var(--color-border-DEFAULT)",
                      }}
                    >
                      <div
                        className="text-[0.7rem] uppercase tracking-[0.06em] mb-1"
                        style={{ color: "var(--color-text-faint)" }}
                      >
                        Tech Notes
                      </div>
                      <div className="text-[0.85rem] leading-[1.5]" style={{ color: "var(--color-text-secondary)" }}>
                        {sel.techNotes}
                      </div>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      <span
                        className="text-[0.72rem] px-2.5 py-[3px] rounded-full"
                        style={{
                          background: maintenanceLabel === "low" ? "var(--color-success-bg)" : maintenanceLabel === "high" ? "var(--color-danger-bg)" : "var(--color-warning-bg)",
                          color: maintenanceLabel === "low" ? "var(--color-success)" : maintenanceLabel === "high" ? "var(--color-danger)" : "var(--color-warning)",
                        }}
                      >
                        {maintenanceLabel}
                      </span>
                      <span
                        className="text-[0.72rem] px-2.5 py-[3px] rounded-full"
                        style={{ background: "var(--color-bg-deep)", color: "var(--color-text-muted)" }}
                      >
                        {maintenanceLabel} maint.
                      </span>
                    </div>
                  </div>
                  {haircut.exampleImageUrls[0]?.startsWith("http") && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={haircut.exampleImageUrls[0]}
                      alt={haircut.name}
                      className="w-20 h-20 rounded-[8px] object-cover shrink-0"
                      style={{ border: "1px solid var(--color-border-DEFAULT)" }}
                    />
                  )}
                </div>
              );
            })}
            {sub.selections.length === 0 && (
              <p className="text-[0.88rem]" style={{ color: "var(--color-text-muted)" }}>
                No selections yet.
              </p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div>
          <div
            className="rounded-[14px] p-7 mb-5"
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border-DEFAULT)",
            }}
          >
            <h3
              className="text-[1.15rem] mb-3.5"
              style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)" }}
            >
              Client Photos
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {["Front", "Left Side", "Right Side", "Back"].map((label, i) => (
                <div
                  key={label}
                  className="relative overflow-hidden rounded-[8px]"
                  style={{
                    aspectRatio: "1",
                    border: "1px solid var(--color-border-DEFAULT)",
                    background: `hsl(${260 + i * 15}, 20%, 12%)`,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center text-[1.5rem] opacity-30">
                    &#128100;
                  </div>
                  <div
                    className="absolute bottom-0 left-0 right-0 px-1.5 py-0.5 text-[0.68rem]"
                    style={{
                      color: "var(--color-text-secondary)",
                      background: "linear-gradient(to top, rgba(13,11,20,0.8), transparent)",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-[14px] p-7"
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border-DEFAULT)",
            }}
          >
            <h3
              className="text-[1.15rem] mb-2.5"
              style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)" }}
            >
              Contact
            </h3>
            <div className="text-[0.88rem] leading-[2]" style={{ color: "var(--color-text-secondary)" }}>
              <div>&#9993; {sub.email}</div>
              <div>
                {sub.phone ? (
                  <>&#9742; {sub.phone}</>
                ) : (
                  <span style={{ color: "var(--color-text-faint)" }}>No phone</span>
                )}
              </div>
            </div>
          </div>

          {sub.notes && (
            <div
              className="rounded-[14px] p-7 mt-5"
              style={{
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-border-DEFAULT)",
              }}
            >
              <h3
                className="text-[1.15rem] mb-2.5"
                style={{ fontFamily: "var(--font-instrument-serif), var(--font-display)" }}
              >
                Client Notes
              </h3>
              <div className="text-[0.85rem] leading-[1.5]" style={{ color: "var(--color-text-secondary)" }}>
                {sub.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
