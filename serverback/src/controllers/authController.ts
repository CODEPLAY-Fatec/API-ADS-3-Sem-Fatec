import { Request, Response } from 'express';
import { login } from '../services/authService';

export const loginController = async (req: Request, res: Response) => {
  const { name, password } = req.body;

  try {
    const token = await login(name, password);
    res.json({ token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
