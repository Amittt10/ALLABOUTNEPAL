import express from 'express';
import multer from 'multer';
import fs from 'fs';

import { 
  adminGetHeritageSites, 
  adminAddHeritageSite, 
  adminUpdateHeritageSite, 
  adminDeleteHeritageSite,
  adminGetHeritageSiteById
} from '../controllers/heritageController.js';

import { getStats, verifyUser } from '../controllers/statsController.js';
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${uniqueSuffix}-${sanitizedOriginalName}`);
  },
});
const upload = multer({ storage });

// Protect all routes with JWT and admin role
router.use(authenticateJWT);
router.use(authorizeAdmin);

// Heritage CRUD routes
router.get('/heritage', adminGetHeritageSites);
router.get('/heritage/:id', adminGetHeritageSiteById); // <-- NEW: get by ID

router.post(
  '/heritage',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  adminAddHeritageSite
);

router.put(
  '/heritage/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  adminUpdateHeritageSite
);

router.delete('/heritage/:id', adminDeleteHeritageSite);

// Stats & verify routes
router.get('/stats', getStats);
router.get('/verify', verifyUser);

export default router;
