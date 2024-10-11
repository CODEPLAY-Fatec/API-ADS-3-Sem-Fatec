// controllers/userController.ts
import { Request, Response } from 'express';
import { getAllUsersWithDetails, createUser,updateUser,deleteUser, getLeaders } from '../services/userService'; 

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersWithDetails(); // Função que retorna usuario com mais informaçoes, arrumar depois para verificar sua posiçao nos times
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


// Adicione outras funções conforme necessário
export const createUserController = async (req: Request, res: Response) => {
  const { name, email, password, isAdmin } = req.body;

  try {
    const newUser = await createUser(name, email, password, isAdmin);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.body;
  try {
    await updateUser(Number(id), user);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};  

export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteUser(Number(id));
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getLeadersController = async (req: Request, res: Response) => {
  try {
    const leaders = await getLeaders();
    res.json(leaders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
