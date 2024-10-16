"use client";
import React, { useState } from 'react';

const RecuperacaoSenha: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log('E-mail para recuperação enviado:', email);
  };

  return (
    <div style={styles.container}>
      <div>
        <h2 style={styles.title}>Recupere sua senha</h2>
        <p style={styles.text}>Insira seu e-mail para redefinir sua senha.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

// Estilos em um objeto JavaScript
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
};

export default RecuperacaoSenha;