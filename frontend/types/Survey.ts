import Question from "./Question";

type BaseSurvey = {
  team_id: number; 
  title: string; // Título do survey
  description: string; 
  category: "Autoavaliação" | "Avaliação de líder" | "Avaliação de liderado"; // Enum
  questions: Question[]; 
  target_id?: number; // ID do usuário alvo da avaliação
};

type UsableSurvey = {
  survey_id: number;
  title: string;
  description: string;
  category: "Autoavaliação" | "Avaliação de líder" | "Avaliação de liderado";
  questions: Question[];
  target_id?: number;
}

export type { BaseSurvey, UsableSurvey };



