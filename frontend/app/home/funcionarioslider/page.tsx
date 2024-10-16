"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
import './funcionarioslider.css';

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
  const [loggedInUserTeams, setLoggedInUserTeams] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const token = Cookie.get("authToken") || Cookie.get("userToken");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);

        const fetchUsers = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api/users');
            const usersWithDetails = response.data.map((user: User) => ({
              ...user,
              teamRoles: user.teamRoles || [],
            }));
            setUsers(usersWithDetails);

            const loggedUserTeams = usersWithDetails.find((u: { id: number; }) => u.id === parseInt(decoded.id))?.teamRoles
              .filter((role: { role: string; }) => role.role === "Líder")
              .map((role: { team: string; }) => role.team) || [];
            setLoggedInUserTeams(loggedUserTeams);
          } catch (error: unknown) {
            if (error instanceof Error) {
              setError(error.message);
            } else {
              setError('Erro desconhecido');
            }
          }
        };

        fetchUsers();
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, []);

  if (error) {
    return <div>Erro ao carregar dados: {error}</div>;
  }

  const filteredUsers = users.filter(user =>
    user.teamRoles.some((role: TeamRole) =>
      loggedInUserTeams.includes(role.team) && role.role === "Membro"
    )
  ).filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center font-bold mb-4">Lista de membros das suas equipes</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Pesquisar seus liderados..."
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
                <p className="card-text"><strong>Times:</strong></p>
                <ul>
                  {user.teamRoles
                    .filter((teamRole) => loggedInUserTeams.includes(teamRole.team))
                    .map((teamRole, index) => (
                      <li key={index}>
                        {teamRole.team}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
