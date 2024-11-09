"use client";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Collapse } from "react-bootstrap";
import './availablesurveys.css';
import { BaseSurveyAvailable} from "@/types/Survey";

interface DecodedToken {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    teamRoles: Array<{ team: string; role: string }>;
}

interface Team {
    id: number;
    name: string;
}

export default function RespondSurveysPage() {
    const [surveys, setSurveys] = useState<BaseSurveyAvailable[]>([]);
    const [teamName, setTeamName] = useState<string>("");
    const [responses, setResponses] = useState<{ [key: string]: { [key: string]: string } }>({});
    const [error, setError] = useState<string | null>(null);
    const [openSurveyId, setOpenSurveyId] = useState<string | null>(null);
    

    useEffect(() => {
        async function loadUserAndSurveys() {
            try {
                const token = Cookie.get("authToken") || Cookie.get("userToken");
                if (!token) {
                    throw new Error("Token not found");
                }

                const decoded = jwtDecode<DecodedToken>(token);
                const userId = decoded.id;

                const userResponse = await fetch("http://localhost:3001/api/users");
                if (!userResponse.ok) {
                    throw new Error("Failed to fetch user details");
                }
                const users: User[] = await userResponse.json();
                const currentUser = users.find(user => user.id === userId);

                if (!currentUser) {
                    throw new Error("User not found");
                }

                const teamResponse = await fetch("http://localhost:3001/api/team");
                if (!teamResponse.ok) {
                    throw new Error("Failed to fetch teams");
                }
                const teams: Team[] = await teamResponse.json();
                const currentTeam = currentUser.teamRoles
                    .map(role => role.team)
                    .map(teamName => teams.find(team => team.name === teamName))
                    .filter(team => team !== undefined)[0];

                if (!currentTeam) {
                    console.log("Team not found");
                }

                setTeamName(currentTeam.name);

                const surveysResponse = await fetch(`http://localhost:3001/api/survey/available/${userId}`);
                if (!surveysResponse.ok) {
                    throw new Error("Failed to fetch surveys");
                }

                const allSurveys = await surveysResponse.json();
                setSurveys(allSurveys);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log(error.message);
                } else {
                    setError("Erro desconhecido");
                }
            }
        }

        loadUserAndSurveys();
    }, []);

    const handleResponseChange = (surveyId: string, questionId: string, answer: string) => {
        setResponses(prevResponses => ({
            ...prevResponses,
            [surveyId]: {
                ...prevResponses[surveyId],
                [questionId]: answer,
            },
        }));
    };

    const handleToggleSurvey = (surveyId: string) => {
        setOpenSurveyId(prevId => (prevId === surveyId ? null : surveyId));
    };

    const handleSubmit = async (survey: BaseSurveyAvailable) => {
        try {
            const token = Cookie.get("authToken") || Cookie.get("userToken");
            if (!token) {
                throw new Error("Token not found");
            }
            const decoded = jwtDecode<DecodedToken>(token);
            const user_id = decoded.id;

            const formattedAnswers = survey.questions.map((question, index) => ({
                question: question.question,
                type: question.type,
                options: question.options,
                category: question.category,
                answer: responses[survey.survey_id]?.[index.toString()] || ""
            }));
            console.log(survey)

            const response = await fetch("http://localhost:3001/api/survey/answers/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id,
                    survey,
                    answers: formattedAnswers,
                }),
            });

            if (!response.ok) {
                throw new Error("Falha em responde formulario");
            }

            alert("Formulario respondido com sucesso");
            window.location.reload(); // Recarrega a página após o envio
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Erro desconhecido");
            }
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center font-bold mb-4">Responder Pesquisas</h1>
            {error && <p className="alert alert-danger">{error}</p>}
            {surveys.length > 0 ? (
                surveys.map(survey => (
                    <div key={survey.survey_id} className="card mb-4">
                        <div className="card-header">
                            <h2
                                className="survey-title"
                                onClick={() => handleToggleSurvey(survey.survey_id)}
                            >
                                {survey.title} - <strong>{survey.category}</strong> ({teamName})
                            </h2>
                        </div>
                        <Collapse in={openSurveyId === survey.survey_id}>
                            <div>
                                <div className="card-body">
                                <span><strong>Descriçao:</strong></span>
                                    <p className="card-text">{survey.description}</p>
                                    <span><strong>Questões:</strong></span>

                                    {survey.questions && survey.questions.length > 0 ? (
                                        survey.questions.map((question, questionIndex) => (
                                            <div key={questionIndex} className="mb-3">
                                                <label className="form-label">
                                                    {question.question} 
                                                    <span style={{ fontWeight: "bold", marginLeft: "8px", color: "#888" }}>
                                                        ({question.category || "Sem categoria"})
                                                    </span>
                                                </label>
                                                {question.type === "Multiple" && question.options ? (
                                                    question.options.map((option, optionIndex) => (
                                                        <div key={optionIndex} className="form-check">
                                                            <input
                                                                type="radio"
                                                                className="form-check-input"
                                                                name={`survey_${survey.survey_id}_question_${questionIndex}`}
                                                                value={option}
                                                                checked={responses[survey.survey_id]?.[questionIndex] === option}
                                                                onChange={() => handleResponseChange(survey.survey_id, questionIndex.toString(), option)}
                                                            />
                                                            <label className="form-check-label">{option}</label>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={responses[survey.survey_id]?.[questionIndex] || ""}
                                                        onChange={e => handleResponseChange(survey.survey_id, questionIndex.toString(), e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="alert alert-warning">Nenhuma pergunta disponível</p>
                                    )}
                                    <button className="btn btn-primary" onClick={() => handleSubmit(survey)}>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </Collapse>
                    </div>
                ))
            ) : (
                <div style={{ padding: "50px", border: "1px solid #ddd", borderRadius: "10px", textAlign: "center", backgroundColor: "#f9f9f9" }}>
                    <p style={{ fontSize: "20px", fontWeight: "bold" }}>Nenhuma pesquisa disponível no momento para você</p>
                    <p style={{ fontSize: "16px" }}>Pesquisas direcionadas a você aparecerão aqui.</p>
                </div>
            )}
        </div>
    );
}