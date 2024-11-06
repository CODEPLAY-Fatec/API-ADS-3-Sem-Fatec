"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Question from "@/types/Question";
import { Survey } from "@/types/Survey";
import Team from "@/types/Team";

type QuestionCategory = {
    id: number;
    name: string;
};

const SurveyCreation = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<Survey["category"] | null>(null);
    const [team_id, setTeamId] = useState<number>(0);
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<QuestionCategory[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState<Question>({ type: "Text", question: "", options: [], category: "" });
    const [newOption, setNewOption] = useState<string>("");
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false); // Estado para controlar a exibição do popup

    const surveyCategories: Survey["category"][] = ["Autoavaliação", "Avaliação de líder", "Avaliação de liderado"];
    const MAX_QUESTIONS = 20; // Definindo o limite de perguntas

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
        if (questions.length >= MAX_QUESTIONS) {
            setFeedbackMessage("Limite de 20 perguntas atingido."); // Mensagem de limite
            setShowPopup(true); // Exibe o popup
            return;
        }
        setQuestions([...questions, newQuestion]);
        setNewQuestion({ type: "Text", question: "", options: [], category: "" });
        setFeedbackMessage(null); // Limpa a mensagem de feedback
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
        const updatedOptions = newQuestion.options?.filter((_, i) => i !== index) || [];
        setNewQuestion({ ...newQuestion, options: updatedOptions });
    };

    const handleDeleteQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleCreateSurvey = async () => {
        if (!title || !description || !category || !team_id) {
            setFeedbackMessage("Preencha todos os campos!");
            return;
        }

        try {
            const newSurvey: Survey = {
                team_id,
                uid: "", // Será gerado automaticamente
                title,
                description,
                category,
                created: new Date(),
                questions,
            };
            await axios.post("http://localhost:3001/api/survey", newSurvey);
            setFeedbackMessage("Pesquisa criada com sucesso!");
            setTitle("");
            setDescription("");
            setCategory(null);
            setQuestions([]);
        } catch (error) {
            console.error("Erro ao criar pesquisa:", error);
            setFeedbackMessage("Erro ao criar pesquisa. Tente novamente.");
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center font-bold mb-4">Criação de Pesquisa</h1>

            {showPopup && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Limite de Perguntas Atingido</h5>
                                <button type="button" className="btn-close" onClick={closePopup}></button>
                            </div>
                            <div className="modal-body">
                                <p>Você atingiu o limite máximo de 20 perguntas para esta pesquisa.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closePopup}>
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-4">
                <div className="card shadow-sm">
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
                            <label>Categoria</label>
                            <select className="form-select" value={category ?? ""} onChange={(e) => setCategory(e.target.value as Survey["category"])}>
                                <option value="">Selecione uma categoria</option>
                                {surveyCategories.map((cat, index) => (
                                    <option key={index} value={cat}>
                                        {cat}
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
                <div className="card shadow-sm">
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
                        </div>
                        <select
                            className="form-select mb-3"
                            value={newQuestion.type}
                            onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as "Multiple" | "Text" | "Single" })}>
                            <option value="Text">Pergunta Aberta</option>
                            <option value="Multiple">Múltipla Escolha</option>
                            <option value="Single">Escolha Única</option>
                        </select>

                        {newQuestion.type !== "Text" && (
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
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleRemoveOption(optionIndex)}>
                                                        Remover
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        <button className="btn btn-primary" onClick={handleAddQuestion}>
                            Adicionar Pergunta
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">Perguntas Adicionadas</h5>
                        <ul className="list-group">
                            {questions.map((question, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    {question.question}
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteQuestion(index)}>
                                        Remover
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <button className="btn btn-success" onClick={handleCreateSurvey}>
                Criar Pesquisa
            </button>

            {feedbackMessage && <p className="text-danger mt-3">{feedbackMessage}</p>}
        </div>
    );
};

export default SurveyCreation;
