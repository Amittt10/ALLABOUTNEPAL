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

// Fetch festival by name_en
router.get('/festivals/by-name/:name', async (req, res) => {
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


export default router;
