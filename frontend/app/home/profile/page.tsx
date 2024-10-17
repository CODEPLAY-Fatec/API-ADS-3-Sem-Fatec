"use client";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
import axios from "axios";

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface TeamRole {
  team: string;
  role: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  teamRoles: TeamRole[];
}

export default function Page() {
  const [userData, setUserData] = useState<DecodedToken | null>(null);
  const [userTeams, setUserTeams] = useState<TeamRole[]>([]);

  useEffect(() => {
    const token = Cookie.get("authToken") || Cookie.get("userToken");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserData(decoded);

        axios.get("http://localhost:3001/api/users")
          .then(response => {
            const allUsers: UserData[] = response.data;

            const currentUser = allUsers.find(user => user.id === decoded.id);
            if (currentUser) {
              setUserTeams(currentUser.teamRoles);
            }
          })
          .catch(error => {
            console.error("Erro ao buscar os times do usuário:", error);
          });
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, []);

  if (!userData) {
    return <p>Carregando dados do usuário...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-12">Perfil pessoal</h1>
      <div className="flex flex-col lg:flex-row justify-between items-stretch mx-6 space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Seção com as caixas */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex flex-col space-y-6 h-full">
            {/* Caixa grande no topo */}
            <div className="h-1/2 bg-white rounded-lg flex items-center justify-center shadow-lg border border-gray-300">
              <p className="text-gray-500">
                O usuário não possui dashboards no momento
              </p>
            </div>
            {/* Duas caixas lado a lado */}
            <div className="flex space-x-6 h-1/2">
              <div className="w-1/2 h-full bg-white rounded-lg flex items-center justify-center shadow-lg border border-gray-300">
                <p className="text-gray-500">
                  O usuário não possui dashboards no momento
                </p>
              </div>
              <div className="w-1/2 h-full bg-white rounded-lg flex items-center justify-center shadow-lg border border-gray-300">
                <p className="text-gray-500">
                  O usuário não possui dashboards no momento
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção do perfil */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg p-6 flex flex-col shadow-lg border border-gray-300">
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
              <strong>Nível de acesso:</strong> {userData.isAdmin ? "Admin" : "Membro"}
            </p>
            <p className="text-lg">
              <strong>Times:</strong> 
              {userTeams.length > 0 ? (
                userTeams.map((teamRole, index) => (
                  <span key={index}>{teamRole.team} ({teamRole.role}){index < userTeams.length - 1 ? ", " : ""}</span>
                ))
              ) : (
                "Nenhum time associado"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
