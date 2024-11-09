import Question from "./Question";

type BaseSurvey = {
  uid: number; // Identificador único do surve
  title: string; // Título do survey
  description: string; 
  category: "Autoavaliação" | "Avaliação de líder" | "Avaliação de liderado"; // Enum
  questions: Question[]; 
  target_id?: number; // ID do usuário alvo da avaliação
};

type SurveyInstance = {
  id: number;
  uid: number;
  team_id: number; 
  created: Date;
  open: boolean;
}

type UsableSurvey = {
  uid?:number,
  survey_id: number;
  title: string;
  description: string;
  category: "Autoavaliação" | "Avaliação de líder" | "Avaliação de liderado";
  questions: Question[];
  target_id?: number;
  team_id: number;
}

export type { BaseSurvey, SurveyInstance, UsableSurvey };

