// dashboard pessoal / usuário normal (pesquisas respondidas)
// dashboard de líder (respostas de autoavaliação de liderado, respostas de avaliação de liderado)
// dashboard de admin (tem acesso à avaliações de líderes)

// essa página vai ter apenas um dashboard, que exibe apenas os dados que o usuário logado possui acesso.
// ex: um líder tem acesso aos dados do dashboard pessoal + os dados de dashboard de líder.
// ex: um admin tem acesso aos dados do dashboard pessoal + os dados de dashboard de líder + os dados de dashboard de admin.

"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation"; 
import { PieChart, Pie, BarChart, Bar,  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
{
  name: 'Page E',
  uv: 1890,
  pv: 4800,
  amt: 2181,
},
{
  name: 'Page F',
  uv: 2390,
  pv: 3800,
  amt: 2500,
},
{
  name: 'Page G',
  uv: 3490,
  pv: 4300,
  amt: 2100,
},
];

const data01 = [
  {
    "name": "Group A",
    "value": 400
  },
  {
    "name": "Group B",
    "value": 300
  },
  {
    "name": "Group C",
    "value": 300
  },
  {
    "name": "Group D",
    "value": 200
  },
  {
    "name": "Group E",
    "value": 278
  },
  {
    "name": "Group F",
    "value": 189
  }
];
const data02 = [
  {
    "name": "Group A",
    "value": 2400
  },
  {
    "name": "Group B",
    "value": 4567
  },
  {
    "name": "Group C",
    "value": 1398
  },
  {
    "name": "Group D",
    "value": 9800
  },
  {
    "name": "Group E",
    "value": 3908
  },
  {
    "name": "Group F",
    "value": 4800
  }
];

export default function DashboardPage() {
  const [userData, setUserData] = useState<DecodedToken | null>(null);
  const router = useRouter(); 

  useEffect(() => {
    const token = Cookie.get("authToken") || Cookie.get("userToken");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserData(decoded);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, []);


  const handleEvaluationClick = () => {
    router.push("/home/surveys/surveycrud"); 
  };

  const handleProfileClick = () => {
    router.push("/home/profile"); 
  };

  if (!userData) {
    return <p>Carregando dados do usuário...</p>;
  }

  return (
    <div className="h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboards</h1>

        <div className="flex items-center">
          {userData.isAdmin && ( // Botão de Avaliação visível apenas para admins
            <button
              onClick={handleEvaluationClick} // Função que redireciona para a página de pesquisas
              className="text-white bg-[#509CDB] px-4 py-2 rounded hover:bg-[#407CAD] mr-12" // Ajusta o espaçamento do botão Avaliações
              style={{ fontSize: "16px" }}
            >
              Avaliações
            </button>
          )}

        </div>
      </div>

      <div className="flex justify-between mx-6 space-x-6 h-[calc(95vh-8rem)]">
  {/* Contêiner de gráficos com ajuste de layout para empilhamento e maior tamanho */}
  <div className="w-1/2 h-full bg-[#152259] rounded-lg flex flex-col items-center justify-center space-y-8 p-4">
    <h3 className="text-white text-lg">Exemplo</h3>

    {/* Gráfico de barras sem fundo quadriculado e com nova cor */}
    <BarChart width={500} height={200} data={data}>
            <Bar dataKey="uv" fill="#32ADE6" />
          </BarChart>

    {/* Gráfico de linhas com fundo branco e eixos em branco */}
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid stroke="#FFFFFF" /> {/* Define o fundo do gráfico como branco */}
      <XAxis dataKey="name" stroke="#FFFFFF" />
      <YAxis stroke="#FFFFFF" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="pv" stroke="#32ADE6" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
    </LineChart>
    
  </div>

        <div className="w-1/2 h-full flex flex-col space-y-6">
          <div className="flex space-x-6 h-1/2">
            <div className="w-1/2 bg-[#152259] rounded-lg flex items-center justify-center">
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
          <Pie dataKey="value" data={data02} cx={500} cy={200} innerRadius={60} outerRadius={100} fill="#82ca9d" />
          <Tooltip />
        </PieChart>
            </div>

            
            <div
              onClick={handleProfileClick} // Função que redireciona ao perfil
              className="w-1/2 bg-[#152259] rounded-lg p-6 flex flex-col justify-center space-y-6 cursor-pointer hover:bg-[#1a3460]" // Adicionando cursor de pointer e efeito hover
            >
              <div className="w-44 h-44 bg-gray-300 rounded-full mx-auto"></div> 
              <div className="text-left space-y-2">
                <h2 className="text-white text-xl font-bold">Nome: {userData.name}</h2>
                <p className="text-white text-lg">ID: {userData.id}</p>
                <p className="text-white text-lg">Email: {userData.email}</p>
              </div>
            </div>
          </div>

          {/* Card maior embaixo com texto de categorias */}
          <div className="h-1/2 bg-[#152259] rounded-lg flex items-center justify-center">
            <p className="text-[#32ADE6]">As explicações/categorias/coisas extras dos dasboards podem ficar aqui</p>
          </div>
        </div>
      </div>
    </div>
  );
}
