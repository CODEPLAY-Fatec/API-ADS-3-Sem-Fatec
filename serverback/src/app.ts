import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes'; // Rotas de usuários
import authRoutes from './routes/authRoutes'; // Rotas de autenticação

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Usando as rotas
app.use('/api', userRoutes); // Rotas de usuários
app.use('/api', authRoutes); // Rotas de autenticação (incluindo login)

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

