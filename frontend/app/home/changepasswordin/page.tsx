"use client"; 
import axios from "axios";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";

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
  const [isSuccess, setIsSuccess] = useState(false); // Indica se a mensagem é de sucesso
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookie.get("authToken") || Cookie.get("userToken");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        setMessage("Token inválido. Por favor, faça login novamente.");
      }
    } else {
      setMessage("Você precisa estar logado para alterar a senha.");
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

    // Verificação do comprimento mínimo de 6 caracteres para nova senha e confirmação
    if (newPassword.length < 6 || confirmPassword.length < 6) {
      setMessage("A nova senha deve ter pelo menos 6 caracteres.");
      setIsSuccess(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      setIsSuccess(false);
      return;
    }

    if (!userId) {
      setMessage("Erro ao identificar o usuário. Por favor, faça login novamente.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put("/api/change_password", {
        userId,
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setMessage(response.data.message || "Senha alterada com sucesso!");
      setIsSuccess(true); // Define a mensagem como sucesso (verde)

      // Limpa os campos de entrada após a atualização bem-sucedida
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setMessage("Erro ao alterar senha. Por favor, tente novamente.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[400px] mx-4 md:mx-auto my-auto">
        <h2 className="text-xl font-semibold text-center mb-4">Alterar Senha</h2>
        {message && (
          <p className={`text-center mb-3 ${isSuccess ? "text-green-500" : "text-red-500"} text-sm`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} aria-live="assertive">
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Senha Atual</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={currentPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-2 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nova Senha</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-2 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-2 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
              aria-required="true"
            />
          </div>
          <button
          type="submit"
          className="w-full text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ backgroundColor: "#357edd" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2d6dc2")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#357edd")}
          disabled={loading}
            >
          {loading ? "Alterando..." : "Alterar Senha"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
