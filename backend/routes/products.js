import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, seedProducts, bulkCreateProducts } from '../controllers/productController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/seed', seedProducts);
router.get('/:id', getProductById);

// Protected Admin Routes
router.post('/bulk', protectAdmin, bulkCreateProducts);
router.post('/', protectAdmin, createProduct);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
