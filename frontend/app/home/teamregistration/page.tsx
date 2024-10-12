"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Collapse } from 'react-bootstrap';

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
    const [teams, setTeams] = useState<Team[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [teamLeaders, setTeamLeaders] = useState<{ [key: number]: User[] }>({});
    const [teamMembers, setTeamMembers] = useState<{ [key: number]: User[] }>({});
    const [open, setOpen] = useState<{ [key: number]: boolean }>({});
    const [leaderIds, setLeaderIds] = useState<{ [key: number]: string }>({});
    const [memberIds, setMemberIds] = useState<{ [key: number]: string }>({});
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    // Fetch teams
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

    // Fetch users
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
        if (!teamName.trim()) {
            setFeedbackMessage('O nome do time não pode estar vazio.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/team', { name: teamName });
            const newTeam = response.data;

            setTeams((prevTeams) => [...prevTeams, newTeam]);
            setTeamLeaders((prevLeaders) => ({ ...prevLeaders, [newTeam.id]: [] }));
            setTeamMembers((prevMembers) => ({ ...prevMembers, [newTeam.id]: [] }));
            setTeamName('');
            setFeedbackMessage('Time criado com sucesso!');
        } catch (error) {
            console.error('Erro ao cadastrar time:', error);
            setFeedbackMessage('Erro ao cadastrar time. Tente novamente.');
        }
    };

    const handleAddLeader = async (teamId: number) => {
        try {
            await axios.post(`http://localhost:3001/api/team/${teamId}/leader`, { userId: leaderIds[teamId] });
            const newLeader = users.find(user => user.id === parseInt(leaderIds[teamId]));
            if (newLeader) {
                setTeamLeaders(prev => ({
                    ...prev,
                    [teamId]: [...prev[teamId], newLeader]
                }));
            }
            setLeaderIds(prev => ({ ...prev, [teamId]: '' }));
            setFeedbackMessage('Líder adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar líder:', error);
            setFeedbackMessage('Erro ao adicionar líder. Tente novamente.');
        }
    };

    const handleAddMember = async (teamId: number) => {
        try {
            await axios.post(`http://localhost:3001/api/team/${teamId}/member`, { userId: memberIds[teamId] });
            const newMember = users.find(user => user.id === parseInt(memberIds[teamId]));
            if (newMember) {
                setTeamMembers(prev => ({
                    ...prev,
                    [teamId]: [...prev[teamId], newMember]
                }));
            }
            setMemberIds(prev => ({ ...prev, [teamId]: '' }));
            setFeedbackMessage('Membro adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar membro:', error);
            setFeedbackMessage('Erro ao adicionar membro. Tente novamente.');
        }
    };

    const handleRemoveTeam = async (teamId: number) => {
        try {
            await axios.delete(`http://localhost:3001/api/team/${teamId}`);
            setTeams(teams.filter(team => team.id !== teamId));
            setFeedbackMessage('Time removido com sucesso!');
        } catch (error) {
            console.error('Erro ao remover time:', error);
            setFeedbackMessage('Erro ao remover time. Tente novamente.');
        }
    };

    const handleRemoveUser = async (teamId: number, userId: number, type: 'leader' | 'member') => {
        try {
            await axios.delete(`http://localhost:3001/api/team/${teamId}/user/${userId}`);
            if (type === 'leader') {
                setTeamLeaders(prev => ({
                    ...prev,
                    [teamId]: prev[teamId].filter(user => user.id !== userId)
                }));
            } else {
                setTeamMembers(prev => ({
                    ...prev,
                    [teamId]: prev[teamId].filter(user => user.id !== userId)
                }));
            }
            setFeedbackMessage(`${type === 'leader' ? 'Líder' : 'Membro'} removido com sucesso!`);
        } catch (error) {
            console.error('Erro ao remover usuário do time:', error);
            setFeedbackMessage(`Erro ao remover ${type === 'leader' ? 'líder' : 'membro'}. Tente novamente.`);
        }
    };

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
            {feedbackMessage && <div className="alert alert-info">{feedbackMessage}</div>}
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
                    <div key={`team-${team.id}`} className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5
                                        className="card-title"
                                        onClick={() => setOpen({ ...open, [team.id]: !open[team.id] })}
                                    >
                                        {team.name}
                                    </h5>
                                    <button className="btn btn-danger" onClick={() => handleRemoveTeam(team.id)}>
                                        Remover Time
                                    </button>
                                </div>
                                <Collapse in={open[team.id]}>
                                    <div>
                                        <h6 className="card-subtitle mb-2 text-muted">Líderes:</h6>
                                        <ul className="list-group mb-3">
                                            {teamLeaders[team.id]?.map(leader => (
                                                <li key={`leader-${team.id}-${leader.id}`} className="list-group-item d-flex justify-content-between align-items-center">
                                                    {leader.name}
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleRemoveUser(team.id, leader.id, 'leader')}
                                                    >
                                                        Remover
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mb-3">
                                            <select
                                                className="form-select"
                                                value={leaderIds[team.id] || ''}
                                                onChange={(e) => setLeaderIds({ ...leaderIds, [team.id]: e.target.value })}
                                            >
                                                <option value="">Selecionar Líder</option>
                                                {getAvailableUsersForLeaders(team.id).map(user => (
                                                    <option key={`available-leader-${team.id}-${user.id}`} value={user.id}>
                                                        {user.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button className="btn btn-success mt-2" onClick={() => handleAddLeader(team.id)}>Adicionar Líder</button>
                                        </div>

                                        <h6 className="card-subtitle mb-2 text-muted">Membros:</h6>
                                        <ul className="list-group">
                                            {teamMembers[team.id]?.map(member => (
                                                <li key={`member-${team.id}-${member.id}`} className="list-group-item d-flex justify-content-between align-items-center">
                                                    {member.name}
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleRemoveUser(team.id, member.id, 'member')}
                                                    >
                                                        Remover
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mb-3">
                                            <select
                                                className="form-select"
                                                value={memberIds[team.id] || ''}
                                                onChange={(e) => setMemberIds({ ...memberIds, [team.id]: e.target.value })}
                                            >
                                                <option value="">Selecionar Membro</option>
                                                {getAvailableUsersForMembers(team.id).map(user => (
                                                    <option key={`available-member-${team.id}-${user.id}`} value={user.id}>
                                                        {user.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button className="btn btn-success mt-2" onClick={() => handleAddMember(team.id)}>Adicionar Membro</button>
                                        </div>
                                    </div>
                                </Collapse>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamRegistration;
