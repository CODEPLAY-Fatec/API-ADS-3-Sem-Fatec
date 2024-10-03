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
exports.getLeaders = exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const database2_1 = require("../config/database2");
// Obtém todos os usuários
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT * FROM users';
    const [results] = yield database2_1.db.query(query);
    return results; // Retorna todos os usuários
});
exports.getAllUsers = getAllUsers;
// Cria um novo usuário
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'INSERT INTO users (name, password, isAdmin, isLeader) VALUES (?, ?, ?, ?)';
    const [result] = yield database2_1.db.query(query, [user.name, user.password, user.isAdmin, user.isLeader]);
    return Object.assign({ id: result.insertId }, user); // Retorna o usuário criado
});
exports.createUser = createUser;
// Atualiza um usuário
const updateUser = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'UPDATE users SET name = ?, password = ?, isAdmin = ?, isLeader = ? WHERE id = ?';
    yield database2_1.db.query(query, [user.name, user.password, user.isAdmin, user.isLeader, id]);
});
exports.updateUser = updateUser;
// Deleta um usuário
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'DELETE FROM users WHERE id = ?';
    yield database2_1.db.query(query, [id]);
});
exports.deleteUser = deleteUser;
// Função para obter líderes (caso necessário)
const getLeaders = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT * FROM users WHERE isLeader = TRUE';
    const [results] = yield database2_1.db.query(query);
    return results; // Retorna todos os líderes
});
exports.getLeaders = getLeaders;
