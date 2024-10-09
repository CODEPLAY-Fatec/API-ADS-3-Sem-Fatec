"use client";
import Link from "next/link";

export default function Home() {
  return (
        // adicionar logica para login e do token quando logar

    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f9f9f9" }}>
      <div style={{ textAlign: "center", width: "300px" }}>
        <h2 style={{ color: "#357edd", marginBottom: "50px", marginLeft: "10px", fontSize: "30px", }}>Bem vindo! Acesse sua conta</h2>

        <div
          className="card"
          style={{
            padding: "40px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <p style={{ marginBottom: "30px", textAlign: "center" }}>É um grande prazer ter você a bordo!</p>

          <div className="mb-3">
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Digite seu e-mail"
              style={{
                padding: "12px",
                borderRadius: "4px",
                borderColor: "#ccc",
                marginBottom: "2px",
              }}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              id="senha"
              className="form-control"
              placeholder="Digite sua senha"
              style={{
                padding: "12px",
                borderRadius: "4px",
                borderColor: "#ccc",
                marginBottom: "20px",
              }}
            />
          </div>

          <Link href="/home/profile">
            <button
              className="btn"
              style={{
                backgroundColor: "#357edd",
                color: "#fff",
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
              }}
            >
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
