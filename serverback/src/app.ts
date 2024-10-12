import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes'; // Rotas de usuários
import authRoutes from './routes/authRoutes'; //rotas para login
import teamRoutes from './routes/teamRoutes'; //rotas para os times

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Usando as rotas
app.use('/api',teamRoutes) //rota para os times
app.use('/api', userRoutes); // Rotas de usuários
app.use('/api', authRoutes); // Rotas para login

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

//ao criar o schema no seu proprio pc adiconar essa linha
//INSERT INTO users (name, email, password, isAdmin) VALUES ('daniel', 'daniel@gmail.com','$2b$10$t2USd40dO76L.tsQSOo3WO75faZlQFC.CGDJISS.LJgufLd7ru/Hm', 1 ) 
//q cria um usuario como admin 
// a senha é 123456

