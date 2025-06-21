import express from 'express';
import multer from 'multer';
import fs from 'fs';

import { 
  adminGetHeritageSites, 
  adminAddHeritageSite, 
  adminUpdateHeritageSite, 
  adminDeleteHeritageSite 
} from '../controllers/heritageController.js';

import { getStats, verifyUser } from '../controllers/statsController.js';
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer storage setup - files saved to './uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });  // Ensure directory exists (recursive for nested dirs)
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Add timestamp to filename to avoid collisions
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, '-'); // replace spaces
    cb(null, `${uniqueSuffix}-${sanitizedOriginalName}`);
  },
});
const upload = multer({ storage });

// Middleware: protect all routes below with JWT and admin role authorization
router.use(authenticateJWT);
router.use(authorizeAdmin);

// Heritage CRUD routes

// GET all heritage sites (admin)
router.get('/heritage', adminGetHeritageSites);

// POST add new heritage site with file uploads (image + gallery)
router.post(
  '/heritage',
  upload.fields([
    { name: 'image', maxCount: 1 },     // single main image
    { name: 'gallery', maxCount: 10 },  // multiple gallery images
  ]),
  adminAddHeritageSite
);

// PUT update heritage site by id with optional file uploads
router.put(
  '/heritage/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  adminUpdateHeritageSite
);

// DELETE heritage site by id
router.delete('/heritage/:id', adminDeleteHeritageSite);

// Stats route (protected)
router.get('/stats', getStats);

// Verify user token route (protected)
router.get('/verify', verifyUser);

export default router;
