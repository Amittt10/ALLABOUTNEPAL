import express from 'express';
import { getRecommended } from '../controllers/recommendedController.js';

const router = express.Router();

router.get('/', getRecommended);

export default router;
