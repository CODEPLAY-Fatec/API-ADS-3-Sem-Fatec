"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { KeyRound, User, LogOut, LayoutDashboard, Handshake, Users, UsersRound, Notebook, NotebookPen, UserPlus, } from "lucide-react";
import GroupsIcon from "@mui/icons-material/Groups";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isTeamLeader, setIsTeamLeader] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Sidebar - Apenas para desktop */}
      <div
        className={`sidebar d-none d-md-flex flex-column vh-100 text-white position-fixed overflow-auto ${
          isExpanded ? "expanded" : ""
        }`}
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
        {/* Sidebar Links */}
        <nav className="flex-grow-1 overflow-auto navbar-scroll">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="/home/profile" className="nav-link text-white">
                <User className="me-1" />
                {isExpanded && <span>Perfil</span>}
              </Link>
            </li>
            {(isAdmin || isTeamLeader) && (
              <li className="nav-item">
                <Link href="/home/dashboards" className="nav-link text-white">
                  <LayoutDashboard className="me-1" />
                  {isExpanded && <span>Dashboards</span>}
                </Link>
              </li>
            )}
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link href="/home/funcionarios" className="nav-link text-white">
                    <Users className="me-1" />
                    {isExpanded && <span>Lista de Funcionários</span>}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/home/surveys/surveycrud" className="nav-link text-white">
                    <NotebookPen className="me-1" />
                    {isExpanded && <span>Criação de Pesquisa</span>}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/home/teamregistration" className="nav-link text-white">
                    <GroupsIcon className="me-1" />
                    {isExpanded && <span>Cadastro de Times</span>}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/home/register" className="nav-link text-white">
                    <UserPlus className="me-1" />
                    {isExpanded && <span>Cadastro de Usuários</span>}
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link href="/home/Myteams" className="nav-link text-white">
                <Handshake className="me-1" />
                {isExpanded && <span>Meus Times</span>}
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/home/surveys/availablesurveys" className="nav-link text-white">
                <Notebook className="me-1" />
                {isExpanded && <span>Pesquisas Disponíveis</span>}
              </Link>
            </li>
            {isTeamLeader && (
              <li className="nav-item">
                <Link href="/home/funcionarioslider" className="nav-link text-white">
                  <UsersRound className="me-1" />
                  {isExpanded && <span>Lista de Liderados</span>}
                </Link>
              </li>
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
{/* Navbar responsiva */}
<div className="responsive-navbar">
  <div className="d-flex justify-content-between align-items-center px-3 py-2">
    <div className="logo-section d-flex align-items-center">
      <Image src="/images/logo.png" alt="Logo" width={30} height={30} />
      <h4 className="ms-2 m-0 text-white">QUANTUM</h4>
    </div>
    <button className="btn btn-light btn-sm" onClick={toggleMenu}>
      ☰
    </button>
  </div>
  <div className={`responsive-menu ${isMenuOpen ? "open" : ""}`}>
    <ul className="list-unstyled p-0 m-0">
      <li className="d-flex align-items-center my-2">
        <User className="me-2 text-white" />
        <Link href="/home/profile" className="text-white">Perfil</Link>
      </li>
      {(isAdmin || isTeamLeader) && (
        <li className="d-flex align-items-center my-2">
          <LayoutDashboard className="me-2 text-white" />
          <Link href="/home/dashboards" className="text-white">Dashboards</Link>
        </li>
      )}
      {isAdmin && (
        <>
          <li className="d-flex align-items-center my-2">
            <Users className="me-2 text-white" />
            <Link href="/home/funcionarios" className="text-white">Lista de Funcionários</Link>
          </li>
          <li className="d-flex align-items-center my-2">
            <NotebookPen className="me-2 text-white" />
            <Link href="/home/surveys/surveycrud" className="text-white">Criação de Pesquisa</Link>
          </li>
          <li className="d-flex align-items-center my-2">
            <GroupsIcon className="me-2 text-white" />
            <Link href="/home/teamregistration" className="text-white">Cadastro de Times</Link>
          </li>
          <li className="d-flex align-items-center my-2">
            <UserPlus className="me-2 text-white" />
            <Link href="/home/register" className="text-white">Cadastro de Usuários</Link>
          </li>
        </>
      )}
      <li className="d-flex align-items-center my-2">
        <Handshake className="me-2 text-white" />
        <Link href="/home/Myteams" className="text-white">Meus Times</Link>
      </li>
      <li className="d-flex align-items-center my-2">
        <Notebook className="me-2 text-white" />
        <Link href="/home/surveys/availablesurveys" className="text-white">Pesquisas Disponíveis</Link>
      </li>
      {isTeamLeader && (
        <li className="d-flex align-items-center my-2">
          <UsersRound className="me-2 text-white" />
          <Link href="/home/funcionarioslider" className="text-white">Lista de Liderados</Link>
        </li>
      )}
      <li className="d-flex align-items-center my-2">
        <KeyRound className="me-2 text-white" />
        <Link href="/home/changepasswordin" className="text-white">Alterar Senha</Link>
      </li>
      <li className="d-flex align-items-center my-2">
        <LogOut className="me-2 text-white" />
        <Link href="/" className="text-white" onClick={handleLogout}>
          Sair
        </Link>
      </li>
    </ul>
  </div>
</div>
    </>
  );
};

export default Navbar;
