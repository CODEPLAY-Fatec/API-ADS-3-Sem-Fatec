"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; 
import Cookie from "js-cookie";

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export default function Page() {
  const [userData, setUserData] = useState<DecodedToken | null>(null);

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

  if (!userData) {
    return <p>Carregando dados do usuário...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-12">Perfil pessoal</h1>
      <div className="flex flex-col lg:flex-row justify-between items-stretch mx-6 space-y-6 lg:space-y-0 lg:space-x-6">
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex flex-col space-y-6 h-full">
            <div className="h-1/2 bg-[#F7F7F7] rounded-lg flex items-center justify-center">
              <p className="text-gray-500">
                O usuário não possui dashboards no momento
              </p>
            </div>
            <div className="flex space-x-6 h-1/2">
              <div className="w-1/2 h-full bg-[#F7F7F7] rounded-lg flex items-center justify-center">
                <p className="text-gray-500">
                  O usuário não possui dashboards no momento
                </p>
              </div>
              <div className="w-1/2 h-full bg-[#F7F7F7] rounded-lg flex items-center justify-center">
                <p className="text-gray-500">
                  O usuário não possui dashboards no momento
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-[#F7F7F7] rounded-lg p-6 flex flex-col">
          <div className="flex flex-col items-center mt-8 lg:mt-16">
            <div className="w-32 h-32 lg:w-56 lg:h-56 bg-gray-300 rounded-full mb-4 lg:mb-6"></div>
            <h2 className="font-bold text-xl">{userData.name}</h2> 
          </div>

          <div className="text-left space-y-4 mt-4 pl-4 lg:pl-8">
            <p className="text-lg">
              <strong>ID:</strong> {userData.id}
            </p>
            <p className="text-lg">
              <strong>Email:</strong> {userData.email}
            </p>
            <p className="text-lg">
              <strong>Telefone:</strong> +5512999999999 {/* No futuro é so coletar o numero no login e colocar aqui nao tem numero no banco de dados ainda */}
            </p>
            <p className="text-lg">
              <strong>Times e funções:</strong> Operação {/* Em andamento essa funçao */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
