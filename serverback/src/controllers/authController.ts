import { Request, Response } from 'express';
import { login } from '../services/authService';
import { sendPasswordRecoveryEmail, updatePassword, verificarCodigoRecuperacao } from '../services/emailService';
import bcrypt from 'bcrypt';

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const tokens = await login(email, password);

    // Verifique qual token foi retornado e responda apropriadamente
    if (tokens.token) {
      res.json({ token: tokens.token }); // Para administradores
    } else if (tokens.userToken) {
      res.json({ userToken: tokens.userToken }); // Para usuários comuns
    } else {
      throw new Error('Erro ao gerar token.');
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

//controller para o email e codigo 


export const passwordRecovery = async (req: Request, res: Response) => {
  const { email } = req.body;

  // Gere um código de recuperação
  const recoveryCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    
    const userId = await sendPasswordRecoveryEmail(email, recoveryCode);

    if (userId) {
      return res.status(200).json({ message: 'E-mail de recuperação enviado com sucesso!', userId });
    } else {
      return res.status(404).json({ message: 'E-mail não encontrado.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao enviar e-mail de recuperação.' });
  }
};

// Controller para verificar o código de recuperação
export const verificarCodigo = (req: Request, res: Response) => {
  const { email, codigo } = req.body;

  if (!email || !codigo) {
    return res.status(400).json({ success: false, message: 'E-mail e código são obrigatórios.' });
  }

  const codigoValido = verificarCodigoRecuperacao(email, codigo);

  if (codigoValido) {
    return res.status(200).json({ success: true, message: 'Código verificado com sucesso.' });
  } else {
    return res.status(400).json({ success: false, message: 'Código inválido ou expirado.' });
  }
};

// Controller para atualizar a senha do usuário
export const updateUserPassword = async (req: Request, res: Response) => {
  const { userId, novaSenha } = req.body;

  if (!userId || !novaSenha ) {
    return res.status(400).json({ success: false, message: 'ID do usuário e nova senha são obrigatórios.' });
  }

  try {   
    const hashedPassword = await bcrypt.hash(novaSenha , 10);

    await updatePassword(userId, hashedPassword);

    return res.status(200).json({ success: true, message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao atualizar a senha.' });
  }
};