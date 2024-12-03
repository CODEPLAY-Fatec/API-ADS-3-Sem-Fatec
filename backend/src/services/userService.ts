import bcrypt from "bcrypt";
import { db } from "../config/database2";
import { User } from "../types/user";

// Obtém todos os usuários com detalhes de times e funções
export const getAllUsersWithDetails = async (): Promise<User[]> => {
    // Consulta para obter os usuários
    const usersQuery = `
        SELECT id, name, email, isAdmin, phoneNumber 
        FROM users;
    `;
    const [usersRows]: any = await db.query(usersQuery);

    // Consulta para obter os líderes de times
    const leadersQuery = `
        SELECT tl.user_id, t.name AS team_name 
        FROM team_leader tl 
        JOIN team t ON tl.team_id = t.id;
    `;
    const [leadersRows]: any = await db.query(leadersQuery);

    // Consulta para obter os membros de times
    const membersQuery = `
        SELECT tm.user_id, t.name AS team_name 
        FROM team_member tm 
        JOIN team t ON tm.team_id = t.id;
    `;
    const [membersRows]: any = await db.query(membersQuery);

    // Consulta para obter as fotos dos usuários
    const picturesQuery = `
        SELECT user_id, image 
        FROM user_pictures;
    `;
    const [picturesRows]: any = await db.query(picturesQuery);

    // Mapeia os papéis nos times (Líder e Membro)
    const teamRoles: { [key: number]: { team: string; role: string }[] } = {};

    // Adiciona os papéis de Líder
    leadersRows.forEach((row: any) => {
        const { user_id, team_name } = row;
        if (!teamRoles[user_id]) {
            teamRoles[user_id] = [];
        }
        teamRoles[user_id].push({ team: team_name, role: "Líder" });
    });

    // Adiciona os papéis de Membro
    membersRows.forEach((row: any) => {
        const { user_id, team_name } = row;
        if (!teamRoles[user_id]) {
            teamRoles[user_id] = [];
        }
        teamRoles[user_id].push({ team: team_name, role: "Membro" });
    });

    // Mapeia as fotos dos usuários
    const picturesMap: { [key: number]: string | null } = {};
    picturesRows.forEach((row: any) => {
        const { user_id, image } = row;
        picturesMap[user_id] = image ? image.toString("base64") : null; // Converte para Base64 (opcional)
    });

    // Retorna os usuários com as informações adicionais (papéis nos times e fotos)
    return usersRows.map((user: any) => ({
        ...user,
        teamRoles: teamRoles[user.id] || [], // Adiciona os papéis nos times
        photo: picturesMap[user.id] || null, // Adiciona a foto (null se não existir)
    }));
};

interface CreateUserParams {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    isAdmin: boolean;
}

export const createUser = async ({ name, email, password, phoneNumber, isAdmin }: CreateUserParams) => {
    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    const [existingUser]: any = await db.query(checkEmailQuery, [email]);

    if (existingUser.length > 0) throw new Error("Este email já está em uso.");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertQuery = `
    INSERT INTO users (name, email, password, isAdmin, phoneNumber) 
    VALUES (?, ?, ?, ?, ?)
  `;
    const [result]: any = await db.query(insertQuery, [name, email, hashedPassword, isAdmin, phoneNumber]);

    return { id: result.insertId, name, email, phoneNumber, isAdmin };
};

// Atualiza um usuário
export const updateUser = async (id: number, user: Partial<User>): Promise<void> => {
    const fields = [];
    const values = [];

    if (user.name !== undefined) {
        fields.push("name = ?");
        values.push(user.name);
    }
    if (user.email !== undefined) {
        fields.push("email = ?");
        values.push(user.email);
    }
    if (user.password !== undefined) {
        fields.push("password = ?");
        values.push(user.password);
    }
    if (user.isAdmin !== undefined) {
        fields.push("isAdmin = ?");
        values.push(user.isAdmin);
    }
    if (user.phoneNumber !== undefined) {
        fields.push("phoneNumber = ?");
        values.push(user.phoneNumber);
    }

    values.push(id);

    const query = `
    UPDATE users SET ${fields.join(", ")} 
    WHERE id = ?
  `;
    await db.query(query, values);
};

export const updateUserPhoto = async (id: number, photo: Buffer): Promise<void> => {
    const query = `
    INSERT INTO user_pictures (user_id, image) 
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE image = VALUES(image);
  `;
    await db.query(query, [id, photo]);
};

// Deleta um usuário
export const deleteUser = async (id: number): Promise<void> => {
    const query = "DELETE FROM users WHERE id = ?";
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
