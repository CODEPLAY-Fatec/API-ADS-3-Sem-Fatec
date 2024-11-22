"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { KeyRound, User, LogOut, LayoutDashboard, Handshake, Users, UsersRound, Notebook, NotebookPen, UserPlus, } from "lucide-react";
import GroupsIcon from "@mui/icons-material/Groups"; 
import "./Navbar.css";

const Navbar: React.FC<{ onToggleSidebar: (isExpanded: boolean) => void }> = ({ onToggleSidebar }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isTeamLeader, setIsTeamLeader] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = (expand: boolean) => {
    setIsExpanded(expand);
    onToggleSidebar(expand); 
};

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  // Função para logout
  const handleLogout = () => {
    Cookie.remove("authToken");
    Cookie.remove("userToken");
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !document.querySelector(".responsive-menu")?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);
  

  const closeMenu = () => {
    setIsMenuOpen(false);
  };


  return (
    <>
    {window.innerWidth > 768 && (
      <div
          className={`sidebar d-flex flex-column vh-100 text-white position-fixed overflow-auto ${
              isExpanded ? "expanded" : ""
          }`}
          onMouseEnter={() => toggleSidebar(true)}
          onMouseLeave={() => toggleSidebar(false)}
      >
      <div className="sidebar-logo text-center my-3">
        <Image
          src="/images/logo.png"
          alt="Logo"
          className="img-fluid mx-auto d-block"
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
    )}
{/* Navbar responsiva */}

{window.innerWidth < 768 && (
<div className="responsive-navbar">
  <div className="d-flex justify-content-between align-items-center px-3 py-2">
    <div className="logo-section d-flex align-items-center">
      <Image src="/images/logo.png" alt="Logo" width={30} height={30} />
      <h4 className="ms-2 m-0 text-white"><strong>QUANTUM</strong></h4>
      <h4 className="ms-2 m-0 text-white">ENTERPRISE</h4>
    </div>
    <button className="btn btn-light btn-sm" onClick={toggleMenu}>
      ☰
    </button>
  </div>
  <div className={`responsive-menu ${isMenuOpen ? "open" : ""}`}>
    <ul className="list-unstyled p-0 m-0">
      <li className="d-flex align-items-center my-2">
        <User className="me-2 text-white" />
        <Link href="/home/profile" className="text-white" onClick={() => setIsMenuOpen(false)}>Perfil</Link>
      </li>
      {(isAdmin || isTeamLeader) && (
        <li className="d-flex align-items-center my-2">
          <LayoutDashboard className="me-2 text-white" />
          <Link href="/home/dashboards" className="text-white" onClick={() => setIsMenuOpen(false)}>Dashboards</Link>
        </li>
      )}
      {isAdmin && (
        <>
          <li className="d-flex align-items-center my-2">
            <Users className="me-2 text-white" />
            <Link href="/home/funcionarios" className="text-white" onClick={() => setIsMenuOpen(false)}>Lista de Funcionários</Link>
          </li>
          <li className="d-flex align-items-center my-2">
            <NotebookPen className="me-2 text-white" />
            <Link href="/home/surveys/surveycrud" className="text-white" onClick={() => setIsMenuOpen(false)}>Criação de Pesquisa</Link>
          </li>
          <li className="d-flex align-items-center my-2">
            <GroupsIcon className="me-2 text-white" />
            <Link href="/home/teamregistration" className="text-white" onClick={() => setIsMenuOpen(false)}>Cadastro de Times</Link>
          </li>
          <li className="d-flex align-items-center my-2">
            <UserPlus className="me-2 text-white" />
            <Link href="/home/register" className="text-white" onClick={() => setIsMenuOpen(false)}>Cadastro de Usuários</Link>
          </li>
        </>
      )}
      <li className="d-flex align-items-center my-2">
        <Handshake className="me-2 text-white" />
        <Link href="/home/Myteams" className="text-white" onClick={() => setIsMenuOpen(false)}>Meus Times</Link>
      </li>
      <li className="d-flex align-items-center my-2">
        <Notebook className="me-2 text-white" />
        <Link href="/home/surveys/availablesurveys" className="text-white" onClick={() => setIsMenuOpen(false)}>Pesquisas Disponíveis</Link>
      </li>
      {isTeamLeader && (
        <li className="d-flex align-items-center my-2">
          <UsersRound className="me-2 text-white" />
          <Link href="/home/funcionarioslider" className="text-white" onClick={() => setIsMenuOpen(false)}>Lista de Liderados</Link>
        </li>
      )}
      <li className="d-flex align-items-center my-2">
        <KeyRound className="me-2 text-white" />
        <Link href="/home/changepasswordin" className="text-white" onClick={() => setIsMenuOpen(false)}>Alterar Senha</Link>
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
)}
</>
  );
};

export default Navbar;
