import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/database2';
import { User } from '../types/user';

const secretKey = 'secreta-chave';

export const login = async (name: string, password: string): Promise<string | null> => {
  const query = 'SELECT * FROM users WHERE name = ?';

  // Removido o argumento de tipo diretamente na função `query`
  const [results]: any = await db.query(query, [name]);

  if (results.length === 0) {
    throw new Error('Usuário não encontrado.');
  }

  const user = results[0] as User;  
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (isPasswordCorrect) {
    const token = jwt.sign({ id: user.id, name: user.name, isAdmin: user.isAdmin }, secretKey, { expiresIn: '1h' });
    return token;
  } else {
    throw new Error('Senha incorreta.');
  }
};


