"use client";
import React, { useState } from 'react';
import './code.css';
import { useRouter } from "next/navigation";
import axios from 'axios';

const RecuperacaoSenha: React.FC = () => {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigoCorreto, setCodigoCorreto] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [userId, setUserId] = useState<number | null>(null); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  // Função para enviar a solicitação de recuperação de senha
  const handlePasswordRecovery = async (email: string) => {
    setLoading(true); 
    try {
      const response = await axios.post('http://localhost:3001/api/recover-password', { email });
      console.log(response.data.message);
      setCodigoEnviado(true);
      setUserId(response.data.userId);
    } catch (error) {
      console.error('Erro ao enviar solicitação de recuperação de senha:', error);
      alert('Email não existe');
    } finally {
      setLoading(false); 
    }
  };

  // Função para verificar o código de recuperação
  const verificarCodigo = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/verificar-codigo', { email, codigo });
      if (response.data.success) {
        setCodigoCorreto(true); 
      } else {
        alert('Código incorreto, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao verificar o código:', error);
      alert('Erro ao verificar o código. Tente novamente.');
    }
  };

  // Função para redefinir a senha
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      await axios.put('http://localhost:3001/api/update-password', { userId, novaSenha });
      alert('Senha redefinida com sucesso!');
      router.push('/'); 
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      alert('Erro ao redefinir a senha. Tente novamente.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f9f9f9" }}>
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        {!codigoEnviado && (
          <>
            <h2 className="mb-4 text-center" style={{ color: "#357edd" }}>Recupere sua senha</h2>
            <p className="mb-3 text-center">Insira seu e-mail para redefinir sua senha.</p>
          </>
        )}

        {!codigoEnviado ? (
          // Formulário para enviar o e-mail
          <form onSubmit={(e) => { e.preventDefault(); handlePasswordRecovery(email); }}>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" style={{ width: "48%" }} onClick={() => router.push("/home/profile")}>
                Voltar
              </button>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#357edd", width: "48%" }} disabled={loading}>
                {loading ? 'Aguarde...' : 'Enviar'}
              </button>
            </div>
          </form>
        ) : !codigoCorreto ? (
          // Formulário para verificar o código de recuperação
          <div>
            <p className="text-center mb-3">Insira o código enviado para seu e-mail.</p>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Digite o código"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" style={{ width: "48%" }} onClick={() => router.push("/home/profile")}>
                Voltar
              </button>
              <button onClick={verificarCodigo} className="btn btn-primary" style={{ backgroundColor: "#357edd", width: "48%" }}>
                Verificar Código
              </button>
            </div>
          </div>
        ) : (
          // Formulário para redefinir a senha
          <div>
            <h2 className="mb-4 text-center" style={{ color: "#357edd" }}>Defina sua nova senha</h2>
            <form onSubmit={handlePasswordReset}>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Nova senha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Confirme sua nova senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              {error && <p className="alert alert-danger text-center">{error}</p>}

              <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: "#357edd" }}>
                Redefinir Senha
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecuperacaoSenha;
