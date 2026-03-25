export type Difficulty = "easy" | "medium" | "hard";

export type AnalyzeRequest = {
  title: string;
  deadline: string;
  progress: number;
  difficulty: Difficulty;
  confidence: number;
  hoursLeft: number;
};

export type AnalyzeResponse = {
  risk: "low" | "medium" | "high";
  confidenceScore: number;
  reason: string;
  recoveryPlan: string[];
  dailyPlan: string[];
  urgencyLabel: string;
};