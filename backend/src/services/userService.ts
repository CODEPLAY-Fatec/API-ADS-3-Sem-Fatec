import { db } from '../config/database2';
import { User } from '../types/user';
import bcrypt from 'bcrypt';

// Obtém todos os usuários com detalhes de times e funções
export const getAllUsersWithDetails = async (): Promise<User[]> => {
  const usersQuery = `SELECT id, name, email, isAdmin, phoneNumber FROM users;`;
  const [usersRows]: any = await db.query(usersQuery);

  const leadersQuery = `
    SELECT tl.user_id, t.name AS team_name 
    FROM team_leader tl 
    JOIN team t ON tl.team_id = t.id;
  `;
  const [leadersRows]: any = await db.query(leadersQuery);

  const membersQuery = `
    SELECT tm.user_id, t.name AS team_name 
    FROM team_member tm 
    JOIN team t ON tm.team_id = t.id;
  `;
  const [membersRows]: any = await db.query(membersQuery);

  // Objeto para armazenar os roles dos usuários
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

  // Retornar os usuários com o campo `teamRoles` no formato antigo
  return usersRows.map((user: any) => ({
    ...user,
    teamRoles: teamRoles[user.id] || [],
  }));
};


// Cria um novo usuário
export const createUser = async (name: string, email: string, password: string, isAdmin: boolean, phoneNumber: string) => {
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  const [existingUser]: any = await db.query(checkEmailQuery, [email]);

  if (existingUser.length > 0) throw new Error('Este email já está em uso.');

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const insertQuery = `
    INSERT INTO users (name, email, password, isAdmin, phoneNumber) 
    VALUES (?, ?, ?, ?, ?)
  `;
  await db.query(insertQuery, [name, email, hashedPassword, isAdmin, phoneNumber]);

  return { name, email, isAdmin, phoneNumber };
};

// Atualiza um usuário
export const updateUser = async (id: number, user: Partial<User>): Promise<void> => {
  const query = `
    UPDATE users SET name = ?, email = ?, password = ?, isAdmin = ?, phoneNumber = ? 
    WHERE id = ?
  `;
  await db.query(query, [user.name, user.email, user.password, user.isAdmin, user.phoneNumber, id]);
};

// Deleta um usuário
export const deleteUser = async (id: number): Promise<void> => {
  const query = 'DELETE FROM users WHERE id = ?';
  await db.query(query, [id]);
};

// Obtém todos os líderes
export const getLeaders = async (): Promise<User[]> => {
  const query = `
    SELECT u.id, u.name, u.email, u.phoneNumber 
    FROM users u 
    JOIN team_leader tl ON u.id = tl.user_id;
  `;
  const [results]: any = await db.query(query);
  return results;
};
