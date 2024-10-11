"use client";
import Link from "next/link";
import "./Navbar.css";

const Navbar: React.FC = () => {
    return (
        <div className="d-flex flex-column v-100 text-white" style={{ width: "250px", backgroundColor: "#152259" }}>
            <div className="text-center my-3">
                <img src="/images/logo.png" alt="Logo" className="img-fluid mx-auto d-block" style={{ maxHeight: "100px" }} />
                <h4 className="mt-2 mb-0 text-center">
                    <strong>QUANTUM</strong>
                </h4>
                <p className="m-0 text-center">ENTERPRISE</p>
            </div>

            <hr style={{ border: '1px solid white', width: '100%' }} />

            <nav className="flex-grow-1">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link href="/home/profile" className="nav-link text-white">
                            <div className="link-content">
                                <i className="bi bi-house-door-fill me-2"></i> Perfil
                            </div>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/home/dashboards" className="nav-link text-white">
                            <div className="link-content">
                                <i className="bi bi-bar-chart-fill me-2"></i> Dashboards
                            </div>
                        </Link>
                    </li>
                    
                    {/* Essa página é só para líder ou admin */}
                    <li className="nav-item">
                        <Link href="/home/funcionarios" className="nav-link text-white">
                            <div className="link-content">
                                <i className="bi bi-bar-chart-fill me-2"></i> Lista de Funcionários
                            </div>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link href="/home/surveys/availablesurveys" className="nav-link text-white">
                            <div className="link-content">
                                <i className="bi bi-journal-text me-2"></i> Surveys Disponíveis
                            </div>
                        </Link>
                    </li>

                    {/* Verificar se é admin para essa página */}
                    <li className="nav-item">
                        <Link href="/home/surveys/surveycrud" className="nav-link text-white">
                            <div className="link-content">
                                <i className="bi bi-journal-text me-2"></i> Criação de Surveys
                            </div>
                        </Link>
                    </li>

                    {/* Verificar se é admin para essa página */}
                    <li className="nav-item">
                        <Link href="/home/teamregistration" className="nav-link text-white">
                            <div className="link-content">
                                <i className="bi bi-journal-text me-2"></i> Cadastro de Times
                            </div>
                        </Link>
                    </li>

                    {/* Verificar se é admin para essa página */}
                    <li className="nav-item">
                        <Link href="/home/register" className="nav-link text-white">
                            <div className="link-content">
                                <i className="bi bi-journal-text me-2"></i> Cadastro de Usuários
                            </div>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Quando adicionar formas de autenticaçao retirar o token ao deslogar */}
            <div className="text-center mb-3">
                <Link href="/" className="btn btn-danger">
                    Sair
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
