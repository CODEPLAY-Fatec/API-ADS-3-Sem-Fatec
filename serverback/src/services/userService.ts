import { db } from '../config/database2';
import { User } from '../types/user'; 
import bcrypt from 'bcrypt';

// Obtém todos os usuários
export const getAllUsersWithDetails = async () => {
  const query = `
    SELECT 
      u.id, u.name, u.email, u.isAdmin,
      GROUP_CONCAT(DISTINCT t.name) as teams,
      IF(tl.user_id IS NOT NULL, 'Líder', 'Liderado') as role
    FROM users u
    LEFT JOIN team_leader tl ON u.id = tl.user_id
    LEFT JOIN team_member tm ON u.id = tm.user_id
    LEFT JOIN team t ON tl.team_id = t.id OR tm.team_id = t.id
    GROUP BY u.id
  `;

  const [rows] = await db.query(query);
  return rows;
};

// Cria um novo usuário
export const createUser = async (name: string, email: string, password: string, isAdmin: boolean) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const query = 'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)';
  await db.query(query, [name, email, hashedPassword, isAdmin]);

  return { name, email, isAdmin };
};

// Atualiza um usuário
export const updateUser = async (id: number, user: Partial<User>): Promise<void> => {
  const query = 'UPDATE users SET name = ?, password = ?, isAdmin = ?, isLeader = ? WHERE id = ?';
  await db.query(query, [user.name, user.password, user.isAdmin,id]);
}; 

// Deleta um usuário
export const deleteUser = async (id: number): Promise<void> => {
  const query = 'DELETE FROM users WHERE id = ?';
  await db.query(query, [id]);
};

// Função para obter líderes (caso necessário)
export const getLeaders = async (): Promise<User[]> => {
  const query = 'SELECT * FROM users WHERE isLeader = TRUE';
  const [results]: any = await db.query(query);
  return results; 
};
