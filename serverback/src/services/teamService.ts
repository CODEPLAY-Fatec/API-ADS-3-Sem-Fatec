import { db } from '../config/database2'; 
import { Team } from '../types/team'; 
import { User } from '../types/user'; 
import { ResultSetHeader } from 'mysql2';

// Função para adicionar um time
export const addTeam = async (name: string): Promise<number> => {
    const [result]: any = await db.query('INSERT INTO team (name) VALUES (?)', [name]);

    if (result && 'insertId' in result) {
        return result.insertId; // Retorna o ID do time criado
    } else {
        throw new Error('Erro ao criar o time. insertId não encontrado.');
    }
};


// Função para associar um líder a um time
export const assignLeader = async (teamId: number, userId: number): Promise<void> => {
    await db.query('INSERT INTO team_leader (team_id, user_id) VALUES (?, ?)', [teamId, userId]);
};

// Função para associar um membro a um time
export const assignMember = async (teamId: number, userId: number): Promise<void> => {
    await db.query('INSERT INTO team_member (team_id, user_id) VALUES (?, ?)', [teamId, userId]);
};


//funçao para pegar todos os times e mostrar na tela
export const getAllTeams = async () => {
    const query = 'SELECT * FROM team';
    const [rows] = await db.query(query);
    return rows;
  };

  // Função para pegar todos os usuários
export const getAllUsers = async (): Promise<User[]> => {
    const query = 'SELECT * FROM users'; 
    const [rows] = await db.query(query);
    return rows as User[];
};

// Função para buscar líderes de um time
export const getLeadersByTeamId = async (teamId: number) => {
    const leaders = await db.query('SELECT u.id, u.name FROM team_leader tl JOIN users u ON tl.user_id = u.id WHERE tl.team_id = ?', [teamId]);
    return leaders[0]; // Retorna a lista de líderes
};

// Função para buscar membros de um time
export const getMembersByTeamId = async (teamId: number) => {
    const members = await db.query('SELECT u.id, u.name FROM team_member tm JOIN users u ON tm.user_id = u.id WHERE tm.team_id = ?', [teamId]);
    return members[0]; // Retorna a lista de membros
};

export const removeTeam = async (teamId: number): Promise<void> => {
    await db.query('DELETE FROM team WHERE id = ?', [teamId]);
};

export const removeUserFromTeam = async (teamId: number, userId: number): Promise<void> => {
    // Tenta remover da tabela de líderes e membros
    await db.query('DELETE FROM team_leader WHERE team_id = ? AND user_id = ?', [teamId, userId]);
    await db.query('DELETE FROM team_member WHERE team_id = ? AND user_id = ?', [teamId, userId]);
};


