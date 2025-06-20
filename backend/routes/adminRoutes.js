import express from 'express';
import { 
  adminGetHeritageSites, 
  adminAddHeritageSite, 
  adminUpdateHeritageSite, 
  adminDeleteHeritageSite 
} from '../controllers/heritageController.js';

import { getStats, verifyUser } from '../controllers/statsController.js';
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateJWT, authorizeAdmin);

// Heritage CRUD
router.get('/heritage', adminGetHeritageSites);
router.post('/heritage', adminAddHeritageSite);
router.put('/heritage/:id', adminUpdateHeritageSite);
router.delete('/heritage/:id', adminDeleteHeritageSite);

// Stats & verify
router.get('/stats', getStats);
router.get('/verify', verifyUser);

export default router;
