type Question = {
  question: string; // titulo
  type: "Multiple" | "Single(number)" | "Text" | "Single(text)"; // Tipo de pergunta
  options?: string[]; // Opções 
  category: string; // Categoria da pergunta
};

type Answer = {
  question: string;
  type: "Multiple" | "Single(number)" | "Text" | "Single(text)";
  options?: string[];
  answer: number | string;
}

export type { Question, Answer };
