import express from 'express';
import {
    addToCart,
    clearCart,
    getCart,
    removeFromCart,
    updateCartItem,
} from '../controllers/cartController.js';
import { authenticateFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/add', authenticateFirebaseToken, addToCart);
router.get('/', authenticateFirebaseToken, getCart);
router.put('/update', authenticateFirebaseToken, updateCartItem);
router.delete('/remove/:productId', authenticateFirebaseToken, removeFromCart);

router.delete('/clear', authenticateFirebaseToken, clearCart);

export default router;