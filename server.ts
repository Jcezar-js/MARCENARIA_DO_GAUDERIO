import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import products_router from './routes/product_routes';
import auth_router from './routes/auth_routes';
import material_router from './routes/material_routes';
import cors from 'cors';
import { error_handling_middleware } from './middlewares/error_handling_middleware';

const app = express();
const DB_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3001;

const allowed_origins = ['http://localhost:12000', 'http://localhost:12001'];

const options: cors.CorsOptions = {
  origin: allowed_origins,
}

if (!DB_URL){
  console.error('DATABASE_URL não está definido nas variáveis de ambiente.');
  process.exit(1);
}

//conexão com banco de dados
mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error('Erro ao conectar ao banco: ', error));
db.once('open', () => console.log('Conectado ao MongoDB'));

app.use(express.json());
app.use(cors(options));

// Usar as rotas de produtos
app.use('/api/products', products_router);
//usar as rotas de autenticação
app.use('/api/auth', auth_router);
//usar as rotas de materiais
app.use('/api/materials', material_router);

// Global error handler - DEVE vir depois de todas as rotas
app.use(error_handling_middleware);

app.listen(PORT, () => console.log('Server iniciado na porta', PORT));