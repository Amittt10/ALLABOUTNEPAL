import express from 'express';
import { synthesizeSpeech } from '../controllers/ttsController.js';

const router = express.Router();
router.post('/speak', synthesizeSpeech);
export default router;