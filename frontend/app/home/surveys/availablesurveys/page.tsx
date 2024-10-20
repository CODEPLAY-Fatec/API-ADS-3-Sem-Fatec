"use client";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface Survey {
    id: string;
    title: string;
    description: string;
    category: string; 
    questions: Question[];
}

interface Question {
    type: "Multiple" | "Text"; 
    options?: string[]; 
    question: string;
}

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
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [responses, setResponses] = useState<{ [key: string]: { [key: string]: string } }>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadUserAndSurveys() {
            try {
                const token = Cookie.get("authToken") || Cookie.get("userToken");
                if (!token) {
                    throw new Error("Token not found");
                }

                // pegando o id do token
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

                // lgo para moastrar as team roles
                console.log("Team Roles:", currentUser.teamRoles); 

                
                const teamResponse = await fetch("http://localhost:3001/api/team");
                if (!teamResponse.ok) {
                    throw new Error("Failed to fetch teams");
                }
                const teams: Team[] = await teamResponse.json();
                const currentTeam = currentUser.teamRoles.map(role => role.team).map(teamName => 
                    teams.find(team => team.name === teamName)
                ).filter(team => team !== undefined)[0];

                if (!currentTeam) {
                    throw new Error("Team not found");
                }

                const teamId = currentTeam.id;

                
                const surveysResponse = await fetch(`http://localhost:3001/api/surveys/team/${teamId}`);
                if (!surveysResponse.ok) {
                    throw new Error("Failed to fetch surveys");
                }

                const allSurveys = await surveysResponse.json();
                console.log(allSurveys); //log para verificar se as pesquisas estao vazias na rota 
                setSurveys(allSurveys);
            } catch (error: unknown) {
                if (error instanceof Error) {
                  setError(error.message);
                } else {
                  setError('Erro desconhecido');
                }
              }
        }

        loadUserAndSurveys();
    }, []);

    const handleResponseChange = (surveyId: string, questionId: string, answer: string) => {
        setResponses((prevResponses) => ({
            ...prevResponses,
            [surveyId]: {
                ...prevResponses[surveyId],
                [questionId]: answer,
            },
        }));
    };

    const handleSubmit = async (surveyId: string) => {
        try {
            const token = Cookie.get("authToken") || Cookie.get("userToken");
            if (!token) {
                throw new Error("Token not found");
            }

            const decoded = jwtDecode<DecodedToken>(token);
            const userId = decoded.id;

            const response = await fetch("http://localhost:3001/api/surveys/response", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    surveyId,
                    responses: responses[surveyId],
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit response");
            }

            alert("Response submitted successfully");
        } catch (error: unknown) {
            if (error instanceof Error) {
              setError(error.message);
            } else {
              setError('Erro desconhecido');
            }
          }
    };

    return (
        <div className="container mt-4 ">
            <h1 className="text-center font-bold mb-4">Responder Pesquisas</h1>
            {error && <p className="alert alert-danger">{error}</p>}
            {surveys.length > 0 ? (
                surveys.map((survey) => (
                    <div key={survey.id} className="card mb-4">
                        <div className="card-body">
                            <h2 className="card-title">
                                {survey.title} - <strong>{survey.category}</strong>
                            </h2>
                            <p className="card-text">{survey.description}</p>
                            {survey.questions && survey.questions.length > 0 ? (
                                survey.questions.map((question, questionIndex) => (
                                    <div key={questionIndex} className="mb-3">
                                        <label className="form-label">{question.question}</label>
                                        {question.type === "Multiple" && question.options ? (
                                            question.options.map((option, optionIndex) => (
                                                <div key={optionIndex} className="form-check">
                                                    <input
                                                        type="radio"
                                                        className="form-check-input"
                                                        name={`survey_${survey.id}_question_${questionIndex}`} 
                                                        value={option}
                                                        checked={responses[survey.id]?.[questionIndex] === option}
                                                        onChange={() => handleResponseChange(survey.id, questionIndex.toString(), option)}
                                                    />
                                                    <label className="form-check-label">{option}</label>
                                                </div>
                                            ))
                                        ) : (
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={responses[survey.id]?.[questionIndex] || ""}
                                                onChange={(e) => handleResponseChange(survey.id, questionIndex.toString(), e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="alert alert-warning">Nenhuma pergunta disponível</p>
                            )}
                            <button className="btn btn-primary" onClick={() => handleSubmit(survey.id)}>
                                Submit
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="alert alert-info">Nenhuma pesquisa disponível no momento</p>
            )}
        </div>
    );
}
