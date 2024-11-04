import Question from "./Question";

type BaseSurvey = {
  uid: number; // Identificador único do surve
  team_id: number; 
  title: string; // Título do survey
  description: string; 
  category: "Autoavaliação" | "Avaliação de líder" | "Avaliação de liderado"; // Enum
  questions: Question[]; 
  target_id?: number; // ID do usuário alvo da avaliação
};

type SurveyInstance = {
  id: number;
  uid: number;
  created: Date;
  open: boolean;
}

type UsableSurvey = {
  survey_id: number;
  title: string;
  description: string;
  category: "Autoavaliação" | "Avaliação de líder" | "Avaliação de liderado";
  questions: Question[];
  target_id?: number;
}

export type { BaseSurvey, SurveyInstance, UsableSurvey };

