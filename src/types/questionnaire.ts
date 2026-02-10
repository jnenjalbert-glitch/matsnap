export type HairType = "straight" | "wavy" | "curly" | "very_curly" | "coily";

export type ThinningLevel = "none" | "slight" | "moderate" | "significant";

export interface QuestionnaireAnswers {
  hairType: HairType;
  hairLength?: string;
  concerns?: string[];
  change?: string;
  lifestyle?: string;
  stylingTime?: string;
  notes?: string;
  // Used by recommendation engine
  thinning: ThinningLevel;
  maintenanceLevel: number;
  vibePreferences: string[];
  // Hair length label passed to engine for length-based scoring
  hairLengthLabel?: string;
}
