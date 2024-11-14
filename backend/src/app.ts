import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes'; // Rotas de usuários
import authRoutes from './routes/authRoutes'; //rotas para login
import teamRoutes from './routes/teamRoutes'; //rotas para os times
import surveyRoutes from './routes/surveyRoutes'; //rotas para as pesquisas
import categoryRoutes from './routes/categoryRoutes';
import passwordRoutes from './routes/passwordRoutes'
const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

// Usando as rotas
app.use('/api',teamRoutes) //rota para os times
app.use('/api', userRoutes); // Rotas de usuários
app.use('/api', authRoutes); // Rotas para login
app.use('/api', surveyRoutes); // Rotas para pesquisas
app.use('/api', categoryRoutes);
app.use('/api',passwordRoutes)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

//ao criar o schema no seu proprio pc adiconar essa linha
//INSERT INTO users (name, email, password, isAdmin) VALUES ('daniel', 'daniel@gmail.com','$2b$10$t2USd40dO76L.tsQSOo3WO75faZlQFC.CGDJISS.LJgufLd7ru/Hm', 1 ) 
//q cria um usuario como admin 
// a senha é 123456
//antes de iniciar a aplicaçao verificar os dois .env 1 aqui na pasta raiz , e outro no /services

