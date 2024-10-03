// routes/userRoutes.ts
import { Router } from 'express';
import { getUsersController, createUserController, updateUserController, deleteUserController } from '../controllers/userController';

const router = Router();

router.get('/', getUsersController);
router.post('/', createUserController);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

export default router;
