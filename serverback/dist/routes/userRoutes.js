"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/userRoutes.ts
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.get('/', userController_1.getUsersController);
router.post('/', userController_1.createUserController);
router.put('/:id', userController_1.updateUserController);
router.delete('/:id', userController_1.deleteUserController);
exports.default = router;
