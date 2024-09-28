import axios from "axios";
import React, { useEffect, useState } from "react";
import UserCard from "./components/UserCard";
import UserForm from "./components/UserForm";

const App = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [availableLeaders, setAvailableLeaders] = useState([]);

    console.log("Available leaders:", availableLeaders);
    console.log("Users:", users);

    useEffect(() => {
        fetchUsers();
        fetchLeaders();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3001/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    };

    const fetchLeaders = async () => {
        try {
            const response = await fetch("http://localhost:3001/leaders");
            const data = await response.json();
            setAvailableLeaders(data);
        } catch (error) {
            console.error("Erro ao buscar líderes:", error);
        }
    };

    const handleCreateUser = async (user) => {
        try {
            if (editingUser) {
                await axios.put(`http://localhost:3001/users/${editingUser.id}`, user);
            } else {
                await axios.post("http://localhost:3001/users", user);
            }
            fetchUsers();
            setEditingUser(null); // Reset the form after saving
        } catch (error) {
            console.error("Erro ao salvar usuário:", error);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setAvailableLeaders(users.filter((u) => u.isLeader && u.id !== user.id)); // Exclui o próprio usuário da lista de líderes disponíveis
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:3001/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Gerenciamento de Usuários</h1>

            <UserForm onSubmit={handleCreateUser} availableLeaders={availableLeaders} editingUser={editingUser} />

            <div className="row mt-4">
                {users.map((user) => (
                    <div key={user.id} className="col-md-4">
                        <UserCard user={user} onEdit={handleEditUser} onDelete={handleDeleteUser} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
