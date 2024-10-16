"use client";
import React from "react";
export default class Page extends React.Component {
    //logica da página
    render() {
        return (
            <div className="bg-gray-100 h-screen flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto my-auto">
                    <h2 className="text-2xl font-bold text-center mb-6">Alterar Senha</h2>
                    <form action="/change_password" method="POST">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
                            <input type="password" name="current_password" className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                            <input type="password" name="new_password" className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                            <input type="password" name="confirm_password" className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Alterar Senha</button>
                    </form>
                </div>
            </div>
        )
    }
}