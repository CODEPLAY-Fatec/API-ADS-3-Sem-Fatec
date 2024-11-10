"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Collapse } from "react-bootstrap";
import './opensurvey.css';

type Question = {
    type: string;
    options: string[];
    category: string;
    question: string;
    categoryId?: number;
};

type BaseSurvey = {
    uid: number;
    title: string;
    description: string;
    category: string;
    questions: Question[];
};

const SurveyList = () => {
    const [surveys, setSurveys] = useState<BaseSurvey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openSurveyId, setOpenSurveyId] = useState<number | null>(null);

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:3001/api/survey/base");
                
                if (Array.isArray(response.data)) {
                    setSurveys(response.data);
                } else {
                    throw new Error("Formato inesperado de dados da resposta.");
                }
            } catch (error) {
                console.error("Erro ao buscar pesquisas:", error);
                setError("Não foi possível carregar as pesquisas. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };
        fetchSurveys();
    }, []);

    const toggleSurvey = (uid: number) => {
        setOpenSurveyId(prevId => (prevId === uid ? null : uid));
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p className="alert alert-danger">{error}</p>;

    return (
        <div className="container mt-4">
            <h1 className="text-center font-bold mb-4">Lista de Pesquisas</h1>

            {surveys.length > 0 ? (
                surveys.map((survey) => (
                    <div key={`survey-${survey.uid}`} className="card shadow-sm mb-4">
                        <div className="card-header" onClick={() => toggleSurvey(survey.uid)} style={{ cursor: "pointer" }}>
                            <h3>{survey.title}</h3>
                        </div>
                        <Collapse in={openSurveyId === survey.uid}>
                            <div className="card-body">
                                <p><strong>Descrição:</strong> {survey.description}</p>
                                <p><strong>Categoria:</strong> {survey.category}</p>

                                <h5>Perguntas:</h5>
                                <ul className="list-group">
                                    {survey.questions.map((question, questionIndex) => (
                                        <li key={`question-${survey.uid}-${questionIndex}`} className="list-group-item">
                                            <p><strong>Pergunta:</strong> {question.question}</p>
                                            <p><strong>Categoria da Pergunta:</strong> {question.category}</p>
                                            <p><strong>Tipo:</strong> {question.type}</p>

                                            {question.type !== "Text" && question.options.length > 0 && (
                                                <ul className="mt-2">
                                                    {question.options.map((option, optionIndex) => (
                                                        <li key={`option-${survey.uid}-${questionIndex}-${optionIndex}`} className="list-group-item">
                                                            {option}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Collapse>
                    </div>
                ))
            ) : (
                <p className="alert alert-warning text-center">
                    Nenhuma pesquisa disponível no momento.
                </p>
            )}
        </div>
    );
};

export default SurveyList;
