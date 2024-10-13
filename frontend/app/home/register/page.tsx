"use client";
import React, { useState } from "react";

const Page: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        try {
            const response = await fetch('http://localhost:3001/api/users', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, isAdmin }),
            });

            if (!response.ok) {
                throw new Error('Erro ao criar usuário');
            }

            const newUser = await response.json();
            setSuccess(`Usuário ${newUser.name} criado com sucesso!`);
            setError('');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Erro desconhecido'); 
            }
            setSuccess('');
        }
    };

    return (
        <div>
            <h1 className="text-center font-bold mb-4">Cadastro de Usuários</h1>
            <form className="p-4 mb-3 bg-light rounded shadow-sm" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Nome
                    </label>
                    <input 
                        type="text" 
                        id="name" 
                        className="form-control" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        E-mail
                    </label>
                    <input 
                        type="email" 
                        id="email" 
                        className="form-control" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Senha
                    </label>
                    <input 
                        type="password" 
                        id="password" 
                        className="form-control" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-check mb-3">
                    <input 
                        type="checkbox" 
                        id="isAdmin" 
                        className="form-check-input" 
                        checked={isAdmin}
                        onChange={() => setIsAdmin(!isAdmin)}
                    />
                    <label htmlFor="isAdmin" className="form-check-label">
                        Admin
                    </label>
                </div>

                <button type="submit" className="btn btn-success">
                    Criar Usuário
                </button>
            </form>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
        </div>
    );
};

export default Page;


