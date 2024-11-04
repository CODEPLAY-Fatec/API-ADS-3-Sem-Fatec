"use client";
import axios from "axios";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Cookie from "js-cookie";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

const Page: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = Cookie.get("authToken") || Cookie.get("userToken");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "currentPassword") setCurrentPassword(value);
    else if (name === "newPassword") setNewPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }

    if (!userId) {
      setMessage("Erro ao identificar o usuário. Por favor, faça login novamente.");
      return;
    }

    try {
        console.log(userId)
        console.log(currentPassword)
        console.log(newPassword)
        console.log(confirmPassword)

      const response = await axios.put("http://localhost:3001/api/change_password", {
        userId,
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setMessage(response.data.message || "Senha alterada com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setMessage("Erro ao alterar senha. Por favor, tente novamente.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto my-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Alterar Senha</h2>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
            <input
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
};

export default Page;
