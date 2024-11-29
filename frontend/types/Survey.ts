import Question from "./Question";

type BaseSurvey = {
  id?:string //no caso para paginas q precisa do id da survey
  title: string; // Título do survey
  description: string; 
  last_category: "Autoavaliação" | "Avaliação de líder" | "Avaliação de liderado"; // Enum
  questions: Question[]; 
  target_id?: number; // ID do usuário alvo da avaliação
  uid?:number //para paginas q precisam do uid da base survey 
};

interface Dashboardsurvey {
  uid: number;
  title: string;
  description: string;
  questions: {
    type: string;
    options: string[]; // Array de strings para as opções.
    category: string;
    question: string;
    categoryId: number;
  }[];
}

type BaseSurveyAvailable = {
  survey_id:string //no caso para paginas q precisa do id da survey
  title: string; // Título do survey
  description: string; 
  category: "Autoavaliação" | "Avaliação de líder" | "Avaliação de liderado"; // Enum
  questions: Question[]; 
  target_id?: number; // ID do usuário alvo da avaliação
  target_name?: string;
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

export type { BaseSurvey, UsableSurvey,BaseSurveyAvailable,Dashboardsurvey };



