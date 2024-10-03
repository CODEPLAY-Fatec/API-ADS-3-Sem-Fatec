import { db } from '../config/database2';
import { User } from '../types/user'; // Ajuste o caminho conforme necessário

// Obtém todos os usuários
export const getAllUsers = async (): Promise<User[]> => {
  const query = 'SELECT * FROM users';
  const [results]: any = await db.query(query);
  return results; // Retorna todos os usuários
};

// Cria um novo usuário
export const createUser = async (user: Partial<User>): Promise<User> => {
  const query = 'INSERT INTO users (name, password, isAdmin, isLeader) VALUES (?, ?, ?, ?)';
  const [result]: any = await db.query(query, [user.name, user.password, user.isAdmin, user.isLeader]);
  return { id: result.insertId, ...user } as User; // Retorna o usuário criado
};

// Atualiza um usuário
export const updateUser = async (id: number, user: Partial<User>): Promise<void> => {
  const query = 'UPDATE users SET name = ?, password = ?, isAdmin = ?, isLeader = ? WHERE id = ?';
  await db.query(query, [user.name, user.password, user.isAdmin, user.isLeader, id]);
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
  return results; // Retorna todos os líderes
};
