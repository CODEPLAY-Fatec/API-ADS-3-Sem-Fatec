import Question from "./Question";

type SurveyData = {
  title: string
  description: string
  type: "Autoavaliação" | "Avaliação de líder" | "Avaliação de liderado"
}

type Survey = {
    team_id: number;
    questions: Question[];
    data: SurveyData; 
}

export type { SurveyData, Survey };