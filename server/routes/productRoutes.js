import express from 'express';
import {
  getAllProducts, getProductById, createProduct,
  updateProduct, deleteProduct
} from '../controllers/productController.js';
import { authenticateFirebaseToken } from '../middleware/auth.js';
import { checkAdmin } from '../middleware/checkAdmin.js';

const router = express.Router();

router.get('/', getAllProducts); // [optional ?category=<categoryId>]
router.get('/:id', getProductById);

// Only admin users can create/update/delete products
router.post('/', authenticateFirebaseToken, checkAdmin, createProduct);
router.put('/:id', authenticateFirebaseToken, checkAdmin, updateProduct);
router.delete('/:id', authenticateFirebaseToken, checkAdmin, deleteProduct);

export default router;
