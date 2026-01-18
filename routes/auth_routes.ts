import express from 'express';
import {authMiddleware} from '../middlewares/auth_middleware';
import { 
  login,
  updatePassword
} from '../controllers/auth_controller';

const auth_router = express.Router();
//Rotas de produto públicas
auth_router.post('/login', login);

//Rotas protegidas
auth_router.patch('/updatepsw', authMiddleware, updatePassword);



export default auth_router;