"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookie from "js-cookie"; // Importa js-cookie
import {jwtDecode} from "jwt-decode"; // Importa jwt-decode corretamente
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Busca o token de admin nos cookies
    const token = Cookie.get("authToken");
    if (token) {
      try {
        // Decodifique o token para verificar se o usuário é admin
        const decodedToken: { isAdmin: boolean } = jwtDecode(token);
        setIsAdmin(decodedToken.isAdmin); // Atualiza o estado baseado no valor isAdmin do token
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Remove os tokens dos cookies
    Cookie.remove("authToken");
    Cookie.remove("userToken");

    // Redireciona para a página de login ou outra página desejada
    window.location.href = "/"; // Ou o caminho desejado para a página inicial
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

          {/* Exibe Dashboards apenas se for admin */}
          {isAdmin && (
            <li className="nav-item">
              <Link href="/home/dashboards" className="nav-link text-white">
                <div className="link-content">
                  <i className="bi bi-bar-chart-fill me-2"></i> Dashboards
                </div>
              </Link>
            </li>
          )}

          {/* Exibe Lista de Funcionários apenas se for admin */}
          {isAdmin && (
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

          {/* Exibe opções de admin */}
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
