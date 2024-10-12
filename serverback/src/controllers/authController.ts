import { Request, Response } from 'express';
import { login } from '../services/authService';

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
