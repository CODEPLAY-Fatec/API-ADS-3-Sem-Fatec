type Question = {
  question: string; // titulo
  type: "Multiple" | "Single" | "Text"; 
  options?: string[]; // Opções 
  category: string; // Categoria da pergunta
  categoryId?:number;
};

export default Question;