import type { FaceShape } from "@/types/face";
import type { Haircut, HairLength, ScoredHaircut } from "@/types/haircut";
import type { QuestionnaireAnswers } from "@/types/questionnaire";

interface ScoringInput {
  faceShape: FaceShape;
  hairType: string;
  hairLength: HairLength;
  thinning: string;
  maintenanceLevel: number;
  vibePreferences: string[];
}

const VALID_LENGTHS: HairLength[] = [
  "very_short",
  "short",
  "medium",
  "long",
  "very_long",
];

function toHairLength(value: string | undefined): HairLength {
  if (value && VALID_LENGTHS.includes(value as HairLength)) {
    return value as HairLength;
  }
  return "medium";
}

function scoreHaircut(haircut: Haircut, input: ScoringInput): ScoredHaircut {
  let score = 0;
  const reasons: string[] = [];

  // Face shape match (+3)
  if (haircut.faceShapeMatches.includes(input.faceShape)) {
    score += 3;
    const why = haircut.whyItWorks[input.faceShape];
    if (why) reasons.push(why);
  }

  // Face shape avoid (-5)
  if (haircut.avoidFaceShapes.includes(input.faceShape)) {
    score -= 5;
  }

  // Hair type match (+2)
  if (haircut.hairTypeMatches.includes(input.hairType)) {
    score += 2;
    reasons.push(`Works well with ${input.hairType.replace("_", " ")} hair.`);
  }

  // Hair type avoid (-5)
  if (haircut.avoidHairTypes.includes(input.hairType)) {
    score -= 5;
  }

  // Hair length compatibility (+2.5 match, -4 avoid)
  if (haircut.lengthCompatibility.includes(input.hairLength)) {
    score += 2.5;
    reasons.push(`Great fit for your current hair length.`);
  } else {
    score -= 4;
  }

  // Maintenance proximity (+0 to +1.5)
  const maintenanceDiff = Math.abs(
    haircut.maintenanceLevel - input.maintenanceLevel
  );
  const maintenanceScore = Math.max(0, 1.5 - maintenanceDiff * 0.5);
  score += maintenanceScore;

  if (maintenanceDiff <= 1) {
    const level =
      input.maintenanceLevel <= 2
        ? "low"
        : input.maintenanceLevel >= 4
          ? "high"
          : "medium";
    reasons.push(`Matches your ${level}-maintenance preference.`);
  }

  // Vibe overlap (+0.75 per match, up from 0.5)
  const vibeOverlap = haircut.vibeTags.filter((v) =>
    input.vibePreferences.includes(v)
  );
  score += vibeOverlap.length * 0.75;
  if (vibeOverlap.length > 0) {
    reasons.push(`Fits your ${vibeOverlap.join(", ")} style.`);
  }

  // Thinning bonus
  if (input.thinning !== "none" && haircut.tags.includes("thinning-friendly")) {
    score += 1.5;
    reasons.push("Good option for managing hair thinning.");
  }

  // Small random jitter (±0.3) to break ties and add variety
  const jitter = (Math.random() - 0.5) * 0.6;
  score += jitter;

  return {
    haircut,
    score: Math.round(score * 10) / 10,
    explanation: reasons.join(" "),
  };
}

export function getRecommendations(
  library: Haircut[],
  faceShape: FaceShape,
  answers: QuestionnaireAnswers,
  topN = 6
): ScoredHaircut[] {
  const input: ScoringInput = {
    faceShape,
    hairType: answers.hairType,
    hairLength: toHairLength(answers.hairLength),
    thinning: answers.thinning,
    maintenanceLevel: answers.maintenanceLevel,
    vibePreferences: answers.vibePreferences,
  };

  return library
    .map((h) => scoreHaircut(h, input))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
