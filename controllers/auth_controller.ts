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

const updatePasswordSchema = z
.object({
  currentPassword: z.string(),
  password: userSchema.shape.password,
  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem', 
});


//login user
export const login = async (req: Request, res: Response)=> {

  const {email, password} = req.body;
  try{
    const user = await User.findOne({email});
    if(!user){
      return  res.status(401).json({message: ' Email ou senha incorretos! '});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({message: ' Email ou senha incorretos! '});
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

export const updatePassword = async (req: Request, res: Response) => {
  const result =  updatePasswordSchema.safeParse(req.body);

  if (!result.success){
    return res.status(400).json({errors: result.error.issues});
  }

  const {currentPassword, password } = result.data;
  const userId = (req as any).userId;


  try{
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({message: 'Sua senha atual está incorreta'});
    }
  user.password = password;
  await user.save();

  res.json({ message: 'Senha alterada com sucesso!' });
  } catch (err: any){
    res.status (500).json({message: err.message});
  }

 

}