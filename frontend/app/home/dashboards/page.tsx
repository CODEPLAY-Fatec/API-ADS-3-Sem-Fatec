"use client";

import SurveyGraphs from "@/components/surveyGraphs";
import { Answer, BaseSurvey } from "@/types/dashboard";
import { Dashboardsurvey } from "@/types/Survey";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import html2canvas from "html2canvas";
import Cookie from "js-cookie";
import { jsPDF } from "jspdf";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import "./dahsboards.css";

let ExampleProps = {
    Dashboardsurvey: {
        BaseSurvey: {
            last_category: "Autoavaliação",
            uid: 11,
            title: "TESTER",
            description: "TESTERDESC",
            questions: [
                {
                    type: "Single(number)",
                    options: ["1", "2"],
                    category: "HARD",
                    question: "HARD1",
                    categoryId: 3,
                },
                {
                    type: "Single(number)",
                    options: ["11", "12"],
                    category: "HARD",
                    question: "HARD2",
                    categoryId: 3,
                },
                {
                    type: "Multiple",
                    options: ["UM", "DOIS"],
                    category: "HARD",
                    question: "HARD3",
                    categoryId: 3,
                },
                {
                    type: "Single(number)",
                    options: ["1", "2"],
                    category: "SOFT",
                    question: "SOFT1",
                    categoryId: 2,
                },
                {
                    type: "Single(number)",
                    options: ["11", "12"],
                    category: "SOFT",
                    question: "SOFT2",
                    categoryId: 2,
                },
                {
                    type: "Single(text)",
                    options: ["UM", "DOIS"],
                    category: "SOFT",
                    question: "SOFT3",
                    categoryId: 2,
                },
            ],
        },
        Answers: [
            {
                answer_id: 10,
                user_id: 1,
                survey_id: 10,
                survey_uid: 11,
                created: new Date("2024-12-03T03:00:00.000Z"),
                data: [
                    {
                        type: "Single(number)",
                        answer: "2",
                        options: ["1", "2"],
                        question: "HARD1",
                    },
                    {
                        type: "Single(number)",
                        answer: "12",
                        options: ["11", "12"],
                        question: "HARD2",
                    },
                    {
                        type: "Multiple",
                        answer: "DOIS",
                        options: ["UM", "DOIS"],
                        question: "HARD3",
                    },
                    {
                        type: "Single(number)",
                        answer: "2",
                        options: ["1", "2"],
                        question: "SOFT1",
                    },
                    {
                        type: "Single(number)",
                        answer: "12",
                        options: ["11", "12"],
                        question: "SOFT2",
                    },
                    {
                        type: "Single(text)",
                        answer: "DOIS",
                        options: ["UM", "DOIS"],
                        question: "SOFT3",
                    },
                ],
                target_id: undefined,
                category: "Autoavaliação",
                base_survey: {
                    id: undefined,
                    title: "",
                    description: "",
                    last_category: "Autoavaliação",
                    questions: [],
                    target_id: undefined,
                    uid: undefined,
                },
                instance_created: new Date("2024-12-03T03:00:00.000Z"),
            },
        ],
    },
    SelectedCategory: "HARD",
};

// dadas as respostas, o que fazer?
// iterar pelas perguntas:
// se a pergunta for de tipo numérico
// adicionar ao gráfico de barras a média das respostas dessa pergunta
// adicionar ao gráfico de pizza quantas vezes cada opção foi selecionada
// caso tenha uma categoria, adicionar entrada ao gráfico de tempo
// IMPORTANTE: DETALHAMENTO SOBRE OS GRÁFICOS DA PÁGINA
// o gráfico de barras é dedicado a mostrar a média das respostas de perguntas numéricas ?
// o gráfico de pizza é dedicado a mostrar o número de vezes que cada resposta apareceu em uma determinada pergunta
// o gráfico de tempo/linha mostra a progressão de uma pergunta de uma categoria ao longo do tempo
//

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

interface Team {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
    phoneNumber: string;
    teamRoles: TeamRole[];
    photo?: string;
}

const data01 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
];

