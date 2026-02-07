export type FaceShape =
  | "oval"
  | "round"
  | "square"
  | "heart"
  | "diamond"
  | "oblong";

export interface FaceMetrics {
  jawWidth: number;
  cheekboneWidth: number;
  foreheadWidth: number;
  faceLength: number;
  faceLengthToWidthRatio: number;
  jawToCheekboneRatio: number;
  foreheadToCheekboneRatio: number;
}
