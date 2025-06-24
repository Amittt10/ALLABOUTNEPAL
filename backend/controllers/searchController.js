// controllers/searchController.js
export const searchContent = async (req, res) => {
  try {
    const { festivalCollection, heritageCollection } = req.db;
    const q = req.query.q || '';
    const regex = { $regex: q, $options: 'i' };

    const festivals = await festivalCollection
      .find({ $or: [{ name_en: regex }, { description: regex }] })
      .toArray();

    const heritageSites = await heritageCollection
      .find({ $or: [{ name_en: regex }, { description: regex }] })
      .toArray();

    const results = [
      ...festivals.map((f) => ({ type: 'festival', ...f })),
      ...heritageSites.map((h) => ({ type: 'heritage', ...h })),
    ];

    res.status(200).json(results);
  } catch (error) {
    console.error('Error searching content:', error);
    res.status(500).json({ message: 'Error searching content' });
  }
};
