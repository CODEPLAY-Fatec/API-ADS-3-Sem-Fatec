"use client";
import './funcionarios.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";

interface TeamRole {
  team: string;
  role: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  teamRoles: TeamRole[];
}

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUserName, setLoggedInUserName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const token = Cookie.get("authToken") || Cookie.get("userToken");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setLoggedInUserName(decoded.name);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }

    // Busca os usuários do backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users');
        const usersWithDetails = response.data.map((user: User) => ({
          ...user,
          teamRoles: user.teamRoles || [],
        }));
        setUsers(usersWithDetails);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido');
        }
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <div>Erro ao carregar dados: {error}</div>;
  }

  // Função para filtrar usuários com base no termo de pesquisa
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className=" text-center font-bold mb-4">Lista de Funcionários</h1>
      
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Pesquisar funcionários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <div className="employee-list">
        {filteredUsers
          .filter(user => user.name !== loggedInUserName)
          .map(user => (
            <div key={user.id} className="employee-card card mb-3">
              <div className="card-body">
                <h3 className="card-title">{user.name}</h3>
                <p className="card-text"><strong>Email:</strong> {user.email}</p>
                <p className="card-text"><strong>Função:</strong> {user.isAdmin ? "Admin" : "Usuário"}</p>
                <p className="card-text"><strong>Times:</strong></p>
                <ul>
                  {user.teamRoles.map((teamRole, index) => (
                    <li key={index}>
                      {teamRole.team} ({teamRole.role})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
