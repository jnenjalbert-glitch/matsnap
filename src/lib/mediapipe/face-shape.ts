import type { FaceMetrics, FaceShape } from "@/types/face";

export function classifyFaceShape(m: FaceMetrics): FaceShape {
  const {
    faceLengthToWidthRatio: lw,
    jawToCheekboneRatio: jc,
    foreheadToCheekboneRatio: fc,
  } = m;

  // Oblong: very long face
  if (lw > 1.5) return "oblong";

  // Square: all widths similar, moderate length
  if (lw >= 1.0 && lw <= 1.35 && jc >= 0.9 && fc >= 0.9) return "square";

  // Round: short face, soft jaw
  if (lw < 1.25 && jc < 0.9 && jc >= 0.75) return "round";

  // Heart: wide forehead, narrow jaw
  if (fc > 0.95 && jc < 0.82) return "heart";

  // Diamond: cheekbones widest, both forehead and jaw narrow
  if (fc < 0.88 && jc < 0.85) return "diamond";

  // Oval: balanced proportions (default / catch-all)
  return "oval";
}
