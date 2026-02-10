"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FaceMetrics, FaceShape } from "@/types/face";
import type { QuestionnaireAnswers } from "@/types/questionnaire";
import type { ScoredHaircut } from "@/types/haircut";

interface FlowState {
  currentStep: number;

  // Photos
  photosUploaded: boolean;
  selfieDataUrl: string | null;
  faceMetrics: FaceMetrics | null;
  faceShape: FaceShape | null;

  // Questionnaire
  questionnaireAnswers: QuestionnaireAnswers | null;

  // Results
  recommendations: ScoredHaircut[];

  // AI Preview images (haircutId -> base64 data URL)
  previewImages: Record<string, string>;

  // Selections
  selectedHaircutIds: string[];

  // Submission
  submissionId: string | null;

  // Actions
  setPhotosComplete: (selfieDataUrl: string | null) => void;
  setScanData: (
    selfieDataUrl: string,
    metrics: FaceMetrics,
    shape: FaceShape
  ) => void;
  setQuestionnaireAnswers: (answers: QuestionnaireAnswers) => void;
  setRecommendations: (recs: ScoredHaircut[]) => void;
  setPreviewImage: (haircutId: string, dataUrl: string) => void;
  setSelectedHaircuts: (ids: string[]) => void;
  setSubmissionId: (id: string) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  photosUploaded: false,
  selfieDataUrl: null,
  faceMetrics: null,
  faceShape: null,
  questionnaireAnswers: null,
  recommendations: [],
  previewImages: {} as Record<string, string>,
  selectedHaircutIds: [],
  submissionId: null,
};

export const useFlowStore = create<FlowState>()(
  persist(
    (set) => ({
      ...initialState,

      setPhotosComplete: (selfieDataUrl) =>
        set({ photosUploaded: true, selfieDataUrl, currentStep: 2 }),

      setScanData: (selfieDataUrl, faceMetrics, faceShape) =>
        set({ selfieDataUrl, faceMetrics, faceShape, photosUploaded: true, currentStep: 2 }),

      setQuestionnaireAnswers: (questionnaireAnswers) =>
        set({ questionnaireAnswers, currentStep: 3 }),

      setRecommendations: (recommendations) =>
        set({ recommendations, currentStep: 3 }),

      setPreviewImage: (haircutId, dataUrl) =>
        set((state) => ({
          previewImages: { ...state.previewImages, [haircutId]: dataUrl },
        })),

      setSelectedHaircuts: (selectedHaircutIds) =>
        set({ selectedHaircutIds, currentStep: 5 }),

      setSubmissionId: (submissionId) => set({ submissionId }),

      reset: () => set(initialState),
    }),
    {
      name: "matsnap-flow",
      partialize: (state) => ({
        ...state,
        // Don't persist large image data
        previewImages: {},
        selfieDataUrl: null,
      }),
    }
  )
);
