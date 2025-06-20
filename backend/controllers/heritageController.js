import { ObjectId } from 'mongodb';

export const getHeritageSites = async (req, res) => {
  const heritageCollection = req.db.heritageCollection;
  try {
    const heritage = await heritageCollection.find().toArray();
    res.json(heritage);
  } catch (err) {
    console.error('Fetch heritage error:', err);
    res.status(500).json({ message: 'Failed to fetch heritage sites' });
  }
};

export const adminGetHeritageSites = async (req, res) => {
  const heritageCollection = req.db.heritageCollection;
  try {
    const heritage = await heritageCollection.find().toArray();
    res.json(heritage);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch heritage sites' });
  }
};

export const adminAddHeritageSite = async (req, res) => {
  const heritageCollection = req.db.heritageCollection;
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const result = await heritageCollection.insertOne({ name, description });
    res.status(201).json({ _id: result.insertedId, name, description });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add heritage site' });
  }
};

export const adminUpdateHeritageSite = async (req, res) => {
  const heritageCollection = req.db.heritageCollection;
  const id = req.params.id;
  const { name, description } = req.body;

  try {
    const result = await heritageCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, description } },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ message: 'Heritage site not found' });
    res.json(result.value);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update heritage site' });
  }
};

export const adminDeleteHeritageSite = async (req, res) => {
  const heritageCollection = req.db.heritageCollection;
  const id = req.params.id;
  try {
    const result = await heritageCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Heritage site not found' });
    res.json({ message: 'Heritage site deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete heritage site' });
  }
};
