"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes")); // Rotas de usuários
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Rotas de autenticação
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middlewares
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Usando as rotas
app.use('/api', routes_1.default); // Rotas de usuários
app.use('/api', authRoutes_1.default); // Rotas de autenticação (incluindo login)
// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
