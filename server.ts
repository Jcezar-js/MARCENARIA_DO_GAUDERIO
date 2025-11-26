import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import productsRouter from './routes/product_routes'

const app = express()
const DB_URL = process.env.DATABASE_URL
const PORT = process.env.PORT || 3001

if (!DB_URL){
  console.error('DATABASE_URL não está definido nas variáveis de ambiente.')
  process.exit(1)
}


mongoose.connect(DB_URL)
const db = mongoose.connection
db.on('error', (error) => console.error('Erro ao conectar ao banco: ', error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

// Usar as rotas de produtos
app.use('/api/products', productsRouter)

app.listen(PORT,()=>console.log('Server Started on port ', PORT));