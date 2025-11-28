import express, {Request, Response} from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product_controller'

const router = express.Router();

// Rota para obter todos os produtos
router.get('/', getAllProducts);

// Rota para obter um produto por ID
router.get('/:id', getProductById);

// Rota para criar um novo produto
router.post('/', createProduct);

// Rota para atualizar um produto existente
router.patch('/:id', updateProduct);

// Rota para deletar um produto
router.delete('/:id', deleteProduct);

export default router;