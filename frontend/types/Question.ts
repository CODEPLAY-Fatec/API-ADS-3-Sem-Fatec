type Question = {
    question: string; // Título da pergunta
    type: "Multiple" | "Single" | "Text"; // Tipo de questão
    options?: string[]; // Opções para resposta 
    category: string; // Categoria da pergunta
  };
  
  export default Question;
  