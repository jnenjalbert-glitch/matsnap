import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let instance: FaceLandmarker | null = null;

export async function initFaceLandmarker(): Promise<FaceLandmarker> {
  if (instance) return instance;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  instance = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
      delegate: "GPU",
    },
    outputFaceBlendshapes: false,
    runningMode: "IMAGE",
    numFaces: 1,
  });

  return instance;
}

export function closeFaceLandmarker() {
  instance?.close();
  instance = null;
}
