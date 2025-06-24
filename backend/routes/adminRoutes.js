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

import {
  adminAddFestival,
  adminUpdateFestival,
  adminDeleteFestival
} from '../controllers/festivalController.js';

import { 
  getStats, 
  verifyUser 
} from '../controllers/statsController.js';

import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer storage setup for file uploads
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

// Protect all routes with authentication and admin authorization
router.use(authenticateJWT);
router.use(authorizeAdmin);

// Heritage CRUD routes
router.get('/heritage', adminGetHeritageSites);
router.get('/heritage/:id', adminGetHeritageSiteById);

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

// Festival admin routes
router.post(
  '/festivals',
  upload.single('image'), // festival image upload single
  adminAddFestival
);

router.put(
  '/festivals/:id',
  upload.single('image'),
  adminUpdateFestival
);

router.delete('/festivals/:id', adminDeleteFestival);

// Stats & verify routes
router.get('/stats', getStats);
router.get('/verify', verifyUser);

export default router;
