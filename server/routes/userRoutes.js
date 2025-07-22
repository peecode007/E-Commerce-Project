import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
} from '../controllers/userController.js';
import { authenticateFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticateFirebaseToken, getUserProfile);
router.put('/profile', authenticateFirebaseToken, updateUserProfile);

export default router;
