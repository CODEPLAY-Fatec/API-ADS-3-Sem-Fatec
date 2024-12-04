"use client";

import axios from "axios";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post("/api/login", { email, password });
            const { token, userToken } = response.data;

            if (token) {
                Cookie.set("authToken", token);
                window.location.href = "/home/profile";
            } else if (userToken) {
                Cookie.set("userToken", userToken);
                window.location.href = "/home/profile";
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError("Email ou senha incorretos");
            } else {
                setError("Erro desconhecido");
            }
        }
    };

    return (
        <div className="h-screen flex justify-center items-center relative overflow-hidden">
            {isClient && (
                <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: -1 }}>
                    <source src="/images/video.mp4" type="video/mp4" />
                    Seu navegador não suporta o vídeo em HTML5.
                </video>
            )}

            <div className="absolute inset-0 bg-black opacity-40"></div>

            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[400px] mx-4 md:mx-auto my-auto relative z-10">
                <h2 className="text-xl font-semibold text-center mb-6 text-[#357edd]">Bem vindo! Acesse sua conta</h2>

                <form onSubmit={handleLogin} aria-live="assertive">
                    {error && <p className="text-center text-red-500 mb-3 text-sm">{error}</p>}

                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#357edd] focus:border-[#357edd] text-sm"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            id="senha"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#357edd] focus:border-[#357edd] text-sm"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white py-2 px-4 rounded-md text-sm font-medium"
                        style={{ backgroundColor: "#357edd" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2d6dc2")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#357edd")}
                    >
                        Login
                    </button>
                </form>

                <p className="text-center mt-4">
                    <a href="/codeforpassword" className="text-[#357edd]">
                        Esqueceu sua senha?
                    </a>
                </p>
            </div>
        </div>
    );
}
