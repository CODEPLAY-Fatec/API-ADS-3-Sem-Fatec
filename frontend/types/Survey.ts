import Question from "./Question";

type BaseSurvey = {
  id?:string //no caso para paginas q precisa do id da survey
  title: string; // Título do survey
  description: string; 
  category: "Autoavaliação" | "Avaliação de líder" | "Avaliação de liderado"; // Enum
  questions: Question[]; 
  target_id?: number; // ID do usuário alvo da avaliação
  uid?:number //para paginas q precisam do uid da base survey 
};

type BaseSurveyAvailable = {
  id:string //no caso para paginas q precisa do id da survey
  title: string; // Título do survey
  description: string; 
  category: "Autoavaliação" | "Avaliação de líder" | "Avaliação de liderado"; // Enum
  questions: Question[]; 
  target_id?: number; // ID do usuário alvo da avaliação
  uid?:number //para paginas q precisam do uid da base survey 
};

type UsableSurvey = {
  survey_id: number;
  title: string;
  description: string;
  category: "Autoavaliação" | "Avaliação de líder" | "Avaliação de liderado";
  questions: Question[];
  target_id?: number;
}

export type { BaseSurvey, UsableSurvey,BaseSurveyAvailable };



