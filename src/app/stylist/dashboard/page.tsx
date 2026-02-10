"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { FlowSwitcher } from "@/components/ui/FlowSwitcher";
import { getSubmissions, type Submission } from "@/lib/submissions";

const DEMO_SUBMISSIONS = [
  {
    id: "sub-1",
    name: "Sarah Mitchell",
    email: "sarah@email.com",
    phone: "(555) 234-5678",
    status: "confirmed" as const,
    date: "2 hours ago",
    hairType: "Wavy",
    hairLength: "Medium",
    concerns: "Frizz",
    change: "Moderate",
    lifestyle: "Creative",
    time: "5-10 min",
  },
  {
    id: "sub-2",
    name: "Alex Rivera",
    email: "alex.r@gmail.com",
    phone: "",
    status: "styles_recommended" as const,
    date: "1 day ago",
    hairType: "Straight",
    hairLength: "Short",
    concerns: "Thinning",
    change: "Bold",
    lifestyle: "Professional",
    time: "Under 5 min",
  },
  {
    id: "sub-3",
    name: "Jordan Chen",
    email: "j.chen@outlook.com",
    phone: "(555) 987-1234",
    status: "photos_uploaded" as const,
    date: "2 days ago",
    hairType: "Curly",
    hairLength: "Long",
    concerns: "Damage",
    change: "Trim",
    lifestyle: "Casual",
    time: "10-20 min",
  },
  {
    id: "sub-4",
    name: "Priya Sharma",
    email: "priya.s@yahoo.com",
    phone: "(555) 456-7890",
    status: "confirmed" as const,
    date: "4 days ago",
    hairType: "Straight",
    hairLength: "Very Long",
    concerns: "Thick, Gray",
    change: "Moderate",
    lifestyle: "Active",
    time: "5-10 min",
  },
];

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  draft: { label: "Draft", bg: "var(--color-bg-raised)", color: "var(--color-text-muted)" },
  photos_uploaded: { label: "Photos", bg: "var(--color-info-bg)", color: "var(--color-info)" },
  questions_answered: { label: "Questions", bg: "var(--color-purple-bg)", color: "var(--color-purple)" },
  styles_recommended: { label: "Styles Ready", bg: "var(--color-warning-bg)", color: "var(--color-warning)" },
  confirmed: { label: "Confirmed", bg: "var(--color-success-bg)", color: "var(--color-success)" },
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

export default function StylistDashboardPage() {
  const router = useRouter();
  const [realSubmissions, setRealSubmissions] = useState<Submission[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRealSubmissions(getSubmissions());
    setHydrated(true);
  }, []);

  // Combine real submissions (newest first) with demo data
  const allSubmissions = [
    ...realSubmissions.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      status: s.status as string,
      date: formatDate(s.date),
    })),
    ...DEMO_SUBMISSIONS.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      status: s.status,
      date: s.date,
    })),
  ];

  return (
    <div className="mx-auto max-w-[1120px] px-6">
      <FlowSwitcher current="stylist" />

      {/* Header */}
      <div
        className="flex items-center justify-between py-6 mb-8"
        style={{ borderBottom: "1px solid var(--color-border-DEFAULT)" }}
      >
        <div className="flex items-center gap-4">
          <Logo />
          <span
            className="text-[0.7rem] uppercase tracking-[0.1em] font-medium"
            style={{ color: "var(--color-text-faint)" }}
          >
            Stylist Dashboard
          </span>
        </div>
        <button
          onClick={() => router.push("/")}
          className="px-[18px] py-2 rounded-[8px] text-[0.82rem] font-medium cursor-pointer transition-colors"
          style={{
            background: "var(--color-bg-card)",
            color: "var(--color-text-secondary)",
            border: "1px solid var(--color-border-DEFAULT)",
            fontFamily: "inherit",
          }}
        >
          &larr; Home
        </button>
      </div>

      {/* Count */}
      <div className="text-[0.9rem] mb-5" style={{ color: "var(--color-text-muted)" }}>
        {hydrated ? allSubmissions.length : DEMO_SUBMISSIONS.length} submissions
      </div>

      {/* Submission list */}
      <div className="stagger">
        {allSubmissions.map((sub) => {
          const st = STATUS_MAP[sub.status] || STATUS_MAP.draft;
          return (
            <div
              key={sub.id}
              onClick={() => router.push(`/stylist/${sub.id}`)}
              className="flex items-center gap-4 p-[18px] mb-2 rounded-[14px] cursor-pointer transition-all"
              style={{
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-border-DEFAULT)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border-light)";
                e.currentTarget.style.background = "var(--color-bg-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border-DEFAULT)";
                e.currentTarget.style.background = "var(--color-bg-card)";
              }}
            >
              {/* Avatar */}
              <div
                className="w-[42px] h-[42px] rounded-full flex items-center justify-center font-semibold text-[0.95rem] shrink-0"
                style={{ background: "var(--color-accent-dim)", color: "var(--color-accent)" }}
              >
                {sub.name[0]}
              </div>

              {/* Meta */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[0.95rem]">{sub.name}</div>
                <div className="text-[0.82rem]" style={{ color: "var(--color-text-muted)" }}>
                  {sub.email} · {sub.date}
                </div>
              </div>

              {/* Status badge */}
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.75rem] font-medium"
                style={{ background: st.bg, color: st.color }}
              >
                {st.label}
              </span>

              {/* Chevron */}
              <span className="text-[0.85rem]" style={{ color: "var(--color-text-faint)" }}>&rsaquo;</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
