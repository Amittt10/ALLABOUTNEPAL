export const getFestivals = async (req, res) => {
  const festivalCollection = req.db.festivalCollection;
  try {
    const festivals = await festivalCollection.find().toArray();
    res.json(festivals);
  } catch (err) {
    console.error('Fetch festivals error:', err);
    res.status(500).json({ message: 'Failed to fetch festivals' });
  }
};
