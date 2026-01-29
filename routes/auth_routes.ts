import express from 'express';
import {auth_middleware} from '../middlewares/auth_middleware';
import { 
  login,
  update_password
} from '../controllers/auth_controller';

const auth_router = express.Router();
//Rotas de produto públicas
auth_router.post('/login', login);

//Rotas protegidas
auth_router.patch('/updatepsw', auth_middleware, update_password);



export default auth_router;