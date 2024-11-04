import express from 'express';
import { alterarSenhaController } from '../controllers/passwordController';

const router = express.Router();

router.put('/change_password', alterarSenhaController);

export default router; 
