import express from 'express';
import {authMiddleware} from '../middlewares/auth_middleware';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product_controller'

const router = express.Router();
//Rotas de produto públicas
router.get('/', getAllProducts);
router.get('/:id', getProductById);

//Roras protegidas
router.post('/', authMiddleware, createProduct);
router.patch('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;