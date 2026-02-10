import type { FaceShape } from "./face";

export type HairLength = "very_short" | "short" | "medium" | "long" | "very_long";

export interface Haircut {
  id: string;
  name: string;
  slug: string;
  description: string;
  whyItWorks: Record<string, string>;
  exampleImageUrls: string[];
  tags: string[];
  faceShapeMatches: FaceShape[];
  hairTypeMatches: string[];
  avoidFaceShapes: FaceShape[];
  avoidHairTypes: string[];
  lengthCompatibility: HairLength[];
  maintenanceLevel: number;
  vibeTags: string[];
}

export interface ScoredHaircut {
  haircut: Haircut;
  score: number;
  explanation: string;
}
