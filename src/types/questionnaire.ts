export type HairType = "straight" | "wavy" | "curly" | "very_curly" | "coily";

export type ThinningLevel = "none" | "slight" | "moderate" | "significant";

export interface QuestionnaireAnswers {
  hairType: HairType;
  thinning: ThinningLevel;
  maintenanceLevel: number;
  vibePreferences: string[];
}
