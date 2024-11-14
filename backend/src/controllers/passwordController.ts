import { Request, Response } from 'express';
import { verificarSenhaAtual, atualizarSenha } from '../services/passwordService';

export const alterarSenhaController = async (req: Request, res: Response) => {
  const { userId } = req.body; // Pode ser extraído do token de autenticação ou da sessão
  const { current_password, new_password, confirm_password } = req.body;

  if (!current_password || !new_password || !confirm_password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  if (new_password !== confirm_password) {
    return res.status(400).json({ message: 'A nova senha e a confirmação não correspondem.' });
  }

  try {
    const senhaValida = await verificarSenhaAtual(userId, current_password);

    if (!senhaValida) {
      return res.status(400).json({ message: 'A senha atual está incorreta.' });
    }

    await atualizarSenha(userId, new_password);
    return res.status(200).json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar a senha.' });
  }
};
