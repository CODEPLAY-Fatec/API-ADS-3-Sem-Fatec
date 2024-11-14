type Question = {
  question: string; // titulo
  type: "Multiple" | "Single(text)" | "Text" | "Single(number)"; 
  options?: string[]; // Opções 
  category: string; // Categoria da pergunta
  categoryId?:number;
};

export default Question;