import { ObjectId } from 'mongodb';

export const verifyUser = async (req, res) => {
  const usersCollection = req.db.usersCollection;
  try {
    if (req.user.role === 'admin') {
      return res.json({ email: req.user.email, role: 'admin' });
    }
    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ message: 'Verification failed' });
  }
};

export const getStats = async (req, res) => {
  const { usersCollection, heritageCollection, festivalCollection } = req.db;
  try {
    const userCount = await usersCollection.countDocuments();
    const heritageCount = await heritageCollection.countDocuments();
    const festivalCount = await festivalCollection.countDocuments();

    res.json({ userCount, heritageCount, festivalCount });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};
