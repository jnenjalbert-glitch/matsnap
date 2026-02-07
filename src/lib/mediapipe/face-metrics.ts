import type { FaceMetrics } from "@/types/face";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

// Stable MediaPipe Face Mesh landmark indices
const LANDMARKS = {
  foreheadTop: 10,
  chin: 152,
  cheekboneLeft: 234,
  cheekboneRight: 454,
  jawLeft: 172,
  jawRight: 397,
  foreheadLeft: 127,
  foreheadRight: 356,
};

function dist(a: NormalizedLandmark, b: NormalizedLandmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z ?? 0) - (b.z ?? 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function computeFaceMetrics(
  landmarks: NormalizedLandmark[]
): FaceMetrics {
  const jawWidth = dist(
    landmarks[LANDMARKS.jawLeft],
    landmarks[LANDMARKS.jawRight]
  );
  const cheekboneWidth = dist(
    landmarks[LANDMARKS.cheekboneLeft],
    landmarks[LANDMARKS.cheekboneRight]
  );
  const foreheadWidth = dist(
    landmarks[LANDMARKS.foreheadLeft],
    landmarks[LANDMARKS.foreheadRight]
  );
  const faceLength = dist(
    landmarks[LANDMARKS.foreheadTop],
    landmarks[LANDMARKS.chin]
  );

  return {
    jawWidth,
    cheekboneWidth,
    foreheadWidth,
    faceLength,
    faceLengthToWidthRatio: faceLength / cheekboneWidth,
    jawToCheekboneRatio: jawWidth / cheekboneWidth,
    foreheadToCheekboneRatio: foreheadWidth / cheekboneWidth,
  };
}
