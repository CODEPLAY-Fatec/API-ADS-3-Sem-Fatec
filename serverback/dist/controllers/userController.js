"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadersController = exports.deleteUserController = exports.updateUserController = exports.createUserController = exports.getUsersController = void 0;
const userService_1 = require("../services/userService"); // Ajuste conforme necessário
const getUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userService_1.getAllUsers)();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getUsersController = getUsersController;
// Adicione outras funções conforme necessário
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    try {
        const newUser = yield (0, userService_1.createUser)(user);
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.createUserController = createUserController;
const updateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.body;
    try {
        yield (0, userService_1.updateUser)(Number(id), user);
        res.status(204).send(); // No Content
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.updateUserController = updateUserController;
const deleteUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield (0, userService_1.deleteUser)(Number(id));
        res.status(204).send(); // No Content
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.deleteUserController = deleteUserController;
const getLeadersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaders = yield (0, userService_1.getLeaders)(); // Supondo que você tenha uma função para obter líderes
        res.json(leaders);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getLeadersController = getLeadersController;
