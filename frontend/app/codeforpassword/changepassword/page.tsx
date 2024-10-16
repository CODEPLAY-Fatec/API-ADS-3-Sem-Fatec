"use client";
import React, { useState } from 'react';

const NovaSenha: React.FC = (): JSX.Element => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem!');
      return;
    }
    // Lógica para redefinir a senha
    console.log('Nova senha definida com sucesso!');
  };

  return (
    <div style={styles.container}>
      <div>
        <h2 style={styles.title}>Defina sua nova senha</h2>
        <p style={styles.text}>Digite sua nova senha abaixo.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Confirme sua nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            style={styles.input}
          />
          {error && <p style={styles.errorText}>{error}</p>}
          <button type="submit" style={styles.button}>
            Redefinir Senha
          </button>
        </form>
      </div>
    </div>
  );
};

// Estilos
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  formBox: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    marginBottom: '15px',
    color: '#2d5cc7',
  },
  text: {
    marginBottom: '20px',
    fontSize: '14px',
    color: '#666',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#2d5cc7',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  errorText: {
    color: 'red',
    fontSize: '12px',
    marginTop: '10px',
  },
};

export default NovaSenha;
