// app/home/layout.tsx (ou onde estiver sua Navbar)
"use client";
import Link from "next/link";

const Navbar: React.FC = () => {
    return (
        <div className="d-flex flex-column vh-100 text-white" style={{ width: "250px", backgroundColor: "#152259" }}>
            <div className="text-center my-3">
                <img src="/images/logo.png" alt="Logo" className="img-fluid mx-auto d-block" style={{ maxHeight: "100px" }} />
                <h4 className="mt-2 mb-0 text-center">
                    <strong>QUANTUM</strong>
                </h4>
                <p className="m-0 text-center">ENTERPRISE</p>
            </div>

            <nav className="flex-grow-1">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link href="/" className="nav-link text-white">
                            <i className="bi bi-house-door-fill me-2"></i> Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/home/dashboards" className="nav-link text-white">
                            <i className="bi bi-bar-chart-fill me-2"></i> Dashboards
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/home/surveys" className="nav-link text-white">
                            <i className="bi bi-journal-text me-2"></i> Surveys
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
