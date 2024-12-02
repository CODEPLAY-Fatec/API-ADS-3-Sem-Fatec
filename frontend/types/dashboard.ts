import Question from "./Question";

interface Option {
    id?: number; // Adicione campos relevantes se necessário
    value?: string; 
  }

// Define uma pesquisa base (estrutura da pesquisa)
interface BaseSurvey {
    uid: number; // ID único da pesquisa
    title: string; // Título da pesquisa
    description: string; // Descrição da pesquisa
    questions: Question[]; // Lista de perguntas da pesquisa
  }

  // Define os dados de resposta de uma pergunta
interface AnswerData {
    type: string; // Tipo da pergunta, ex.: Text
    answer: string; // Resposta fornecida
    options: Option[]; // Opções marcadas (para múltipla escolha)
    category: string; // Categoria da pergunta
    question: string; // Texto da pergunta
  }

  // Define uma resposta de um formulário
interface Answer {
    answer_id: number; // ID único da resposta
    user_id: number; // ID do usuário que respondeu
    survey_id: number; // ID da pesquisa
    survey_uid: number; // UID da pesquisa
    created: string; // Data de criação da resposta
    data: AnswerData[]; // Dados das respostas individuais
    target_id: number | null; // ID do alvo (caso exista)
    category: string; // Categoria da pesquisa
  }

  // Define a estrutura completa retornada pela rota
interface DashboardData {
    BaseSurvey: BaseSurvey[]; // Lista de pesquisas base
    Answers: Answer[]; // Lista de respostas
  }

export type {DashboardData, BaseSurvey, Answer, AnswerData, Option};