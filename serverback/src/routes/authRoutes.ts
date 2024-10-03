import { Router } from 'express';
import { loginController } from '../controllers/authController';

const router = Router();

router.post('/login', loginController); // Rota de login



export default router;
