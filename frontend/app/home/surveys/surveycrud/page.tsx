"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Question from "@/types/Question";
import { Survey, SurveyData } from "@/types/Survey";
import Team from "@/types/Team";

type QuestionCategory = {
    id: number;
    name: string;
};

const SurveyCreation = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [surveyType, setSurveyType] = useState<SurveyData["type"] | null>(null);
    const [team_id, setTeamId] = useState<number>(0);
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<QuestionCategory[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState<Question>({ type: "Text", question: "", options: [] });
    const [newOption, setNewOption] = useState<string>("");
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    const surveyCategories: SurveyData["type"][] = [
        "Autoavaliação",
        "Avaliação de líder",
        "Avaliação de liderado",
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/category");
                setCategories(response.data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/team");
                setTeams(response.data);
            } catch (error) {
                console.error("Erro ao buscar times:", error);
            }
        };

        fetchTeams();
    }, []);

    const handleAddQuestion = () => {
        setQuestions([...questions, newQuestion]);
        setNewQuestion({ type: "Text", question: "", options: [] });
    };

    const handleAddOption = () => {
        if (newOption.trim()) {
            setNewQuestion({
                ...newQuestion,
                options: [...(newQuestion.options || []), newOption],
            });
            setNewOption("");
        }
    };

    const handleRemoveOption = (index: number) => {
        const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
        setNewQuestion({ ...newQuestion, options: updatedOptions });
    };

    const handleDeleteQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleCreateSurvey = async () => {
        if (!title || !description || !surveyType || !team_id) {
            setFeedbackMessage("Preencha todos os campos!");
            return;
        }

        try {
            const newSurvey: Survey = {
                team_id,
                data: { title, description, type: surveyType },
                questions: questions,
            };
            await axios.post("http://localhost:3001/api/survey", newSurvey);
            setFeedbackMessage("Pesquisa criada com sucesso!");
            setTitle("");
            setDescription("");
            setSurveyType(null);
            setQuestions([]);
        } catch (error) {
            console.error("Erro ao criar pesquisa:", error);
            setFeedbackMessage("Erro ao criar pesquisa. Tente novamente.");
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center font-bold mb-4">Criação de Pesquisa</h1>
            {feedbackMessage && <div className="alert alert-info">{feedbackMessage}</div>}

            <div className="mb-4">
                <div className="card shadow-sm"> {/* Adicionando sombra ao cartão */}
                    <div className="card-body">
                        <h5 className="card-title">Informações da Pesquisa</h5>
                        <div className="mb-3">
                            <label>Título da Pesquisa</label>
                            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label>Descrição</label>
                            <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label>Tipo de Pesquisa</label>
                            <select className="form-select" value={surveyType ?? ""} onChange={(e) => setSurveyType(e.target.value as Survey["data"]["type"])}>
                                <option value="">Selecione uma categoria</option>
                                {surveyCategories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label>Time</label>
                            <select className="form-select" value={team_id} onChange={(e) => setTeamId(Number(e.target.value))}>
                                <option value="">Selecione um time para receber a pesquisa</option>
                                {teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="card shadow-sm"> {/* Adicionando sombra ao cartão */}
                    <div className="card-body">
                        <h5 className="card-title">Adicionar Pergunta</h5>
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Título da pergunta"
                            value={newQuestion.question}
                            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                        />
                        <div className="d-flex align-items-center mb-3">
                            <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ width: "66vw" }}>
                                <option value="">Selecione uma categoria</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <button className="btn btn-secondary ms-2" onClick={() => (window.location.href = "/home/surveys/surveycategories")}>
                                Gerenciar Categorias
                            </button>
                        </div>
                        <select
                            className="form-select mb-3"
                            value={newQuestion.type}
                            onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as "Multiple" | "Text" })}
                        >
                            <option value="Text">Pergunta Aberta</option>
                            <option value="Multiple">Múltipla Escolha</option>
                        </select>

                        {newQuestion.type === "Multiple" && (
                            <div>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Digite uma nova opção"
                                    value={newOption}
                                    onChange={(e) => setNewOption(e.target.value)}
                                />
                                <button className="btn btn-secondary mb-2" onClick={handleAddOption}>
                                    Adicionar Opção
                                </button>

                                {newQuestion.options && newQuestion.options.length > 0 && (
                                    <div className="border rounded p-3 mb-3">
                                        <h6>Opções Adicionadas:</h6>
                                        <ul className="list-group">
                                            {newQuestion.options.map((option, optionIndex) => (
                                                <li key={optionIndex} className="list-group-item d-flex justify-content-between align-items-center">
                                                    {option}
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleRemoveOption(optionIndex)}>
                                                        Remover
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        <button className="btn btn-success mt-2" onClick={handleAddQuestion}>
                            Adicionar Pergunta
                        </button>
                    </div>
                </div>
            </div>

            {questions.length > 0 && (
                <div className="mb-4">
                    <div className="card shadow-sm"> {/* Adicionando sombra ao cartão */}
                        <div className="card-body">
                            <h5 className="card-title">Perguntas Adicionadas</h5>
                            <ul className="list-group">
                                {questions.map((question, index) => (
                                    <li key={index} className="list-group-item mb-3 d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{index + 1}. {question.question}</strong>
                                            {question.type === "Multiple" && question.options?.length > 0 && (
                                                <ul className="list-group mt-2">
                                                    {question.options.map((option, optionIndex) => (
                                                        <li key={optionIndex} className="list-group-item">{option}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <button className="btn btn-danger" onClick={() => handleDeleteQuestion(index)}>
                                            Deletar Pergunta
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <button className="btn btn-primary mt-3" onClick={handleCreateSurvey}>
                Criar Pesquisa
            </button>
        </div>
    );
};

export default SurveyCreation;
