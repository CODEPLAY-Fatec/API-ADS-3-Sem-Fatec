"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
import './myteams.css';

interface Team {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

interface TeamDetails {
    leaders: User[];
    members: User[];
}

interface DecodedToken {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

const Page = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [teamDetails, setTeamDetails] = useState<{ [key: number]: TeamDetails }>({});
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const token = Cookie.get("authToken") || Cookie.get("userToken");

        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setUserId(decoded.id);
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    useEffect(() => {
        const fetchTeams = async () => {
            if (!userId) return; 

            try {
                const response = await axios.get(`http://localhost:3001/api/user/${userId}/teams`);
                setTeams(response.data);

                const detailsMap: { [key: number]: TeamDetails } = {};
                await Promise.all(response.data.map(async (team: Team) => {
                    const [leadersResponse, membersResponse] = await Promise.all([
                        axios.get(`http://localhost:3001/api/team/${team.id}/leaders`),
                        axios.get(`http://localhost:3001/api/team/${team.id}/members`)
                    ]);
                    detailsMap[team.id] = {
                        leaders: leadersResponse.data,
                        members: membersResponse.data
                    };
                }));

                setTeamDetails(detailsMap);
            } catch (error) {
                console.error('Erro ao buscar times:', error);
            }
        };

        fetchTeams();
    }, [userId]);

    const filteredTeams = teams.filter(team => 
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h1 className="font-bold text-center">Meus times</h1>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Pesquisar times por nome"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredTeams.length === 0 ? (
                <div style={{ padding: "50px", border: "1px solid #ddd", borderRadius: "10px", textAlign: "center", backgroundColor: "#f9f9f9" }}>
                    <p style={{ fontSize: "20px", fontWeight: "bold" }}>Sem times que você faz parte até o momento</p> 
                    <p style={{ fontSize: "16px" }}>Os times que você participar aparecerão aqui.</p> 
                </div>
            ) : (
                <div className="row">
                    {filteredTeams.map((team) => (
                        <div key={`team-${team.id}`} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{team.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Líderes:</h6>
                                    <ul className="list-group mb-3">
                                        {teamDetails[team.id]?.leaders.length > 0 ? (
                                            teamDetails[team.id].leaders.map(leader => (
                                                <li key={`leader-${team.id}-${leader.id}`} className="list-group-item d-flex justify-content-between align-items-center">
                                                    {leader.name}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="list-group-item">Sem líderes no momento</li>
                                        )}
                                    </ul>

                                    <h6 className="card-subtitle mb-2 text-muted">Membros:</h6>
                                    <ul className="list-group mb-3">
                                        {teamDetails[team.id]?.members.length > 0 ? (
                                            teamDetails[team.id].members.map(member => (
                                                <li key={`member-${team.id}-${member.id}`} className="list-group-item d-flex justify-content-between align-items-center">
                                                    {member.name}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="list-group-item">Sem membros no momento</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Page;
