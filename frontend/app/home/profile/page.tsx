"use client";

import { useRef, useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import html2canvas from "html2canvas";
import axios from "axios";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
    PieChart,
    Pie,
} from "recharts";

interface DecodedToken {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    phone: string;
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
    phone: string;
    teamRoles: TeamRole[];
    photo?: string;
}

const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
];

const data01 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
    { name: "Group E", value: 278 },
    { name: "Group F", value: 189 },
];

const data02 = [
    { name: "Group A", value: 2400 },
    { name: "Group B", value: 4567 },
    { name: "Group C", value: 1398 },
    { name: "Group D", value: 9800 },
    { name: "Group E", value: 3908 },
    { name: "Group F", value: 4800 },
];

export default function Page() {
    const contentRef = useRef<HTMLDivElement>(null);
    const [userData, setUserData] = useState<DecodedToken | null>(null);
    const [userTeams, setUserTeams] = useState<TeamRole[]>([]);
    const [userPhoto, setUserPhoto] = useState<string | null>(null);

    useEffect(() => {
        const token = Cookie.get("authToken") || Cookie.get("userToken");

        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setUserData(decoded);

                axios
                    .get("/api/users")
                    .then((response) => {
                        const allUsers: UserData[] = response.data;
                        const currentUser = allUsers.find((user) => user.id === decoded.id);
                        if (currentUser) {
                            setUserTeams(currentUser.teamRoles);
                            if (currentUser.photo) {
                                setUserPhoto(`data:image/jpeg;base64,${currentUser.photo}`);
                            }
                        }
                    })
                    .catch((error) => {
                        console.error("Erro ao buscar os times do usuário:", error);
                    });
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    const handleDownloadPDF = async () => {
        if (contentRef.current) {
            const canvas = await html2canvas(contentRef.current);
            const imageData = canvas.toDataURL("image/png");

            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([canvas.width, canvas.height]);

            const pngImage = await pdfDoc.embedPng(imageData);
            page.drawImage(pngImage, {
                x: 0,
                y: 0,
                width: canvas.width,
                height: canvas.height,
            });

            const pdfBytes = await pdfDoc.save();
            saveAs(new Blob([pdfBytes]), "profile.pdf");
        }
    };

    if (!userData) {
        return <p>Carregando dados do usuário...</p>;
    }

    return (
        <div>
            <div className="flex justify-between items-center p-4">
                <h1 className="text-2xl font-bold">Perfil pessoal</h1>
                <button
                    onClick={handleDownloadPDF}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Baixar PDF
                </button>
            </div>

            {/* Área a ser capturada para o PDF */}
            <div ref={contentRef} className="p-4">
                {/* Grid responsivo */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Gráfico de barras */}
                    <div className="bg-white rounded-lg p-4 border border-gray-300">
                        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
                        <div className="flex justify-center">
                            <BarChart
                                width={400}
                                height={300}
                                data={data}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="pv" fill="#32ADE6" />
                                <Bar dataKey="uv" fill="#82ca9d" />
                            </BarChart>
                        </div>
                    </div>

                    {/* Perfil do usuário */}
                    <div className="bg-white rounded-lg p-6 border border-gray-300 flex flex-col items-center">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gray-300 rounded-full mb-4">
                            {userPhoto && (
                                <img
                                    src={userPhoto}
                                    alt="Foto de perfil"
                                    className="w-full h-full rounded-full"
                                />
                            )}
                        </div>
                        <h2 className="font-bold text-xl mb-2 text-center">{userData.name}</h2>
                        <div className="space-y-2 text-center">
                            <p>
                                <strong>ID:</strong> {userData.id}
                            </p>
                            <p>
                                <strong>Email:</strong> {userData.email}
                            </p>
                            <p>
                                <strong>Nível de acesso:</strong>{" "}
                                {userData.isAdmin ? "Admin" : "Membro"}
                            </p>
                            <p>
                                <strong>Telefone:</strong> {userData.phone}
                            </p>
                            <p>
                                <strong>Times:</strong>{" "}
                                {userTeams.length > 0
                                    ? userTeams.map((team, index) => (
                                        <span key={index}>
                                            {team.team} ({team.role})
                                            {index < userTeams.length - 1 ? ", " : ""}
                                        </span>
                                    ))
                                    : "Nenhum time associado"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Segunda linha: gráficos e explicações */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-300 flex justify-center">
                        <PieChart width={300} height={300}>
                            <Pie
                                dataKey="value"
                                data={data01}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#32ADE6"
                                label
                            />
                            <Pie
                                dataKey="value"
                                data={data02}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#82ca9d"
                            />
                            <Tooltip />
                        </PieChart>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-300 flex items-center justify-center">
                        <p className="text-gray-500 text-center">
                            As explicações/categorias/coisas extras dos dashboards podem ficar aqui
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
