import nodemailer from 'nodemailer';
import { db } from "../config/database2";
import dotenv from 'dotenv';

dotenv.config();

const EXPIRATION_TIME = 10 * 60 * 1000; 

interface RecoveryData {
  code: string;
  expiresAt: number;
}

const recoveryCodes: { [email: string]: RecoveryData } = {};

export const sendPasswordRecoveryEmail = async (recipientEmail: string, recoveryCode: string): Promise<number | null> => {
  try {
    const [rows]: any = await db.query('SELECT id FROM users WHERE email = ?', [recipientEmail]);

    if (rows.length === 0) {
      return null;
    }

    const userId = rows[0].id;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'quantum.recupera@gmail.com',
        pass: process.env.EMAIL_PASS, 
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <p>Prezado usuário,</p>
        <p>Aqui está o código para recuperar sua senha:</p>
        <p style="font-size: 24px; font-weight: bold; color: #4A90E2; text-align: center; letter-spacing: 2px;">${recoveryCode}</p>
        <p>Esse código é válido por 10 minutos.</p>
        <p>Se você não solicitou a recuperação de senha, por favor, ignore este e-mail.</p>
        <br>
        <p>Atenciosamente,</p>
        <p><strong>Quantum Enterprise</strong></p>
      </div>
    `;

    const mailOptions = {
      from: '"Quantum Enterprise" <quantum.recupera@gmail.com>',
      to: recipientEmail,
      subject: 'Recuperação de Senha',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado para: %s', recipientEmail);

    recoveryCodes[recipientEmail] = {
      code: recoveryCode,
      expiresAt: Date.now() + EXPIRATION_TIME,
    };

    return userId; 

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return null;
  }
};

export const verificarCodigoRecuperacao = (email: string, code: string): boolean => {
  const recoveryData = recoveryCodes[email];

  if (!recoveryData) {
    return false; 
  }

  const { code: storedCode, expiresAt } = recoveryData;

  if (storedCode === code && Date.now() <= expiresAt) {
    delete recoveryCodes[email]; 
    return true;
  }

  return false;
};


export const updatePassword = async (userId: number, newPassword: string): Promise<void> => {
  const query = 'UPDATE users SET password = ? WHERE id = ?';
  await db.query(query, [newPassword, userId]);
};
