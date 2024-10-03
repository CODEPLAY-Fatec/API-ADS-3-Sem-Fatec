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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database2_1 = require("../config/database2");
const secretKey = 'secreta-chave';
const login = (name, password) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT * FROM users WHERE name = ?';
    // Removido o argumento de tipo diretamente na função `query`
    const [results] = yield database2_1.db.query(query, [name]);
    if (results.length === 0) {
        throw new Error('Usuário não encontrado.');
    }
    const user = results[0];
    const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
    if (isPasswordCorrect) {
        const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, isAdmin: user.isAdmin }, secretKey, { expiresIn: '1h' });
        return token;
    }
    else {
        throw new Error('Senha incorreta.');
    }
});
exports.login = login;
