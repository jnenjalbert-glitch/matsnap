import type { FaceShape } from "./face";

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
  maintenanceLevel: number;
  vibeTags: string[];
}

export interface ScoredHaircut {
  haircut: Haircut;
  score: number;
  explanation: string;
}
