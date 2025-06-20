import express from 'express';
import { getHeritageSites } from '../controllers/heritageController.js';

const router = express.Router();

router.get('/heritage', getHeritageSites);

export default router;
