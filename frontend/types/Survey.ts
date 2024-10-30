import Question from "./Question";

type Survey = {
  team_id: number;
  uid: string; 
  title: string; 
  description: string; 
  category: "Autoavaliação" | "Avaliação de líder" | "Avaliação de liderado"; // Enum 
  created: Date; // Data de criação do survey
  questions: Question[]; 
};

export type { Survey };

