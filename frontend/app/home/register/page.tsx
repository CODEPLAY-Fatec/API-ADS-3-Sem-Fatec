"use client";
import React, { useState } from "react";

const Page: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>(''); 
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [photo, setPhoto] = useState<File | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phoneNumber', phoneNumber);
        formData.append('isAdmin', isAdmin ? '1' : '0'); // Convert boolean to numeric string
        if (photo) {
            formData.append('photo', photo);
        }

        // Log FormData content
        

        try {
            const response = await fetch('/api/users', { 
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                
                if (response.status === 400 && errorData.error) {
                    throw new Error(errorData.error); 
                } else {
                    throw new Error('Erro ao criar usuário'); 
                }
            }

            const newUser = await response.json();
            setSuccess(`Usuário ${newUser.name} criado com sucesso!`);
            setError('');
            setName('');
            setEmail('');
            setPassword('');
            setPhoneNumber('');
            setIsAdmin(false);
            setPhoto(null);
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
        <div className="d-flex mt-4 align-middle flex-col md:m-auto">
            <h1 className="text-center font-bold mb-4">Cadastro de Usuários</h1>
            <form className="p-4 mb-3 w-max m-auto bg-light rounded shadow-sm" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Nome
                    </label>
                    <input 
                        type="text" 
                        id="name" 
                        className="form-control" 
                        placeholder="Insira seu nome aqui"
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
                        placeholder="Insira seu email aqui, Ex:seuemail@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                        Telefone
                    </label>
                    <input 
                        type="tel" 
                        id="phoneNumber" 
                        className="form-control" 
                        placeholder="Insira seu número de telefone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
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
                        placeholder="Insira sua senha aqui"
                        className="form-control" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="photo" className="form-label">
                        Foto
                    </label>
                    <input 
                        type="file" 
                        id="photo" 
                        className="form-control" 
                        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
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
