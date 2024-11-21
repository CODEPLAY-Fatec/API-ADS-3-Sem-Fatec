import Question from "./Question";

export enum SurveyCategory {
  "Autoavaliação" = "Autoavaliação",
  "Avaliação de líder" = "Avaliação de líder",
  "Avaliação de liderado" = "Avaliação de liderado",
  "Autoavaliação de líder" = "Autoavaliação de líder",
  "Autoavaliação de liderado" = "Autoavaliação de liderado",
}

type BaseSurvey = {
  uid: number; // Identificador único do surve
  title: string; // Título do survey
  description: string; 
  questions: Question[]; 
  target_id?: number; // ID do usuário alvo da avaliação
};

type SurveyInstance = {
  id: number;
  uid: number;
  team_id: number; 
  category: SurveyCategory; // Enum
  created: Date;
  open: boolean;
}

type UsableSurvey = {
  uid?:number,
  survey_id: number;
  title: string;
  description: string;
  category: SurveyCategory;
  questions: Question[];
  target_id?: number;
  target_name?: string;
  team_id: number;
}

export type { BaseSurvey, SurveyInstance, UsableSurvey };

