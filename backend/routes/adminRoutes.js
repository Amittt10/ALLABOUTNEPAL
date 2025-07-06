// backend/routes/adminRoutes.js
import express from 'express';
import multer from 'multer';
import fs from 'fs';

import {
  adminGetHeritageSites,
  adminAddHeritageSite,
  adminUpdateHeritageSite,
  adminDeleteHeritageSite,
  adminGetHeritageSiteById,
} from '../controllers/heritageController.js';

import {
  adminAddFestival,
  adminUpdateFestival,
  adminDeleteFestival,
} from '../controllers/festivalController.js';

import { getStats } from '../controllers/statsController.js';
import { getUsersPaginated } from '../controllers/adminUserController.js';
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware.js';
import { getQuizStatistics } from '../controllers/quizStatsController.js';




const router = express.Router();

// Setup multer storage
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

// Protect all admin routes
router.use(authenticateJWT);
router.use(authorizeAdmin);

// Heritage routes
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

// Festival routes
// Support main image + multiple gallery images if needed
router.post(
  '/festivals',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  adminAddFestival
);

router.put(
  '/festivals/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  adminUpdateFestival
);

router.delete('/festivals/:id', adminDeleteFestival);

// Stats & verify
router.get('/stats', getStats);
// router.get('/verify', verifyUser);

//For User Pagination
router.get('/users', getUsersPaginated);

// For Quiz Pagination
router.get('/quiz/statistics', getQuizStatistics);

export default router;
