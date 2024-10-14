"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import {jwtDecode} from "jwt-decode";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isTeamLeader, setIsTeamLeader] = useState<boolean>(false);


  //defindo se é admin ou nao e se é lider ou nao para restringir os links
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

  //funçao para sair ai ja remove o token
  const handleLogout = () => {
    Cookie.remove("authToken");
    Cookie.remove("userToken");
    window.location.href = "/";
  };

  return (
    <div className="d-flex flex-column vh-100 text-white position-fixed" style={{ width: "250px", backgroundColor: "#152259" }}>
      <div className="text-center my-3">
        <img src="/images/logo.png" alt="Logo" className="img-fluid mx-auto d-block" style={{ maxHeight: "100px" }} />
        <h4 className="mt-2 mb-0 text-center">
          <strong>QUANTUM</strong>
        </h4>
        <p className="m-0 text-center">ENTERPRISE</p>
      </div>

      <hr style={{ border: "1px solid white", width: "100%" }} />

      <nav className="flex-grow-1">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link href="/home/profile" className="nav-link text-white">
              <div className="link-content">
                <i className="bi bi-house-door-fill me-2"></i> Perfil
              </div>
            </Link>
          </li>

          {(isAdmin || isTeamLeader) && (
            <li className="nav-item">
              <Link href="/home/dashboards" className="nav-link text-white">
                <div className="link-content">
                  <i className="bi bi-bar-chart-fill me-2"></i> Dashboards
                </div>
              </Link>
            </li>
          )}

          {(isAdmin || isTeamLeader) && (
            <li className="nav-item">
              <Link href="/home/funcionarios" className="nav-link text-white">
                <div className="link-content">
                  <i className="bi bi-bar-chart-fill me-2"></i> Lista de Funcionários
                </div>
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link href="/home/surveys/availablesurveys" className="nav-link text-white">
              <div className="link-content">
                <i className="bi bi-journal-text me-2"></i> Surveys Disponíveis
              </div>
            </Link>
          </li>

          {isAdmin && (
            <>
              <li className="nav-item">
                <Link href="/home/surveys/surveycrud" className="nav-link text-white">
                  <div className="link-content">
                    <i className="bi bi-journal-text me-2"></i> Criação de Surveys
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/home/teamregistration" className="nav-link text-white">
                  <div className="link-content">
                    <i className="bi bi-journal-text me-2"></i> Cadastro de Times
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/home/register" className="nav-link text-white">
                  <div className="link-content">
                    <i className="bi bi-journal-text me-2"></i> Cadastro de Usuários
                  </div>
                </Link>
              </li>
            </>
          )}

          <li className="nav-item">
            <Link href="/home/changepasswordin" className="nav-link text-white">
              <div className="link-content">
                <i className="bi bi-journal-text me-2"></i> Alterar informações
              </div>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="text-center mb-3">
        <button onClick={handleLogout} className="btn btn-danger">
          Sair
        </button>
      </div>
    </div>
  );
};

export default Navbar;
