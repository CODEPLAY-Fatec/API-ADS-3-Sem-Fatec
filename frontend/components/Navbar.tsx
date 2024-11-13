"use client";

import Link from "next/link";
import Image from 'next/image';
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  KeyRound, User, LogOut, LayoutDashboard, Handshake, Users, UsersRound, Notebook, NotebookPen, UserPlus,
} from "lucide-react";
import GroupsIcon from '@mui/icons-material/Groups';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isTeamLeader, setIsTeamLeader] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(true);

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

  const handleLogout = () => {
    Cookie.remove("authToken");
    Cookie.remove("userToken");
    window.location.href = "/";
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`sidebar d-flex flex-column vh-100 text-white position-fixed overflow-auto ${isExpanded ? 'expanded' : ''}`}
      style={{ maxHeight: "100vh", backgroundColor: "#152259" }}
    >
      <div className="text-center my-3">
        <Image
          src="/images/logo.png"
          alt="Logo"
          className="img-fluid mx-auto d-block"
          style={{ maxHeight: "100px" }}
          width={100}
          height={100}
        />

        {isExpanded && (
          <>
            <h4 className="mt-2 mb-0 text-center">
              <strong>QUANTUM</strong>
            </h4>
            <p className="m-0 text-center">ENTERPRISE</p>
          </>
        )}
      </div>

      <hr style={{ border: "1px solid white", width: "100%" }} />

      <nav className="flex-grow-1 overflow-auto navbar-scroll">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link href="/home/profile" className="nav-link text-white">
              <div className="link-content d-flex align-items-center">
                <User className="me-1" />
                {isExpanded && <span>Perfil</span>}
              </div>
            </Link>
          </li>
          {(isAdmin || isTeamLeader) && (
            <li className="nav-item">
              <Link href="/home/dashboards" className="nav-link text-white">
                <div className="link-content d-flex align-items-center">
                  <LayoutDashboard className="me-1" />
                  {isExpanded && <span>Dashboards</span>}
                </div>
              </Link>
            </li>
          )}
          {isAdmin && (
            <li className="nav-item">
              <Link href="/home/funcionarios" className="nav-link text-white">
                <div className="link-content d-flex align-items-center">
                  <Users className="me-1" />
                  {isExpanded && <span>Lista de Funcionários</span>}
                </div>
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link href="/home/Myteams" className="nav-link text-white">
              <div className="link-content d-flex align-items-center">
                <Handshake className="me-1" />
                {isExpanded && <span>Meus Times</span>}
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/home/surveys/availablesurveys" className="nav-link text-white">
              <div className="link-content d-flex align-items-center">
                <Notebook className="me-1" />
                {isExpanded && <span>Pesquisas disponíveis</span>}
              </div>
            </Link>
          </li>
          {isTeamLeader && (
            <li className="nav-item">
              <Link href="/home/funcionarioslider" className="nav-link text-white">
                <div className="link-content d-flex align-items-center">
                  <UsersRound className="me-1" />
                  {isExpanded && <span>Lista de Liderados</span>}
                </div>
              </Link>
            </li>
          )}
          {isAdmin && (
            <>
              <li className="nav-item">
                <Link href="/home/surveys/surveycrud" className="nav-link text-white">
                  <div className="link-content d-flex align-items-center">
                    <NotebookPen className="me-1" />
                    {isExpanded && <span>Criação de Pesquisa</span>}
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/home/teamregistration" className="nav-link text-white">
                  <div className="link-content d-flex align-items-center">
                    <GroupsIcon className="me-1" />
                    {isExpanded && <span>Cadastro de Times</span>}
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/home/register" className="nav-link text-white">
                  <div className="link-content d-flex align-items-center">
                    <UserPlus className="me-1" />
                    {isExpanded && <span>Cadastro de Usuários</span>}
                  </div>
                </Link>
              </li>
            </>
          )}




        </ul>
      </nav>

       {/* Botão para expandir a sidebar */}
       {!isExpanded && (
        <div className="expand-button-container">
          <button onClick={toggleSidebar} className="btn btn-primary mb-2">
            <ViewSidebarIcon />
          </button>
        </div>
      )}

      {/* Botões de alteração de senha e logout */}
      <div className="text-center d-flex justify-content-center mb-3">
        <Link href="/home/changepasswordin" className="btn btn-warning me-2">
          <KeyRound />
        </Link>
        {isExpanded && (
          <button onClick={toggleSidebar} className="btn btn-primary me-2">
            <ViewSidebarIcon />
          </button>
        )}
        <button onClick={handleLogout} className="btn btn-danger d-flex align-items-center">
          <LogOut />
        </button>
      </div>
    </div>

  );
};

export default Navbar;
