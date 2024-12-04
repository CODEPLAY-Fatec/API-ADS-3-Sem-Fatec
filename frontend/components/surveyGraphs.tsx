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
    ResponsiveContainer
} from "recharts";

const sampleData = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
];

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
}

type AnsweredSurvey = {
    base_survey: BaseSurvey;
    answer_id: number;
    user_id: number;
    survey_id: number;
    survey_uid: number;
    created: Date;
    data: Answer[];
    target_id?: number;
    category: SurveyCategory;
}

type SurveyAnswers = {
    BaseSurvey: BaseSurvey;
    Answers: AnsweredSurvey[];
}

const SurveyGraphs: React.FC<{ Dashboardsurvey: SurveyAnswers, SelectedCategory?: string }> = (Props) => {
    console.warn(Props);
    
    const [selectedCategory, setSelectedCategory] = React.useState<string>(Props.SelectedCategory || "");
    let AnswersObject: SurveyAnswers = JSON.parse(JSON.stringify(Props.Dashboardsurvey));
    AnswersObject.Answers = AnswersObject.Answers.filter((answer) => {
        for (let answer of AnswersObject.Answers) {
            answer.data = answer.data.filter((data) => data.type != "Text")
            if (answer.data.length == 0) {
                continue;
            }
            return true
        }
        return false
    });

    const answersBySurveyId = AnswersObject.Answers.reduce((acc, survey) => {
        if (!acc[survey.survey_id]) {
            acc[survey.survey_id] = [];
        }
        acc[survey.survey_id].push(survey);
        return acc;
    }, {} as { [key: number]: AnsweredSurvey[] });

    const answersByUserId = AnswersObject.Answers.reduce((acc, survey) => {
        if (!acc[survey.user_id]) {
            acc[survey.user_id] = [];
        }
        acc[survey.user_id].push(survey);
        return acc;
    }, {} as { [key: number]: AnsweredSurvey[] });
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
            {Object.keys(answersBySurveyId).map((surveyId) => {
                const surveyAnswers = answersBySurveyId[Number(surveyId)];
                const lineChartData = surveyAnswers.filter((answer) => answer.data.some((data) => data.type === "Single(number)")).map((answer) => {
                    const answerData = answer.data.find((data) => data.type === "Single(number)");
                    return {
                        name: answer.created.toISOString(),
                        answer: answerData?.answer,
                    }; 
                    // TODO: continuar daqui:
                    // cada entrada do lineChartData deve ter:
                    // name: data da survey da resposta correspondente
                    // answer: resposta
                    // caso hajam respostas comparativas, adicionar um campo comparativo

                });

                return (
                    <div key={surveyId}>
                        <h3>Survey ID: {surveyId}</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={lineChartData} syncId="lineSync">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="answer" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                );
            })}
            {Object.keys(answersByUserId).map((userId) => {
                const userAnswers = answersByUserId[Number(userId)];
                const barChartData = userAnswers.reduce((acc, answer) => {
                    answer.data.forEach((data) => {
                        if (typeof data.answer === "number") {
                            if (!acc[data.question]) {
                                acc[data.question] = { question: data.question, total: 0, count: 0 };
                            }
                            acc[data.question].total += data.answer;
                            acc[data.question].count += 1;
                        }
                    });
                    return acc;
                }, {} as { [key: string]: { question: string; total: number; count: number } });

                const formattedBarChartData = Object.values(barChartData).map((data) => ({
                    question: data.question,
                    average: data.total / data.count,
                }));

                return (
                    <div key={userId}>
                        <h3>User ID: {userId}</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={formattedBarChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="question" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="average" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );
            })}
        </div>
    );
};

export default SurveyGraphs;