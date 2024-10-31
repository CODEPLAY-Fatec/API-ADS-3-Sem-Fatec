import Question from "./Question";

type Survey = {
  team_id: number; 
  uid: string; // Identificador único do surve
  title: string; // Título do survey
  description: string; 
  category: "Autoavaliação" | "Avaliação de líder" | "Avaliação de liderado"; // Enum
  created: Date; // Data de criação do survey
  questions: Question[]; 
  target_id?: number; // ID do usuário alvo da avaliação
};

export type { Survey };

