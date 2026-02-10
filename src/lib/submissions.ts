const STORAGE_KEY = "matsnap-submissions";

export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "confirmed";
  date: string; // ISO string
  hairType: string;
  hairLength: string;
  concerns: string;
  change: string;
  lifestyle: string;
  time: string;
  notes: string;
  selections: { haircutId: string; rank: number }[];
}

export function getSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addSubmission(sub: Submission): void {
  const existing = getSubmissions();
  // Avoid duplicates by id
  if (existing.some((s) => s.id === sub.id)) return;
  existing.unshift(sub); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getSubmissionById(id: string): Submission | null {
  return getSubmissions().find((s) => s.id === id) ?? null;
}
