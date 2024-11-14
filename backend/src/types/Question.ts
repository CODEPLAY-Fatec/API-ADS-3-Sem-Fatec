type Question = {
    question: string; // titulo
    type: "Multiple" | "Single(number)" | "Text" | "Single(text)"; // Tipo de pergunta
    options?: string[]; // Opções 
    category: string; // Categoria da pergunta
  };
  
  export default Question;
  