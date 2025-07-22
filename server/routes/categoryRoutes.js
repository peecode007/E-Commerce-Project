import express from 'express';
import {
  createCategory, getCategories, getCategoryById,
  updateCategory, deleteCategory
} from '../controllers/categoryController.js';
import { authenticateFirebaseToken } from '../middleware/auth.js';
import { checkAdmin } from '../middleware/checkAdmin.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticateFirebaseToken, checkAdmin, createCategory);
router.put('/:id', authenticateFirebaseToken, checkAdmin, updateCategory);
router.delete('/:id', authenticateFirebaseToken, checkAdmin, deleteCategory);

export default router;
