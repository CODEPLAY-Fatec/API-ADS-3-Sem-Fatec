import { Router } from 'express';
import {
    getUsersController,       // Corrigido
    createUserController,     // Corrigido
    updateUserController,     // Corrigido
    deleteUserController,     // Corrigido
    getLeadersController,     // Adicione isso
} from './controllers/userController'; // Corrigido

const router = Router();

// Rota para obter usuários
router.get('/users', getUsersController); // Corrigido

// Rota para criar um usuário
router.post('/users', createUserController); // Corrigido

// Rota para atualizar um usuário
router.put('/users/:id', updateUserController); // Corrigido

// Rota para deletar um usuário
router.delete('/users/:id', deleteUserController); // Corrigido

// Rota para obter líderes
router.get('/leaders', getLeadersController); // Adicione isso



export default router;
