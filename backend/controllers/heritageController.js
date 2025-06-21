import { ObjectId } from 'mongodb';
import fs from 'fs';

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

  const {
    name,
    shortDescription,
    history,
    location,
    entryFee,
  } = req.body;

  if (!name) return res.status(400).json({ message: 'Name is required' });

  // Files (uploaded by multer)
  const image = req.files?.image ? req.files.image[0].path : null;
  const gallery = req.files?.gallery ? req.files.gallery.map(f => f.path) : [];

  try {
    const newHeritage = {
      name,
      shortDescription,
      history,
      location,
      entryFee,
      image,
      gallery,
    };

    const result = await heritageCollection.insertOne(newHeritage);
    res.status(201).json({ _id: result.insertedId, ...newHeritage });
  } catch (err) {
    console.error('Add heritage error:', err);
    res.status(500).json({ message: 'Failed to add heritage site' });
  }
};

export const adminUpdateHeritageSite = async (req, res) => {
  const heritageCollection = req.db.heritageCollection;
  const id = req.params.id;

  const {
    name,
    shortDescription,
    history,
    location,
    entryFee,
  } = req.body;

  // Optional file update
  const image = req.files?.image ? req.files.image[0].path : null;
  const gallery = req.files?.gallery ? req.files.gallery.map(f => f.path) : [];

  const updateFields = {
    name,
    shortDescription,
    history,
    location,
    entryFee,
  };

  if (image) updateFields.image = image;
  if (gallery.length) updateFields.gallery = gallery;

  try {
    const result = await heritageCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result.value) return res.status(404).json({ message: 'Heritage site not found' });

    res.json(result.value);
  } catch (err) {
    console.error('Update heritage error:', err);
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
