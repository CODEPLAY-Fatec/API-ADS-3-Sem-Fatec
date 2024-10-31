import { Router } from 'express';
import {
    getUsersController,
    createUserController,
    updateUserController,
    deleteUserController,
    getLeadersController,
    getUserSurveysController
} from '../controllers/userController';

const router = Router();

// Rotas para usuários
router.get('/users', getUsersController);
router.post('/users', createUserController);
router.put('/users/:id', updateUserController);
router.delete('/users/:id', deleteUserController);
router.get('/users/surveys/:id', getUserSurveysController)
// Rota para obter líderes
router.get('/leaders', getLeadersController);

export default router;
