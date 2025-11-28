import {Request, Response} from 'express';
import User from '../models/user_schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// user registration
export const register = async (req: Request, res: Response) => {
  const {name, email, password} = req.body;
  
  try{
    const user =  new User({name, email, password});
    const newUser = await user.save();
    res.status(201).json({message: 'Usuário registrado com sucesso', UserID: newUser._id, name: newUser.name, email: newUser.email});
  } catch (err: any){
    res.status(400).json({message: err.message});
  }
}