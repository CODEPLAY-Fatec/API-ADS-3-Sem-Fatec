import express from 'express';
import { alterarSenhaController } from '../controllers/passwordController';

const router = express.Router();

router.post('/change_password', alterarSenhaController);

export default router;