export default function Page() {
    const [users, setUsers] = useState<User[]>([]);
    const [teams, setTeams] = useState<{ [key: number]: Team[] }>({});
    const [baseSurveys, setBaseSurveys] = useState<{
        [key: number]: Dashboardsurvey[];
    }>({});
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [openUserId, setOpenUserId] = useState<number | null>(null);
    const [surveyAnswers, setSurveyAnswers] = useState<Answer[]>([]);
    const [selectedSurveyUid, setSelectedSurveyUid] = useState<number | null>(null);
    const [surveyCategories, setSurveyCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [baseSurvey, setBaseSurvey] = useState<BaseSurvey | null>(null);
    const [graphElement, setGraphElement] = useState<React.ReactNode>(null);

    //pega os usuarios e filtra eles com base em qm esta logado
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = Cookie.get("authToken") || Cookie.get("userToken");
                if (token) {
                    const decoded = jwtDecode<DecodedToken>(token);

                    const response = await axios.get("/api/users");
                    const allUsers = response.data;

                    if (decoded.isAdmin) {
                        setUsers(
                            allUsers
                            //allUsers.filter((user: User) => user.id !== parseInt(decoded.id)),
                        ); // Admin vê todos os usuários exceto ele mesmo
                    } else {
                        // Filtrar times liderados pelo usuário logado
                        const loggedUserTeams =
                            allUsers
                                .find((u: User) => u.id === parseInt(decoded.id))
                                ?.teamRoles.filter((role: TeamRole) => role.role === "Líder")
                                .map((role: TeamRole) => role.team) || [];

                        // Filtrar apenas membros de times liderados
                        const filteredUsers = allUsers
                            .filter((user: User) => user.teamRoles.some((role: TeamRole) => loggedUserTeams.includes(role.team) && role.role === "Membro"))
                            .filter((user: User) => user.id !== parseInt(decoded.id)); // Excluir o próprio usuário
                        setUsers(filteredUsers);
                    }
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Erro desconhecido");
                }
            }
        };

        fetchUsers();
    }, []);

    //funçao q pega as respostas do usuario com base no time e na pesquisa
    const fetchSurveyAnswers = async (userId: number, teamId: number, surveyUid: number) => {
        try {
            const response = await axios.get(`/api/dashboard/user/${userId}/team/${teamId}/survey/${surveyUid}/answers`);
            setSurveyAnswers(response.data.Answers);
            setBaseSurvey(response.data.BaseSurvey);
            console.log(response, selectedCategory);

            setGraphElement(<SurveyGraphs Dashboardsurvey={response.data} SelectedCategory={selectedCategory} />);
        } catch (error) {
            console.error("Erro ao buscar respostas da pesquisa:", error);
        }
    };

    const captureAndDownloadPDF = async (userId: number) => {
        const content = document.getElementById(`capture-content-${userId}`);
        if (!content) return;

        try {
            // Captura o conteúdo como imagem usando html2canvas
            const canvas = await html2canvas(content, {
                ignoreElements: (element) => element.tagName === "BUTTON" || element.tagName === "SELECT", // Ignora botões e dropdowns
            });

            const imgData = canvas.toDataURL("image/png"); // Converte o canvas para uma imagem

            // Cria um PDF usando jsPDF
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [canvas.width, canvas.height], // Ajusta ao tamanho do canvas
            });

            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height); // Adiciona a imagem ao PDF

            // Faz o download do PDF
            pdf.save(`dashboard_user_${userId}.pdf`);
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
        }
    };

    //busca os times do usuario(no caso nao esta filtrando direito mas o importante é colocar no grafico agora)
    const fetchTeams = async (userId: number) => {
        try {
            const response = await axios.get(`/api/user/${userId}/teams`);
            setTeams((prevTeams) => ({
                ...prevTeams,
                [userId]: response.data,
            }));
        } catch (error) {
            console.error("Erro ao buscar times:", error);
        }
    };

    //pega as base surveys do time em questao
    const fetchBaseSurveys = async (userId: number, teamId: number) => {
        try {
            const response = await axios.get(`/api/dashboard/user/${userId}/team/${teamId}/base-surveys`);
            setBaseSurveys((prevSurveys) => ({
                ...prevSurveys,
                [teamId]: response.data,
            }));
        } catch (error) {
            console.error("Erro ao buscar pesquisas base:", error);
        }
    };

    //funçao q abre e fecha o collpase do usuario
    const handleToggleUser = (userId: number) => {
        setOpenUserId((prevId) => (prevId === userId ? null : userId));
        setBaseSurveys({});
        setSelectedTeamId(null);
        setSurveyAnswers([]);
        setSelectedSurveyUid(null);
        setTeams({});

        if (!teams[userId]) {
            fetchTeams(userId);
        }
    };

    //funçao q muda o time selecionado
    const handleTeamChange = (userId: number, teamId: number) => {
        setSelectedTeamId(teamId);
        fetchBaseSurveys(userId, teamId);
    };

    if (error) {
        return <div>Erro ao carregar dados: {error}</div>;
    }

    const filteredUsers = users.filter((user) => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(searchTermLower);
        const matchesRole = (user.isAdmin ? "admin" : "usuário").toLowerCase().includes(searchTermLower);
        const matchesTeam = user.teamRoles.some(
            (teamRole) => teamRole.team.toLowerCase().includes(searchTermLower) || teamRole.role.toLowerCase().includes(searchTermLower)
        );

        return matchesName || matchesRole || matchesTeam;
    });

    return (
        <div className="container mt-4">
            <h1 className="text-center font-bold mb-4">Dashboards</h1>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Pesquisar funcionário por nome ou por função"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredUsers.map((user) => (
                <div key={user.id} className="card mb-3">
                    <div className="card-header">
                        <h2 className="user-title cursor-pointer" onClick={() => handleToggleUser(user.id)}>
                            {user.name} - {user.isAdmin ? "Admin" : "Usuário"}
                        </h2>
                    </div>
                    <div id={`capture-content-${user.id}`}>
                        <Collapse in={openUserId === user.id}>
                            <div className="p-4">
                                <button className="btn btn-secondary mt-3 mb-4" onClick={() => captureAndDownloadPDF(user.id)}>
                                    Baixar Dashboard
                                </button>

                                {/* Gráficos e informações do usuário */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full p-6">
                                    {/* Coluna Esquerda */}
                                    <div className="bg-[#152259] rounded-lg flex flex-col p-6 space-y-6 w-full h-full">
                                        <div className="flex flex-col sm:flex-row sm:space-x-4 w-full">
                                            {/* Dropdown de times */}
                                            <select
                                                className="text-white bg-[#407CAD] px-4 py-2 rounded mb-4 sm:mb-0 w-full sm:w-[calc(50%-8px)]"
                                                onChange={(e) => handleTeamChange(user.id, Number(e.target.value))}
                                            >
                                                <option value="">Selecione um time</option>
                                                {teams[user.id]?.map((team) => (
                                                    <option key={team.id} value={team.id}>
                                                        {team.name}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Dropdown de base surveys */}
                                            <select
                                                className="text-white bg-[#407CAD] px-4 py-2 rounded mb-4 sm:mb-0 w-full sm:w-[calc(50%-8px)]"
                                                onChange={(e) => {
                                                    setSelectedSurveyUid(Number(e.target.value));
                                                    if (selectedTeamId !== null) {
                                                        const selectedSurvey = baseSurveys[selectedTeamId]?.find(
                                                            (survey) => survey.uid === Number(e.target.value)
                                                        );
                                                        setSurveyCategories(selectedSurvey?.questions.map((survey) => survey.category) || []);
                                                    }
                                                }}
                                            >
                                                <option value="">Selecione uma pesquisa base</option>
                                                {selectedTeamId &&
                                                    baseSurveys[selectedTeamId]?.map((survey) => (
                                                        <option key={survey.uid} value={survey.uid}>
                                                            {survey.title}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        {/* Dropdown de categorias */}
                                        <select
                                            className="text-white bg-[#407CAD] px-4 py-2 rounded mb-4 w-full"
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                        >
                                            <option value="">Selecione uma categoria</option>
                                            {surveyCategories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            className="btn btn-primary w-full sm:w-auto mt-0 mb-2"
                                            onClick={() => {
                                                if (selectedTeamId && selectedSurveyUid) {
                                                    fetchSurveyAnswers(user.id, selectedTeamId, selectedSurveyUid);
                                                }
                                            }}
                                            disabled={!selectedTeamId || !selectedSurveyUid}
                                        >
                                            Carregar Respostas
                                        </button>

                                        {/* Gráficos */}
                                        <div className="flex flex-col items-center space-y-6 w-full">
                                            {graphElement}
                                            {/* <SurveyGraphs Dashboardsurvey={ExampleProps.Dashboardsurvey} SelectedCategory={selectedCategory} /> */}
                                        </div>
                                    </div>
                                    {/* Coluna Direita */}
                                    <div className="space-y-6 h-full">
                                        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 h-[calc(50%)-10px]">
                                            {/* <div className="w-full md:w-1/2 bg-[#152259] rounded-lg flex items-center justify-center">
                                                <PieChart width={400} height={400}>
                                                    <Pie
                                                        dataKey="value"
                                                        isAnimationActive={false}
                                                        data={data01}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={80}
                                                        fill="#32ADE6"
                                                        label
                                                    />
                                                    <Tooltip />
                                                </PieChart>
                                            </div> */}
                                            <div className="w-full bg-[#152259] rounded-lg p-6 flex flex-col justify-center space-y-6">
                                                <div className="text-left space-y-2">
                                                    <h2 className="text-white text-xl font-bold">Nome: {user.name}</h2>
                                                    <p className="text-white text-lg">ID: {user.id}</p>
                                                    <p className="text-white text-lg">Email: {user.email}</p>
                                                    <p className="text-white text-lg">Telefone: {user.phoneNumber}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-[#152259] rounded-lg flex items-center justify-center p-4">
                                            {surveyAnswers.length > 0 ? (
                                                <div className="bg-[#152259] p-4 rounded-lg w-full overflow-y-auto">
                                                    <h3 className="text-white text-lg font-bold">Respostas da Pesquisa</h3>
                                                    <h4 className="text-white text-lg font-bold">Nome da pesquisa: {baseSurvey?.title}</h4>
                                                    <h4 className="text-white text-lg font-bold">Descrição: {baseSurvey?.description}</h4>

                                                    {surveyAnswers.map((answer) => (
                                                        <div key={answer.answer_id} className="text-white mb-2">
                                                            <p>-----------------------------------</p>
                                                            <p>Categoria da avaliação: {answer.category}</p>
                                                            <p>Respondido em: {new Date(answer.created).toLocaleDateString()}</p>
                                                            <div>
                                                                {answer.data.map((dataItem, index) => (
                                                                    <div key={index} className="mb-2">
                                                                        <p>Pergunta: {dataItem.question}</p>
                                                                        <p>Resposta: {dataItem.answer}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-white">Pesquisa as respostas escolhendo o time e o formulário.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Collapse>
                    </div>
                </div>
            ))}
        </div>
    );
}
