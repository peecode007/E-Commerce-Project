import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById 
} from '../controllers/orderController.js';
import { authenticateFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

// Create new order
router.post('/', authenticateFirebaseToken, createOrder);

// Get user's orders
router.get('/', authenticateFirebaseToken, getUserOrders);

// Get specific order
router.get('/:id', authenticateFirebaseToken, getOrderById);

export default router;
