import express from 'express';
import { registerUser, loginUser, verifyEmail, verifyToken } from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email', verifyEmail);
router.get('/verify', authenticateJWT, verifyToken);

export default router;
