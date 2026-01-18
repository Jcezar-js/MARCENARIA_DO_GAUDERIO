import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from '../models/user_schema'

const createAdmin = async () => {
  const DB_URL = process.env.DATABASE_URL
  const PORT = process.env.PORT || 3001
    if (!DB_URL){
    console.error('DATABASE_URL não está definido nas variáveis de ambiente.')
    process.exit(1)
  }

  try{
    await mongoose.connect(DB_URL);
    console.log('Conectado ao MongoDB');
    
    const adminEmail = 'julio.filho1@hotmail.com';
    const userExists = await User.findOne ({ email: adminEmail });

    if (userExists){
      console.log('Admin já existe, nada a fazer.');
      process.exit(0);
    }

  const newAdmin = new User ({
    name: 'Admin',
    email: adminEmail,
    password: 'Mad@2026'
  });

  await newAdmin.save();
  console.log('Usuário Admin criado com sucesso!');

  } catch (error){
    console.error('Erro ao criar admin', error);
  }finally{
    await mongoose.connection.close();
    console.log('Conexão fechada, encerrando...')
  }

}

createAdmin();