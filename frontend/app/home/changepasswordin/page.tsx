"use client";
import axios from "axios";
import React, { ChangeEvent, FormEvent } from "react";

interface DecodedToken {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  }

interface PageState {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    message: string;
}

export default class Page extends React.Component<{}, PageState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            message: ""
        };
    }

    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ [event.target.name]: event.target.value } as unknown as PageState);
    };

    handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const { currentPassword, newPassword, confirmPassword } = this.state;
        const userId = /* Obtenha o userId aqui */;

        if (newPassword !== confirmPassword) {
            this.setState({ message: "As senhas não coincidem." });
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/change_password", {
                userId,
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword
            });

            this.setState({ message: response.data.message || "Senha alterada com sucesso!" });
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            this.setState({ message: "Erro ao alterar senha. Por favor, tente novamente." });
        }
    };

    render() {
        const { currentPassword, newPassword, confirmPassword, message } = this.state;

        return (
            <div className="h-screen flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto my-auto">
                    <h2 className="text-2xl font-bold text-center mb-6">Alterar Senha</h2>
                    {message && <p className="text-center text-red-500 mb-4">{message}</p>}
                    <form onSubmit={this.handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={currentPassword}
                                onChange={this.handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={newPassword}
                                onChange={this.handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={this.handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Alterar Senha
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}
