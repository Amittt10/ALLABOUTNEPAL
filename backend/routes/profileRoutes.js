import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/profile', authenticateJWT, getProfile);
router.post('/profile/update', authenticateJWT, uploadSingleImage, updateProfile);

export default router;
