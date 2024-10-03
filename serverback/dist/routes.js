"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("./controllers/userController"); // Corrigido
const router = (0, express_1.Router)();
// Rota para obter usuários
router.get('/users', userController_1.getUsersController); // Corrigido
// Rota para criar um usuário
router.post('/users', userController_1.createUserController); // Corrigido
// Rota para atualizar um usuário
router.put('/users/:id', userController_1.updateUserController); // Corrigido
// Rota para deletar um usuário
router.delete('/users/:id', userController_1.deleteUserController); // Corrigido
// Rota para obter líderes
router.get('/leaders', userController_1.getLeadersController); // Adicione isso
exports.default = router;
