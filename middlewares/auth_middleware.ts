import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).json({message: 'Token de autenticação não fornecido'});
  }

  const parts = authHeader.split(' ');

  if(parts.length !== 2){
    return res.status(401).json({message: 'Erro no formato do token'});
  }

  const [scheme, token] = parts;

  if(!/^Bearer$/i.test(scheme)){
    return res.status(401).json({message: 'Token mal formatado'});
  }

  try{
    const secret = process.env.JWT_SECRET as string;;
    const decoded = jwt.verify(token, secret) as {id: string};

    req.userId = decoded.id;

    return next();
  } catch (err){
    return res.status(401).json({message: 'Token inválido'});
  }
};