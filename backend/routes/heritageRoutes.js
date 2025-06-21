import express from 'express';
import { getHeritageSites, getHeritageSiteById } from '../controllers/heritageController.js';

const router = express.Router();

// Get all heritage sites
router.get('/heritage', getHeritageSites);        

// Get a single heritage site by ID
router.get('/heritage/:id', getHeritageSiteById);

export default router;
