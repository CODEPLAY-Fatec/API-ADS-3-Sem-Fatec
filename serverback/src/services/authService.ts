import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/database2';
import { User } from '../types/user';

const secretKey = 'secreta-chave';
const userSecretKey = 'outra-chave-secreta'; // Chave secreta para usuários comuns

export const login = async (email: string, password: string): Promise<{ token?: string; userToken?: string }> => {
  const query = 'SELECT * FROM users WHERE email = ?';
  const [results]: any = await db.query(query, [email]);

  if (results.length === 0) {
    throw new Error('Usuário não encontrado.');
  }

  const user = results[0] as User;  
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (isPasswordCorrect) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email, 
      isAdmin: user.isAdmin
    };

    if (user.isAdmin) {
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
      return { token }; 
    } else {
      const userToken = jwt.sign(payload, userSecretKey, { expiresIn: '1h' });
      return { userToken }; 
    }
  } else {
    throw new Error('Senha incorreta.');
  }
};
