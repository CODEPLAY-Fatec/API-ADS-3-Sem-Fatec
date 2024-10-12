"use client";

import { useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";  // Importa js-cookie

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:3001/api/login', { email, password });
      const { token, userToken } = response.data;

      if (token) {
        Cookie.set("authToken", token);  // Armazena o token em cookies
        window.location.href = '/home/profile';  // Redireciona para a página de perfil
      } else if (userToken) {
        Cookie.set("userToken", userToken);  // Armazena userToken se necessário
        window.location.href = '/home/profile';
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError('Email ou senha incorretos');
      } else {
        setError('Erro desconhecido');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f9f9f9" }}>
      <div style={{ textAlign: "center", width: "300px" }}>
        <h2 style={{ color: "#357edd", marginBottom: "50px", marginLeft: "10px", fontSize: "30px" }}>Bem vindo! Acesse sua conta</h2>

        <div
          className="card"
          style={{
            padding: "40px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <p style={{ marginBottom: "15px", textAlign: "center" }}>É um grande prazer ter você a bordo!</p>

          <form onSubmit={handleLogin}>
            {error && <p className="alert alert-danger" style={{ color: 'red' }}>{error}</p>}

            <div className="mb-3">
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "4px",
                  borderColor: "#ccc",
                  marginBottom: "2px",
                }}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                id="senha"
                className="form-control"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "4px",
                  borderColor: "#ccc",
                  marginBottom: "20px",
                }}
                required
              />
            </div>

            <button
              type="submit"
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
          </form>

          {/* Link Esqueceu sua senha */}
          <p style={{ marginTop: "20px" }}>
            <a href="/codeforpassword" style={{ color: "#357edd" }}>Esqueceu sua senha?</a>
          </p>
        </div>
      </div>
    </div>
  );
}
