import { Router } from "express";
import multer from "multer";
import { createUserController, deleteUserController, getLeadersController, getUsersController, updateUserController } from "../controllers/userController";

const router = Router();
const upload = multer();

// Rotas para usuários
router.get("/users", getUsersController);
router.post("/users", upload.single("photo"), createUserController);
router.put("/users/:id", updateUserController);
router.delete("/users/:id", deleteUserController);
// Rota para obter líderes
router.get("/leaders", getLeadersController);

export default router;
