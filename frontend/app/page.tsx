"use client";
import Link from "next/link";

export default function Home() {
  return (
    // adicionar logica para login e do token quando logar


    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card" style={{ width: "300px", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
        <h3 className="text-center mb-4">Login</h3>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" id="email" className="form-control" placeholder="Digite seu email" />
        </div>
        <div className="mb-3">
          <label htmlFor="senha" className="form-label">Senha</label>
          <input type="password" id="senha" className="form-control" placeholder="Digite sua senha" />
        </div>
        <Link href="/home/profile">
          <button className="btn" style={{ backgroundColor: "#99ccff", width: "100%" }}>
            Entrar
          </button>
        </Link>
      </div>
    </div>
  );
}
