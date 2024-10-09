"use client";
import React from "react";

export default class Page extends React.Component {
    render() {
        return (
            <div>
                <h1>Cadastro de Usuários</h1>
                <form className="p-4 mb-3 bg-light rounded shadow-sm">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Nome
                        </label>
                        <input type="text" id="name" name="name" className="form-control" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            E-mail
                        </label>
                        <input type="text" id="email" name="email" className="form-control" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Senha
                        </label>
                        <input type="password" id="password" name="password" className="form-control" />
                    </div>

                    <div className="form-check mb-3">
                        <input type="checkbox" id="isAdmin" name="isAdmin" className="form-check-input" />
                        <label htmlFor="isAdmin" className="form-check-label">
                            Admin
                        </label>
                    </div>

                    <button type="submit" className="btn btn-success">
                        Criar Usuário
                    </button>
                </form>
            </div>
        );
    }
}
