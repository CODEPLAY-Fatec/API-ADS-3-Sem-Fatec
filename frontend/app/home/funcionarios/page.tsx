"use client";
import './funcionarios.css'
import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  teams: string;
  role: string;
}

//arrumar o jeito q pesquisa no backend(puxando a funçao dele nos times q ele pertence) e adicionar a barra de pesquisa

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users'); // Altere para a rota correta do seu backend
        setUsers(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
            setError(error.message);
        } else {
            setError('Erro desconhecido'); // Caso o erro não seja uma instância de Error
        }
    }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <div>Erro ao carregar dados: {error}</div>;
  }

  return (
    <div>
      <h1>Lista de Funcionários</h1>
      <div className="employee-list">
        {users.map(user => (
          <div key={user.id} className="employee-card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Função: {user.isAdmin ? "Admin" : user.role}</p>
            <p>Times: {user.teams || "Nenhum time"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
