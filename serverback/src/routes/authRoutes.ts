import { Router } from 'express';
import { loginController, passwordRecovery, updateUserPassword, verificarCodigo } from '../controllers/authController';

const router = Router();

router.post('/login', loginController); // Rota de login
router.post('/recover-password', passwordRecovery);
router.post('/verificar-codigo', verificarCodigo);
router.put('/update-password', updateUserPassword);



export default router;
