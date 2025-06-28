import express from 'express';
import {
  getFestivals,
  getFestivalById,
  getUpcomingFestivals,
} from '../controllers/festivalController.js';

const router = express.Router();

// GET /api/festivals/           ✅ All festivals
router.get('/', getFestivals);

// ✅ Place more specific routes BEFORE /:id
// GET /api/festivals/upcoming   ✅ Upcoming festivals (within 7 days)
router.get('/upcoming', getUpcomingFestivals);

// GET /api/festivals/by-name/:name   ✅ Festival by name_en
router.get('/by-name/:name', async (req, res) => {
  try {
    const { festivalCollection } = req.db;
    const name = decodeURIComponent(req.params.name);
    const festival = await festivalCollection.findOne({ name_en: name });
    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }
    res.json(festival);
  } catch (error) {
    console.error('Error fetching festival by name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ❗ This must come last
// GET /api/festivals/:id        ✅ Single festival by ID
router.get('/:id', getFestivalById);

export default router;
