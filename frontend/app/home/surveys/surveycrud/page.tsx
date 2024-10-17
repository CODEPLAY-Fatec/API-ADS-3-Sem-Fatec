"use client";
import axios from "axios";
import { useEffect, useState } from "react";
// import "./survey.css";

interface Category {
    id: number;
    name: string;
}

interface Question {
    type: "Multiple" | "Text";
    title: string;
    options?: string[]; // Para perguntas de múltipla escolha
}

const SurveyCreation = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState<Question>({ type: "Text", title: "", options: [] });
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    // Buscar as categorias existentes
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

    const handleCreateCategory = async (categoryName: string) => {
        try {
            const response = await axios.post("http://localhost:3001/api/category", { name: categoryName });
            setCategories((prevCategories) => [...prevCategories, response.data]);
            setFeedbackMessage("Categoria criada com sucesso!");
        } catch (error) {
            console.error("Erro ao criar categoria:", error);
            setFeedbackMessage("Erro ao criar categoria. Tente novamente.");
        }
    };

    const handleRemoveCategory = async (categoryId: number) => {
        try {
            await axios.delete(`http://localhost:3001/api/category/${categoryId}`);
            setCategories(categories.filter((category) => category.id !== categoryId));
            setFeedbackMessage("Categoria removida com sucesso!");
        } catch (error) {
            console.error("Erro ao remover categoria:", error);
            setFeedbackMessage("Erro ao remover categoria. Tente novamente.");
        }
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, newQuestion]);
        setNewQuestion({ type: "Text", title: "", options: [] });
    };

    const handleCreateSurvey = async () => {
        if (!title || !description || !categoryId) {
            setFeedbackMessage("Preencha todos os campos!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/api/survey", {
                title,
                description,
                categoryId,
                questions,
            });
            setFeedbackMessage("Pesquisa criada com sucesso!");
            setTitle("");
            setDescription("");
            setCategoryId("");
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
            <button className="btn btn-secondary mb-3" onClick={() => (window.location.href = "/home/surveys/surveycategories")}>
                Gerenciar Categorias
            </button>
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
                <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <h4>Adicionar Pergunta</h4>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Título da pergunta"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                />

                <select
                    className="form-select mt-2"
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as "Multiple" | "Text" })}
                >
                    <option value="Text">Pergunta Aberta</option>
                    <option value="Multiple">Múltipla Escolha</option>
                </select>

                {newQuestion.type === "Multiple" && (
                    <div className="mt-2">
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Opção 1"
                            onChange={(e) => setNewQuestion({ ...newQuestion, options: [e.target.value] })}
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Opção 2"
                            onChange={(e) => setNewQuestion({ ...newQuestion, options: [...newQuestion.options!, e.target.value] })}
                        />
                    </div>
                )}

                <button className="btn btn-success mt-2" onClick={handleAddQuestion}>
                    Adicionar Pergunta
                </button>
            </div>

            <button className="btn btn-primary" onClick={handleCreateSurvey}>
                Criar Pesquisa
            </button>
        </div>
    );
};

export default SurveyCreation;
