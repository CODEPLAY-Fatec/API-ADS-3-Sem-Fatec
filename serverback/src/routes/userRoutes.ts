import { Router } from 'express';
import {
    getUsersController,
    createUserController,
    updateUserController,
    deleteUserController,
    getLeadersController,
} from '../controllers/userController';

const router = Router();

// Rotas para usuários
//router.get('/users', getUsersController);
router.post('/users', createUserController);
router.put('/users/:id', updateUserController);
router.delete('/users/:id', deleteUserController);

// Rota para obter líderes
router.get('/leaders', getLeadersController);

export default router;
