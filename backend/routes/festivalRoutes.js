import express from 'express';
import { getFestivals } from '../controllers/festivalController.js';

const router = express.Router();

router.get('/festivals', getFestivals);

export default router;
