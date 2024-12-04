import { BaseSurvey, Dashboardsurvey } from "@/types/Survey";
import React from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

enum SurveyCategory {
  "Autoavaliação" = "Autoavaliação",
  "Avaliação de líder" = "Avaliação de líder",
  "Avaliação de liderado" = "Avaliação de liderado",
  "Autoavaliação de líder" = "Autoavaliação de líder",
  "Autoavaliação de liderado" = "Autoavaliação de liderado",
}

type Answer = {
  question: string;
  type: "Multiple" | "Single(number)" | "Text" | "Single(text)";
  options?: string[];
  answer: number | string;
};

type AnsweredSurvey = {
  base_survey: BaseSurvey;
  answer_id: number;
  user_id: number;
  survey_id: number;
  survey_uid: number;
  created: Date;
  instance_created: Date;
  data: Answer[];
  target_id?: number;
  category: SurveyCategory;
};

type SurveyAnswers = {
  BaseSurvey: BaseSurvey;
  Answers: AnsweredSurvey[];
};

const SurveyGraphs: React.FC<{
  Dashboardsurvey: SurveyAnswers;
  SelectedCategory?: string;
}> = (Props) => {
  console.warn(Props);

  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    Props.SelectedCategory || "",
  );
  let AnswersObject: SurveyAnswers = JSON.parse(
    JSON.stringify(Props.Dashboardsurvey),
  );
  AnswersObject.Answers = AnswersObject.Answers.filter((answer) => {
    for (let answer of AnswersObject.Answers) {
      answer.data = answer.data.filter((data) => data.type != "Text");
      if (answer.data.length == 0) {
        continue;
      }
      return true;
    }
    return false;
  });

  const answersBySurveyId = AnswersObject.Answers.reduce(
    (acc, survey) => {
      if (!acc[survey.survey_id]) {
        acc[survey.survey_id] = [];
      }
      acc[survey.survey_id].push(survey);
      return acc;
    },
    {} as { [key: number]: AnsweredSurvey[] },
  );

  const answersByUserId = AnswersObject.Answers.reduce(
    (acc, survey) => {
      if (!acc[survey.user_id]) {
        acc[survey.user_id] = [];
      }
      acc[survey.user_id].push(survey);
      return acc;
    },
    {} as { [key: number]: AnsweredSurvey[] },
  );
  console.log(answersBySurveyId);
  console.log(answersByUserId);

  // esboço dos gráficos:
  // gráfico de linha:
  // APENAS PARA TEMPO
  // comparar a evolução das respostas ao longo do tempo
  // caso se aplique, também comparar a resposta de outros usuários como gráfico sincronizado
  // caso hajam respostas antigas E respostas comparativas, exibir um botão para exibir as respostas comparativas
  // caso não hajam respostas antigas, não exibir o gráfico

  // gráfico de pizza
  // PARA DADOS EXTRAS
  // quantas pessoas responderam tal pesquisa?
  // porcentagem de respostas para cada opção
  // como?
  // para cada pergunta, contar quantas pessoas responderam cada opção (para perguntas de múltipla escolha de texto)

  // gráfico de barra / pentágono
  // COMPARAR ENTRE CATEGORIAS
  // pegar todas as respostas de uma categoria e transformar em uma média
  // comparar a média de respostas entre categorias (RadarChart)
  // caso se aplique, comparar a média de respostas entre categorias e a média de respostas de outros usuários

  // na página de perfil, exibir quantas pesquisas o usuário respondeu e quantas pesquisas estão disponíveis no gráfico de pizza
  // exibir a evolução das respostas do usuário ao longo do tempo
  // exibir o gráfico de pentágono
  return (
    <div>
      {/* GRÁFICO TEMPORAL */}
      {Object.keys(answersBySurveyId).map((surveyId) => {
        // this currently generates one whole ass graph for a single question.
        // this is bad.
        // we want to generate one graph per question (assuming there's multiple answers for the same question that we want to compare)
        // so; let's do this correctly.
        // we format the AnsweredSurvey, that is following this format:
        // inst1: answers for instance 1
        // inst2: answers for instance 2
        // so we want to group the answers based on their survey instances;
        // such that we get all answers for Q1 in one table, and all answers for Q2 in another table, and so on.
        // so, how to do it?
        // we iterate through all the answeredsurveys based on their index, inserting them into a graph array, with length equal to usable question number.

        const surveyAnswers = answersBySurveyId[Number(surveyId)];
        const groupedAnswers: {
          [key: string]: (Answer & {
            created: Date;
            question: string;
            user: number;
          })[];
        } = {};

        surveyAnswers.forEach((answer) => {
          answer.data.forEach((data) => {
            if (data.type !== "Single(number)") return;
            if (!groupedAnswers[data.question]) {
              groupedAnswers[data.question] = [];
            }
            groupedAnswers[data.question].push({
              ...data,
              created: answer.instance_created,
              question: data.question,
              user: answer.user_id,
            });
          });
        });
        const lineChartData = Object.values(groupedAnswers).map((answers) => {
          return answers.map((answer) => ({
            name: answer.created,
            answer: answer.answer,
            question: answer.question,
          }));
        });
        console.warn(lineChartData);
        // TODO: continuar daqui:
        // adicionar todos os possíveis user_ids como YAxis de cada gráfico.
        return (
          <div key={surveyId}>
            {lineChartData.map((data) => {
              return (
                <div>
                  <h5 style={{ color: 'white', fontWeight: 'bold' }}>Questão: {data[0].question}</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} syncId="lineSync">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="answer"
                        stroke="#ffffff"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default SurveyGraphs;

