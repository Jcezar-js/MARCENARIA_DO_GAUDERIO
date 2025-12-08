import {Request, Response} from 'express';
import User from '../models/user_schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
//user validation schema
const userSchema = z.object({
  name: z
    .string({ error : "O nome é obrigatório"})
    .min(3, 'O nome deve conter pelo menos 3 caracteres'),
  email: z
    .string()
    .min(1, {message: 'O campo "Email" é obrigatório'})
    .email("Formato de email inválido"),
  password: z
    .string()
    .min(8, {message: 'A senha deve conter no mínimo 8 caracteres'})
    .max(32, {message: 'A senha deve conter no máximo 32 caracteres'})
    .refine((password) => /[A-Z]/.test(password), { message: 'A senha deve conter pelo menos uma letra maiúscula' })
    .refine((password) => /[a-z]/.test(password), { message: 'A senha deve conter pelo menos uma letra minúscula' })
    .refine((password) => /[0-9]/.test(password), { message: 'A senha deve conter pelo menos um número' })
    .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), { message: 'A senha deve conter pelo menos um caractere especial' }),
})

export const updatePasswordSchema = z
.object({
  currentPassword: z.string(),
  password: userSchema.shape.password,
  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem', 
});
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
};

//login user
export const login = async (req: Request, res: Response)=> {

  const {email, password} = req.body;
  try{
    const user = await User.findOne({email});
    if(!user){
      return  res.status(401).json({message: 'Credenciais inválidas'});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({message: 'Credenciais inválidas'});
    }

    const secret = process.env.JWT_SECRET;
    if(!secret) throw new Error('JWT_SECRET não está deinido');

    const token = jwt.sign(
      {id: user._id, role: 'user'},
      secret,
      {expiresIn: '1d'}
    );

    return res.json ({ token, userId: user._id});
  
  } catch (err: any){
    return res.status(500).json({message: 'Erro interno no servidor'});
  }
};