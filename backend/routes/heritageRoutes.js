import express from 'express';
import {
  getHeritageSites,
  getHeritageSiteById,
  getHeritageSiteBySlug,
} from '../controllers/heritageController.js';

const router = express.Router();

// Get all heritage sites
router.get('/heritage', getHeritageSites);

// Get heritage site by ID (must be before slug or use /by-id/:id)
router.get('/heritage/by-id/:id', getHeritageSiteById);

// Get heritage site by slug
router.get('/heritage/slug/:slug', getHeritageSiteBySlug);

// Fetch heritage site by name_en
router.get('/heritage/by-name/:name', async (req, res) => {
  try {
    const { heritageCollection } = req.db;
    const name = decodeURIComponent(req.params.name);
    const heritageSite = await heritageCollection.findOne({ name_en: name });
    if (!heritageSite) {
      return res.status(404).json({ message: 'Heritage site not found' });
    }
    res.json(heritageSite);
  } catch (error) {
    console.error('Error fetching heritage site by name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
