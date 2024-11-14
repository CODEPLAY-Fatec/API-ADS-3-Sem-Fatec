"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";

interface Category {
    id: number;
    name: string;
}

const CategoryRegistration = () => {
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState("");

    // Função para buscar as categorias da API
    const fetchCategories = async () => {
        try {
            const response = await axios.get("/api/category");
            setCategories(response.data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    // useEffect para buscar as categorias na montagem
    useEffect(() => {
        fetchCategories();
    }, []);

    // Função para adicionar nova categoria
    const handleAddCategory = async () => {
        if (categoryName.trim() === "") return;

        try {
            await axios.post("/api/category", { name: categoryName });
            setCategoryName(""); // Limpar o campo de texto
            fetchCategories(); // Atualiza a lista de categorias
        } catch (error) {
            console.error("Erro ao adicionar categoria:", error);
        }
    };

    // Função para deletar categoria
    const handleDeleteCategory = async (id: number) => {
        try {
            await axios.delete(`/api/category/${id}`);
            fetchCategories(); // Atualiza a lista de categorias
        } catch (error) {
            console.error("Erro ao deletar categoria:", error);
        }
    };

    // Função para editar categoria
    const handleEditCategory = async (id: number) => {
        if (editingCategoryName.trim() === "") return;

        try {
            await axios.put(`/api/category/${id}`, { name: editingCategoryName });
            setEditingCategoryId(null);
            setEditingCategoryName("");
            fetchCategories(); // Atualiza a lista de categorias
        } catch (error) {
            console.error("Erro ao editar categoria:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center font-bold mb-2">Cadastro de Categorias</h1>
            <button className="btn btn-secondary mb-2" onClick={() => (window.location.href = "/home/surveys/surveycrud")}>
                Voltar
            </button>
            <Form className="mb-3">
                <Form.Group controlId="categoryName">
                    <Form.Label>Nome da Categoria</Form.Label>
                    <Form.Control type="text" placeholder="Digite o nome da categoria" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                </Form.Group>
                <Button className="mt-2" onClick={handleAddCategory}>
                    Adicionar Categoria
                </Button>
            </Form>

            <h2>Categorias Adicionadas</h2>
            {categories.length === 0 ? (
                <p>Nenhuma categoria adicionada ainda.</p>
            ) : (
                <ListGroup>
                    {categories.map((category) => (
                        <ListGroup.Item key={category.id} className="d-flex justify-content-between align-items-center">
                            {editingCategoryId === category.id ? (
                                <Form.Control type="text" value={editingCategoryName} onChange={(e) => setEditingCategoryName(e.target.value)} />
                            ) : (
                                <span>{category.name}</span>
                            )}

                            <div>
                                {editingCategoryId === category.id ? (
                                    <>
                                        <Button variant="success" className="me-2" onClick={() => handleEditCategory(category.id)}>
                                            Salvar
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setEditingCategoryId(null);
                                                setEditingCategoryName("");
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="warning"
                                            className="me-2"
                                            onClick={() => {
                                                setEditingCategoryId(category.id);
                                                setEditingCategoryName(category.name);
                                            }}
                                        >
                                            Editar
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDeleteCategory(category.id)}>
                                            Deletar
                                        </Button>
                                    </>
                                )}
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};

export default CategoryRegistration;
