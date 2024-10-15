// dashboard pessoal / usuário normal (pesquisas respondidas)
// dashboard de líder (respostas de autoavaliação de liderado, respostas de avaliação de liderado)
// dashboard de admin (tem acesso à avaliações de líderes)

// essa página vai ter apenas um dashboard, que exibe apenas os dados que o usuário logado possui acesso.
// ex: um líder tem acesso aos dados do dashboard pessoal + os dados de dashboard de líder.
// ex: um admin tem acesso aos dados do dashboard pessoal + os dados de dashboard de líder + os dados de dashboard de admin.

"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation"; 

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<DecodedToken | null>(null);
  const router = useRouter(); 

  useEffect(() => {
    const token = Cookie.get("authToken") || Cookie.get("userToken");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserData(decoded);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookie.remove("authToken"); 
    Cookie.remove("userToken"); 
    router.push("/");
  };

  const handleEvaluationClick = () => {
    router.push("/home/surveys/surveycrud"); 
  };

  const handleProfileClick = () => {
    router.push("/home/profile"); 
  };

  if (!userData) {
    return <p>Carregando dados do usuário...</p>;
  }

  return (
    <div className="h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboards</h1>

        <div className="flex items-center">
          {userData.isAdmin && ( // Botão de Avaliação visível apenas para admins
            <button
              onClick={handleEvaluationClick} // Função que redireciona para a página de pesquisas
              className="text-white bg-[#509CDB] px-4 py-2 rounded hover:bg-[#407CAD] mr-12" // Ajusta o espaçamento do botão Avaliações
              style={{ fontSize: "16px" }}
            >
              Avaliações
            </button>
          )}

          <img src="/images/bell logo.png" alt="Sino" className="w-8 h-8 mx-4" /> 
          
          <button
            onClick={handleLogout} // Função de logout no botão
            className="text-black bg-transparent hover:bg-gray-100"
            style={{
              width: "160px",
              height: "50px",
              fontSize: "16px",
            }}
          >
            Sair
          </button>
        </div>
      </div>

      <div className="flex justify-between mx-6 space-x-6 h-[calc(95vh-8rem)]">
        <div className="w-1/2 h-full bg-[#152259] rounded-lg flex items-center justify-center">
          <p className="text-[#32ADE6]">Não há dashboards disponíveis no momento</p>
        </div>

        
        <div className="w-1/2 h-full flex flex-col space-y-6">
          <div className="flex space-x-6 h-1/2">
            <div className="w-1/2 bg-[#152259] rounded-lg flex items-center justify-center">
              <p className="text-[#32ADE6]">Não há dashboards disponíveis no momento</p>
            </div>

            
            <div
              onClick={handleProfileClick} // Função que redireciona ao perfil
              className="w-1/2 bg-[#152259] rounded-lg p-6 flex flex-col justify-center space-y-6 cursor-pointer hover:bg-[#1a3460]" // Adicionando cursor de pointer e efeito hover
            >
              <div className="w-44 h-44 bg-gray-300 rounded-full mx-auto"></div> 
              <div className="text-left space-y-2">
                <h2 className="text-white text-xl font-bold">Nome: {userData.name}</h2>
                <p className="text-white text-lg">ID: {userData.id}</p>
                <p className="text-white text-lg">Email: {userData.email}</p>
              </div>
            </div>
          </div>

          {/* Card maior embaixo com texto de categorias */}
          <div className="h-1/2 bg-[#152259] rounded-lg flex items-center justify-center">
            <p className="text-[#32ADE6]">Não há categorias disponíveis no momento</p>
          </div>
        </div>
      </div>
    </div>
  );
}
