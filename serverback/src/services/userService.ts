import { db } from '../config/database2';
import { User } from '../types/user'; 
import bcrypt from 'bcrypt';

// Obtém todos os usuários
export const getAllUsersWithDetails = async (): Promise<User[]> => {
  const usersQuery = `SELECT u.id, u.name, u.email, u.isAdmin FROM users u;`;
  const [usersRows]: any = await db.query(usersQuery); 

  
  const leadersQuery = `SELECT tl.user_id, t.name AS team_name FROM team_leader tl JOIN team t ON tl.team_id = t.id;`;
  const [leadersRows]: any = await db.query(leadersQuery); 

  
  const membersQuery = `SELECT tm.user_id, t.name AS team_name FROM team_member tm JOIN team t ON tm.team_id = t.id;`;
  const [membersRows]: any = await db.query(membersQuery); 

  // Criar um objeto para armazenar as funções dos usuários
  const teamRoles: { [key: number]: { team: string; role: string }[] } = {};

  // Adicionar líderes
  leadersRows.forEach((row: any) => {
      const { user_id, team_name } = row;
      if (!teamRoles[user_id]) {
          teamRoles[user_id] = [];
      }
      teamRoles[user_id].push({ team: team_name, role: 'Líder' });
  });

  // Adicionar membros
  membersRows.forEach((row: any) => {
      const { user_id, team_name } = row;
      if (!teamRoles[user_id]) {
          teamRoles[user_id] = [];
      }
      teamRoles[user_id].push({ team: team_name, role: 'Membro' });
  });

  return usersRows.map((user: any) => ({
      ...user,
      teamRoles: teamRoles[user.id] || [],
  }));
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
