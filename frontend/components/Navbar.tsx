"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  KeyRound,
  User,
  LogOut,
  LayoutDashboard,
  Handshake,
  Users,
  UsersRound,
  Notebook,
  NotebookPen,
  UserPlus,
} from "lucide-react";
import GroupsIcon from "@mui/icons-material/Groups"; // provavelmente depois alterar todos para mui
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isTeamLeader, setIsTeamLeader] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Definindo se é admin ou líder para restringir links
  useEffect(() => {
    const token = Cookie.get("authToken") || Cookie.get("userToken");
    if (token) {
      try {
        const decodedToken = jwtDecode<{
          isAdmin: boolean;
          isTeamLeader: boolean;
        }>(token);
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
      className={`sidebar d-flex flex-column vh-100 text-white position-fixed overflow-auto ${
        isExpanded ? "expanded" : ""
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="sidebar-logo text-center my-3">
        <Image
          src="/images/logo.png"
          alt="Logo"
          className="img-fluid mx-auto d-block"
          width={100}
          height={100}
        />
        
      </div>

      <hr className="sidebar-divider" />

      <nav className="flex-grow-1 overflow-auto navbar-scroll">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link href="/home/profile" className="nav-link text-white">
              <div className="link-content">
                <User className="icon" />
                {isExpanded && <span>Perfil</span>}
              </div>
            </Link>
          </li>

          {(isAdmin || isTeamLeader) && (
            <li className="nav-item">
              <Link href="/home/dashboards" className="nav-link text-white">
                <div className="link-content">
                  <LayoutDashboard className="icon" />
                  {isExpanded && <span>Dashboards</span>}
                </div>
              </Link>
            </li>
          )}

          {isAdmin && (
            <li className="nav-item">
              <Link href="/home/funcionarios" className="nav-link text-white">
                <div className="link-content">
                  <Users className="icon" />
                  {isExpanded && <span>Funcionários</span>}
                </div>
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link href="/home/Myteams" className="nav-link text-white">
              <div className="link-content">
                <Handshake className="icon" />
                {isExpanded && <span>Times</span>}
              </div>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              href="/home/surveys/availablesurveys"
              className="nav-link text-white"
            >
              <div className="link-content">
                <Notebook className="icon" />
                {isExpanded && <span>Pesquisas</span>}
              </div>
            </Link>
          </li>

          {isTeamLeader && (
            <li className="nav-item">
              <Link
                href="/home/funcionarioslider"
                className="nav-link text-white"
              >
                <div className="link-content">
                  <UsersRound className="icon" />
                  {isExpanded && <span>Liderados</span>}
                </div>
              </Link>
            </li>
          )}

          {isAdmin && (
            <>
              <li className="nav-item">
                <Link
                  href="/home/surveys/surveycrud"
                  className="nav-link text-white"
                >
                  <div className="link-content">
                    <NotebookPen className="icon" />
                    {isExpanded && <span>Criação de Pesquisa</span>}
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/home/teamregistration"
                  className="nav-link text-white"
                >
                  <div className="link-content">
                    <GroupsIcon className="icon" />
                    {isExpanded && <span>Cadastro de Times</span>}
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/home/register" className="nav-link text-white">
                  <div className="link-content">
                    <UserPlus className="icon" />
                    {isExpanded && <span>Cadastro de Usuários</span>}
                  </div>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="text-center d-flex justify-content-center mb-3">
        <Link
          href="/home/changepasswordin"
          className="btn btn-warning me-2"
          aria-label="Change Password"
          title="Alterar senha"
        >
          <KeyRound className="icon" />
        </Link>
        <button
          onClick={handleLogout}
          className="btn btn-danger d-flex align-items-center"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut className="icon" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
