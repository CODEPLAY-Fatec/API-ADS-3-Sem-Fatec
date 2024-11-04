import bcrypt from 'bcrypt';
import { db } from '../config/database2';

export const verificarSenhaAtual = async (userId: number, senhaAtual: string): Promise<boolean> => {
  const query = 'SELECT password FROM users WHERE id = ?';
  const [rows]: any = await db.query(query, [userId]);

  if (rows.length === 0) throw new Error('Usuário não encontrado.');

  const senhaCorreta = rows[0].password;
  return await bcrypt.compare(senhaAtual, senhaCorreta);
};

export const atualizarSenha = async (userId: number, novaSenha: string): Promise<void> => {
  const hashedPassword = await bcrypt.hash(novaSenha, 10);
  const query = 'UPDATE users SET password = ? WHERE id = ?';
  await db.query(query, [hashedPassword, userId]);
};
