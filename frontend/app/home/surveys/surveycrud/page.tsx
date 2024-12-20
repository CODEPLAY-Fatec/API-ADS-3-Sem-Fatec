"use client";
import Question from "@/types/Question";
import QuestionCategory from "@/types/QuestionCategory";
import { BaseSurvey } from "@/types/Survey";
import Team from "@/types/Team";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const SurveyCreation = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<BaseSurvey["last_category"] | null>(null);
    const [team_id, setTeamId] = useState<number>(0);
    const [categories, setCategories] = useState<QuestionCategory[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState<Question>({ type: "Text", question: "", options: [], category: "", categoryId: 0 });
    const [newOption, setNewOption] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);

    const surveyCategories: BaseSurvey["last_category"][] = ["Autoavaliação", "Avaliação de líder", "Avaliação de liderado"];
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("/api/category");
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
                const response = await axios.get("/api/team");
                setTeams(response.data);
            } catch (error) {
                console.error("Erro ao buscar times:", error);
            }
        };
        fetchTeams();
    }, []);

    const resetModal = () => {
        setNewQuestion({ type: "Text", question: "", options: [], category: "" });
        setNewOption("");
        setIsEditing(false);
        setEditingIndex(null);
        setShowModal(false);
    };

    const handleAddQuestion = () => {
        if (!newQuestion.question.trim()) {
            alert("A pergunta não pode ter campos vazios");
            return;
        }

        const questionTypeCount = questions.filter((q) => q.type === newQuestion.type).length;
        if (questionTypeCount >= 5) {
            alert(`Você só pode adicionar até 5 perguntas do tipo ${newQuestion.type}`);
            return;
        }

        if (isEditing && editingIndex !== null) {
            const updatedQuestions = [...questions];
            updatedQuestions[editingIndex] = newQuestion;
            setQuestions(updatedQuestions);
        } else {
            setQuestions([...questions, newQuestion]);
        }

        resetModal();
    };

    const handleEditQuestion = (index: number) => {
        setNewQuestion(questions[index]);
        setIsEditing(true);
        setEditingIndex(index);
        setShowModal(true);
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
            const newSurvey: BaseSurvey = {
                title,
                description,
                last_category: category,
                questions,
            };
            await axios.post("/api/survey/base", {
                survey: newSurvey,
                open: true,
                teams: [team_id],
                category: category,
                auxiliarySurvey: category === "Autoavaliação" ? false : true,
            });
            
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

    return (
        <div className="container mt-4">
            <h1 className="text-center font-bold mb-4">Criação de Pesquisa</h1>
            {feedbackMessage && <div className="alert alert-info">{feedbackMessage}</div>}

          
                <div className="p-4 mb-3 m-auto bg-light rounded shadow-sm">
                    <div className="card-body">
                        <h4 className="card-title font-bold">Informações da Pesquisa</h4>
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
                            <select className="form-select" value={category ?? ""} onChange={(e) => setCategory(e.target.value as BaseSurvey["last_category"])}>
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
            

            {/* Modal para adicionar pergunta */}
            {showModal && (
                <div className="modal show" style={{ display: "block" }} onClick={resetModal}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Adicionar Pergunta</h5>
                                <button type="button" className="btn-close" onClick={resetModal}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Título da pergunta"
                                    value={newQuestion.question}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                                />
                                <div className="d-flex align-items-center mb-3">
                                    <select
                                        className="form-select"
                                        value={newQuestion.categoryId ?? ""} // Aqui usamos o id da categoria
                                        onChange={(e) => {
                                            const selectedCategoryId = Number(e.target.value);
                                            const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

                                            setNewQuestion({
                                                ...newQuestion,
                                                categoryId: selectedCategoryId,
                                                category: selectedCategory ? selectedCategory.name : "", // Nome da categoria
                                            });
                                        }}
                                    >
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
                                    onChange={(e) =>
                                        setNewQuestion({ ...newQuestion, type: e.target.value as "Multiple" | "Text" | "Single(text)" | "Single(number)" })
                                    }
                                >
                                    <option value="Text">Pergunta Aberta</option>
                                    <option value="Multiple">Múltipla Escolha</option>
                                    <option value="Single(number)">Escolha Única(numero)</option>
                                    <option value="Single(text)">Escolha Única(texto)</option>
                                </select>

                                {newQuestion.type !== "Text" && (
                                    <div>
                                        <input
                                            type={newQuestion.type === "Single(number)" ? "number" : "text"}
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
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={resetModal}>
                                    Fechar
                                </button>
                                <button className="btn btn-success" onClick={handleAddQuestion}>
                                    {isEditing ? "Atualizar Pergunta" : "Adicionar Pergunta"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {questions.length > 0 && (
                <div className="mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Perguntas Adicionadas</h5>
                            <ul className="list-group">
                                {questions.map((question, index) => (
                                    <li key={index} className="list-group-item mb-3 d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>
                                                {index + 1}. {question.question}
                                            </strong>
                                            {question.type !== "Text" && (question.options?.length || 0) > 0 && (
                                                <ul className="list-group mt-2">
                                                    {(question.options || []).map((option, optionIndex) => (
                                                        <li key={optionIndex} className="list-group-item">
                                                            {option}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <div>
                                            <button className="btn btn-warning me-2" onClick={() => handleEditQuestion(index)}>
                                                Editar
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleDeleteQuestion(index)}>
                                                Deletar
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    Adicionar Pergunta
                </button>
                <Link href="/home/surveys/surveycategories">
                    <button className="btn btn-primary">Adicionar Categoria</button>
                </Link>
                <button className="btn btn-primary" onClick={handleCreateSurvey}>
                    Criar Pesquisa
                </button>
                <Link href="/home/surveys/surveycrud/opensurvey">
                    <button className="btn btn-primary">Abrir Pesquisa</button>
                </Link>
            </div>


        </div>
    );
};

export default SurveyCreation;
