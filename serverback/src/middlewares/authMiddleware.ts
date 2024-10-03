// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '../types/user'; // Importar o tipo User, ajuste o caminho conforme necessário

declare module 'express-serve-static-core' {
  interface Request {
    User?: User;
  }
}
import jwt from 'jsonwebtoken';

const secretKey = 'secreta-chave';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as User;
    req.User = decoded; // Agora a tipagem está correta
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};
