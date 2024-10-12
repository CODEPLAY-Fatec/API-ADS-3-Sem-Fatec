"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Team {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

const TeamRegistration = () => {
    const [teamName, setTeamName] = useState('');
    const [leaderId, setLeaderId] = useState('');
    const [memberId, setMemberId] = useState('');
    const [teams, setTeams] = useState<Team[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [teamLeaders, setTeamLeaders] = useState<{ [key: number]: User[] }>({});
    const [teamMembers, setTeamMembers] = useState<{ [key: number]: User[] }>({});

    // Buscar times
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/team');
                setTeams(response.data);

                const leadersMap: { [key: number]: User[] } = {};
                const membersMap: { [key: number]: User[] } = {};

                await Promise.all(response.data.map(async (team: Team) => {
                    const leadersResponse = await axios.get(`http://localhost:3001/api/team/${team.id}/leaders`);
                    const membersResponse = await axios.get(`http://localhost:3001/api/team/${team.id}/members`);

                    leadersMap[team.id] = leadersResponse.data;
                    membersMap[team.id] = membersResponse.data;
                }));

                setTeamLeaders(leadersMap);
                setTeamMembers(membersMap);
            } catch (error) {
                console.error('Erro ao buscar times:', error);
            }
        };

        fetchTeams();
    }, []);

    // Buscar usuários
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/user');
                setUsers(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleCreateTeam = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/team', { name: teamName });
            setTeams([...teams, response.data]);
            setTeamLeaders({ ...teamLeaders, [response.data.id]: [] });
            setTeamMembers({ ...teamMembers, [response.data.id]: [] });
            setTeamName(''); 
        } catch (error) {
            console.error('Erro ao cadastrar time:', error);
        }
    };

    const handleAddLeader = async (teamId: number) => {
        try {
            await axios.post(`http://localhost:3001/api/team/${teamId}/leader`, { userId: leaderId });
            alert('Líder adicionado com sucesso!');
            setTeamLeaders({
                ...teamLeaders,
                [teamId]: [...teamLeaders[teamId], users.find(user => user.id === parseInt(leaderId))!]
            });
            setLeaderId('');
        } catch (error) {
            console.error('Erro ao adicionar líder:', error);
        }
    };

    const handleAddMember = async (teamId: number) => {
        try {
            await axios.post(`http://localhost:3001/api/team/${teamId}/member`, { userId: memberId });
            alert('Membro adicionado com sucesso!');
            setTeamMembers({
                ...teamMembers,
                [teamId]: [...teamMembers[teamId], users.find(user => user.id === parseInt(memberId))!]
            });
            setMemberId('');
        } catch (error) {
            console.error('Erro ao adicionar membro:', error);
        }
    };

    // Função para filtrar usuários disponíveis
    const getAvailableUsersForLeaders = (teamId: number) => {
        return users.filter(user => 
            !teamLeaders[teamId]?.some(leader => leader.id === user.id) &&
            !teamMembers[teamId]?.some(member => member.id === user.id)
        );
    };

    const getAvailableUsersForMembers = (teamId: number) => {
        return users.filter(user => 
            !teamMembers[teamId]?.some(member => member.id === user.id) &&
            !teamLeaders[teamId]?.some(leader => leader.id === user.id)
        );
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Cadastro de Times</h1>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nome do Time"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={handleCreateTeam}>Criar Time</button>
            </div>

            <h2>Times Cadastrados</h2>
            <div className="row">
                {teams.map((team) => (
                    <div key={team.id} className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{team.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Líderes:</h6>
                                <ul className="list-group mb-3">
                                    {teamLeaders[team.id]?.map(leader => (
                                        <li key={leader.id} className="list-group-item">{leader.name}</li>
                                    ))}

                                    <div className="mb-3">
                                        <select className="form-select" value={leaderId} onChange={(e) => setLeaderId(e.target.value)}>
                                            <option value="">Selecione um líder</option>
                                            {getAvailableUsersForLeaders(team.id).map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button className="btn btn-success mt-2" onClick={() => handleAddLeader(team.id)}>Adicionar Líder</button>
                                    </div>
                                </ul>

                                <h6 className="card-subtitle mb-2 text-muted">Membros:</h6>
                                <ul className="list-group mb-3">
                                    {teamMembers[team.id]?.map(member => (
                                        <li key={member.id} className="list-group-item">{member.name}</li>
                                    ))}

                                    <div className="mb-3">
                                        <select className="form-select" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
                                            <option value="">Selecione um membro</option>
                                            {getAvailableUsersForMembers(team.id).map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button className="btn btn-success mt-2" onClick={() => handleAddMember(team.id)}>Adicionar Membro</button>
                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamRegistration;
