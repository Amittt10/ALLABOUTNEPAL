import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/profile', authenticateJWT, getProfile);
router.post('/profile/update', authenticateJWT, upload.single('photo'), updateProfile);

export default router;
