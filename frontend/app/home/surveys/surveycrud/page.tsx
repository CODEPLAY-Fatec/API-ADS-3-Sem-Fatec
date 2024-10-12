"use client";
import React, { useState, useEffect } from "react";

export default function Page() {
    const [inputValue, setInputValue] = useState<string>(""); 
    const [questions, setQuestions] = useState<string[]>([]); 

    useEffect(() => {
        const storedQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
        setQuestions(storedQuestions);
    }, []);

    const handleAddQuestion = () => {
        if (inputValue) {
            // Obter perguntas salvas anteriormente
            const existingQuestions = JSON.parse(localStorage.getItem("questions") || "[]");

            // Adicionar a nova pergunta
            const updatedQuestions = [...existingQuestions, inputValue];

            // Salvar de volta no localStorage
            localStorage.setItem("questions", JSON.stringify(updatedQuestions));

            // Atualizar o estado para refletir as novas perguntas
            setQuestions(updatedQuestions);

            // Limpar o campo de texto após adicionar
            setInputValue("");
        }
    };

    // Função para excluir uma pergunta
    const handleDeleteQuestion = (index: number) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);

        localStorage.setItem("questions", JSON.stringify(updatedQuestions));

        setQuestions(updatedQuestions);
    };

    return (
        <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
            {/* Conteúdo Principal */}
            <div style={{ width: "80%", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2>Avaliação</h2>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {/* Ícone de Notificação */}
                        <button style={{ background: "none", border: "none", marginRight: "20px" }}>
                            <img src="/images/sinos.png" alt="Notificações" style={{ width: "24px", height: "24px" }} />
                        </button>
                        {/* Botão de Sair */}
                        <button
                            onClick={() => alert("Logout")}
                            style={{
                                background: "none",
                                color: "black", 
                                border: "none",
                                textDecoration: "underline",
                                cursor: "pointer",
                                padding: "0",
                                fontSize: "16px" 
                            }}
                        >
                            Sair
                        </button>
                    </div>
                </div>

                {/* Botão Adicionar acima da Caixa de Texto */}
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                    <button
                        onClick={handleAddQuestion} 
                        style={{ backgroundColor: "#00aaff", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", marginBottom: "10px" }}
                    >
                        Adicionar
                    </button>
                </div>

                {/* Caixa de texto Inserir Pergunta */}
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Inserir pergunta"
                        style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", marginRight: "10px" }}
                    />
                </div>

                {/* Lista de Perguntas Adicionadas */}
                <div style={{ marginTop: "20px" }}>
                    {questions.length > 0 ? (
                        <ul>
                            {questions.map((question: string, index: number) => (
                                <li
                                    key={index}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "15px 10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "10px",
                                        backgroundColor: "#f5f5f5",
                                        marginBottom: "10px",
                                    }}
                                >
                                    {/* Radio button e Pergunta */}
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            style={{ marginRight: "10px" }}
                                        />
                                        {question}
                                    </div>

                                    {/* Botão Excluir */}
                                    <button
                                        onClick={() => handleDeleteQuestion(index)}
                                        style={{
                                            backgroundColor: "darkred",
                                            color: "white",
                                            border: "none",
                                            padding: "5px 10px",  
                                            fontSize: "12px",     
                                            borderRadius: "3px",  
                                            cursor: "pointer",
                                            height: "30px",      
                                            width: "60px",        
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                    >
                                        Excluir
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div style={{ padding: "50px", border: "1px solid #ddd", borderRadius: "10px", textAlign: "center", backgroundColor: "#f9f9f9" }}>
                            <p style={{ fontSize: "20px", fontWeight: "bold" }}>Nenhuma pergunta até o momento</p>
                            <p style={{ fontSize: "16px" }}>As perguntas cadastradas aqui irão aparecer na avaliação.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
