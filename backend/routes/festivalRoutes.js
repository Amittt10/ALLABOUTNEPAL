// backend/routes/festivalRoutes.js
import express from 'express';
import {
  getFestivals,
  getFestivalById,
} from '../controllers/festivalController.js';

const router = express.Router();

// Public routes
router.get('/festivals', getFestivals);
router.get('/festivals/:id', getFestivalById);

export default router;
