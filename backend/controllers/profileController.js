import { ObjectId } from 'mongodb';

export const getProfile = async (req, res) => {
  const usersCollection = req.db.usersCollection;
  try {
    if (req.user.role === 'admin') return res.json({ email: req.user.email, role: 'admin' });

    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) }, { projection: { password: 0 } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ message: 'Only users can update profile' });
  const usersCollection = req.db.usersCollection;

  try {
    const updateFields = {};
    if (req.file) updateFields.photo = req.file.path;

    await usersCollection.updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $set: updateFields }
    );

    const updatedUser = await usersCollection.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Profile update failed' });
  }
};
