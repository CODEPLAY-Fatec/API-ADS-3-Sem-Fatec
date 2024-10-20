"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import Cookie from "js-cookie";
import './funcionarios.css';

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
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

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

  const handleDeleteUser = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${id}`);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      setConfirmDelete(null); 
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      setError('Erro ao excluir usuário');
    }
  };

  if (error) {
    return <div>Erro ao carregar dados: {error}</div>;
  }

  // Filtrar usuários antes de excluir o usuário logado
  const filteredUsers = users
    .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase())) // Filtro de busca por nome
    .filter(user => user.name !== loggedInUserName); // Excluir o usuário logado

  return (
    <div className="container mt-4">
      <h1 className="text-center font-bold mb-4">Lista de Funcionários</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Pesquisar funcionários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div style={{ padding: "50px", border: "1px solid #ddd", borderRadius: "10px", textAlign: "center", backgroundColor: "#f9f9f9" }}>
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>Sem funcionários cadastrados no momento</p>
          <p style={{ fontSize: "16px" }}>Os funcionários cadastrados aparecerão aqui.</p>
        </div>
      ) : (
        <div className="employee-list">
          {filteredUsers.map(user => (
            <div key={user.id} className="employee-card card mb-3">
              <div className="card-body">
                <h3 className="card-title">{user.name}</h3>
                <p className="card-text"><strong>Email:</strong> {user.email}</p>
                <p className="card-text"><strong>Função:</strong> {user.isAdmin ? "Admin" : "Usuário"}</p>
                <p className="card-text"><strong>Times:</strong></p>
                <ul>
                  {user.teamRoles.length > 0 ? (
                    user.teamRoles.map((teamRole, index) => (
                      <li key={index}>
                        {teamRole.team} ({teamRole.role})
                      </li>
                    ))
                  ) : (
                    <li>Não participa de nenhum time no momento</li>
                  )}
                </ul>
                <button
                  className="btn btn-danger"
                  onClick={() => setConfirmDelete(user.id)}
                >
                  Excluir usuário
                </button>
                {confirmDelete === user.id && (
                  <div className="alert alert-warning mt-2">
                    Tem certeza?
                    <button
                      className="btn btn-primary ms-2"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Sim
                    </button>
                    <button
                      className="btn btn-secondary ms-2"
                      onClick={() => setConfirmDelete(null)}
                    >
                      Não
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
