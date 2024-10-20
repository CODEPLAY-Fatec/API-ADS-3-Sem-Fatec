"use client";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Survey {
    id: string;
    title: string;
    description: string;
    questions: any[];
}

interface Response {
    questionId: string;
    answer: string;
}

export default function RespondSurveysPage() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [responses, setResponses] = useState<{ [key: string]: { [key: string]: string } }>({});
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function loadSurveys() {
            try {
                const token = Cookie.get("authToken") || Cookie.get("userToken");
                if (!token) {
                    throw new Error("Token not found");
                }

                const decodedToken: any = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Em segundos
                if (decodedToken.exp < currentTime) {
                    throw new Error("Token expired");
                }

                const teamId = decodedToken.teamId;

                const response = await fetch(`http://localhost:3001/api/surveys/team/${teamId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch surveys");
                }
                const data = await response.json();
                setSurveys(data);
            } catch (error: any) {
                setError(error.message);
            }
        }
        loadSurveys();
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

            const decodedToken: any = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Em segundos
            if (decodedToken.exp < currentTime) {
                throw new Error("Token expired");
            }

            const userId = decodedToken.userId;

            const response = await fetch("http://localhost:3001/api/surveys/response", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
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
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Responder Pesquisas</h1>
            {error && <p className="alert alert-danger">{error}</p>}
            {surveys.length > 0 ? (
                surveys.map((survey) => (
                    <div key={survey.id} className="card mb-4">
                        <div className="card-body">
                            <h2 className="card-title">{survey.title}</h2>
                            <p className="card-text">{survey.description}</p>
                            {survey.questions && survey.questions.length > 0 ? (
                                survey.questions.map((question) => (
                                    <div key={question.id} className="mb-3">
                                        <label className="form-label">{question.title}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={responses[survey.id]?.[question.id] || ""}
                                            onChange={(e) => handleResponseChange(survey.id, question.id, e.target.value)}
                                        />
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
