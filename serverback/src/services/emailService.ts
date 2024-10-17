import nodemailer from 'nodemailer';
import { db } from "../config/database2";
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do .env
dotenv.config();

const EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutos de validade para o código

interface RecoveryData {
  code: string;
  expiresAt: number;
}

const recoveryCodes: { [email: string]: RecoveryData } = {};

// Função para verificar o e-mail e enviar o código de recuperação
export const sendPasswordRecoveryEmail = async (recipientEmail: string, recoveryCode: string): Promise<number | null> => {
  try {
    // Verifica se o e-mail existe no banco de dados
    const [rows]: any = await db.query('SELECT id FROM users WHERE email = ?', [recipientEmail]);

    if (rows.length === 0) {
      return null; // E-mail não encontrado
    }

    const userId = rows[0].id;

    // Configuração do transportador de e-mails
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'quantum.recupera@gmail.com',
        pass: process.env.EMAIL_PASS, // no .env
      },
    });

    const mailOptions = {
      from: '"Quantum recovery" <quantum.recupera@gmail.com>',
      to: recipientEmail,
      subject: 'Caro usuário, aqui está seu código para recuperação de senha.',
      text: `Seu código de recuperação é: ${recoveryCode}`,
    };

    // Envia o e-mail
    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado para: %s', recipientEmail);

    // Armazena o código e o tempo de expiração
    recoveryCodes[recipientEmail] = {
      code: recoveryCode,
      expiresAt: Date.now() + EXPIRATION_TIME,
    };

    return userId; // Retorna o id do usuário para dar update na senha

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return null;
  }
};

// Função para verificar o código de recuperação
export const verificarCodigoRecuperacao = (email: string, code: string): boolean => {
  const recoveryData = recoveryCodes[email];

  if (!recoveryData) {
    return false; 
  }

  const { code: storedCode, expiresAt } = recoveryData;

  if (storedCode === code && Date.now() <= expiresAt) {
    delete recoveryCodes[email]; // Código válido, remove-o
    return true;
  }

  return false; // Código inválido ou expirado
};

// Função para atualizar a senha do usuário
export const updatePassword = async (userId: number, newPassword: string): Promise<void> => {
  const query = 'UPDATE users SET password = ? WHERE id = ?';
  await db.query(query, [newPassword, userId]);
};
