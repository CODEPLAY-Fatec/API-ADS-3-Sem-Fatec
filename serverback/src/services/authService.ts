import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/database2';
import { User } from '../types/user';
require('dotenv').config();

const secretKey = process.env.SECRET_KEY || 'default-secret';
const userSecretKey = process.env.USER_SECRET_KEY || 'default-user-secret';

export const login = async (email: string, password: string): Promise<{ token?: string; userToken?: string }> => {
  const query = 'SELECT * FROM users WHERE email = ?';
  const [results]: any = await db.query(query, [email]);

  if (results.length === 0) {
    throw new Error('Usuário não encontrado.');
  }

  const user = results[0] as User;
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (isPasswordCorrect) {
    const leaderQuery = 'SELECT EXISTS (SELECT 1 FROM team_leader WHERE user_id = ?) AS isTeamLeader';
    const [leaderResult]: any = await db.query(leaderQuery, [user.id]);
    const isTeamLeader = leaderResult[0].isTeamLeader === 1;

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isTeamLeader
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
