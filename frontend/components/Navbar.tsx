"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { KeyRound, 
        User,
        LogOut,
        LayoutDashboard,
        Handshake, 
        Users, 
        UsersRound,Notebook,NotebookPen,UserPlus } from "lucide-react"; 
import GroupsIcon from '@mui/icons-material/Groups'; //provavelmente depois alterar todos para mui
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isTeamLeader, setIsTeamLeader] = useState<boolean>(false);

  // Definindo se é admin ou líder para restringir links
  useEffect(() => {
    const token = Cookie.get("authToken") || Cookie.get("userToken");
    if (token) {
      try {
        const decodedToken = jwtDecode<{ isAdmin: boolean; isTeamLeader: boolean }>(token);
        setIsAdmin(decodedToken.isAdmin || false);
        setIsTeamLeader(decodedToken.isTeamLeader || false);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, []);

  // Função para logout
  const handleLogout = () => {
    Cookie.remove("authToken");
    Cookie.remove("userToken");
    window.location.href = "/";
  };

  return (
    <div
      className="d-flex flex-column vh-100 text-white position-fixed overflow-auto"
      style={{ maxHeight: "100vh", width: "250px", backgroundColor: "#152259" }}>

      <div className="text-center my-3">
        <img src="/images/logo.png" alt="Logo" className="img-fluid mx-auto d-block" style={{ maxHeight: "100px" }} />
        <h4 className="mt-2 mb-0 text-center">
          <strong>QUANTUM</strong>
        </h4>
        <p className="m-0 text-center">ENTERPRISE</p>
      </div>

      <hr style={{ border: "1px solid white", width: "100%" }} />

      <nav className="flex-grow-1 overflow-auto navbar-scroll">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link href="/home/profile" className="nav-link text-white">
              <div className="link-content d-flex align-items-center">
                <User className="me-1" />
                Perfil
              </div>
            </Link>
          </li>

          {(isAdmin || isTeamLeader) && (
            

            <li className="nav-item">
              <Link href="/home/dashboards" className="nav-link text-white">
              <div className="link-content d-flex align-items-center">
                  <LayoutDashboard className="me-1"/>
                  Dashboards
                </div>
              </Link>
            </li>
          )}

          {isAdmin && (
            <li className="nav-item">
              <Link href="/home/funcionarios" className="nav-link text-white">
                <div className="link-content d-flex align-items-center">
                  <Users className="me-1"/>
                   Lista de Funcionários
                </div>
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link href="/home/Myteams" className="nav-link text-white">
              <div className="link-content d-flex align-items-center">
                <Handshake className="me-1"/>
                Meus Times
              </div>
            </Link>
          </li>

          <li className="nav-item">
            <Link href="/home/surveys/availablesurveys" className="nav-link text-white">
              <div className="link-content d-flex align-items-center">
                <Notebook className="me-1"/>
                Pesquisas disponíveis
              </div>
            </Link>
          </li>

          {isTeamLeader && (
            <li className="nav-item">
              <Link href="/home/funcionarioslider" className="nav-link text-white">
                <div className="link-content d-flex align-items-center">
                  <UsersRound className="me-1"/>
                Lista de Líderados
                </div>
              </Link>
            </li>
          )}

          {isAdmin && (
            <>
              <li className="nav-item">
                <Link href="/home/surveys/surveycrud" className="nav-link text-white">
                  <div className="link-content d-flex align-items-center">
                    <NotebookPen className="me-1"/>
                    Criação de Pesquisa
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/home/teamregistration" className="nav-link text-white">
                  <div className="link-content d-flex align-items-center">
                    <GroupsIcon className="me-1"/>
                    Cadastro de Times
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/home/register" className="nav-link text-white">
                  <div className="link-content d-flex align-items-center">
                    <UserPlus className="me-1"/>
                    Cadastro de Usuários
                  </div>
                </Link>
              </li>
            </>
          )}

        </ul>
      </nav>

      <div className="text-center d-flex justify-content-center mb-3"> 
  <Link href="/home/changepasswordin" className="btn btn-warning me-2">
    <KeyRound className="me-1" /> 
  </Link>
  <button onClick={handleLogout} className="btn btn-danger d-flex align-items-center">
    Sair
    <LogOut className="ms-2" /> 
  </button>
</div>
    </div>
  );
};

export default Navbar;
