import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

const deleteFileIfExists = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', filePath, err);
    });
  }
};

const deleteFilesIfExist = (filePaths) => {
  filePaths.forEach((filePath) => deleteFileIfExists(filePath));
};

export const getHeritageSites = async (req, res) => {
  const heritageCollection = req.db.heritageCollection;
  try {
    const heritage = await heritageCollection.find().toArray();
    res.json(heritage);
  } catch (err) {
    console.error('Fetch heritage error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch heritage sites' });
  }
};

export const getHeritageSiteById = async (req, res) => {
  const heritageCollection = req.db.heritageCollection;
  const id = req.params.id;

  try {
    const site = await heritageCollection.findOne({ _id: new ObjectId(id) });
    if (!site) {
      return res.status(404).json({ success: false, message: 'Heritage site not found' });
    }
    // Return full multilingual data
    res.json(site);
  } catch (err) {
    console.error('Public fetch heritage by ID error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch heritage site' });
  }
};


export const adminGetHeritageSiteById = async (req, res) => {
  const heritageCollection = req.db.heritageCollection;
  const id = req.params.id;
  try {
    const site = await heritageCollection.findOne({ _id: new ObjectId(id) });
    if (!site) return res.status(404).json({ success: false, message: 'Heritage site not found' });
    res.json(site);
  } catch (err) {
    console.error('Fetch heritage by ID error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch heritage site' });
  }
};

export const adminGetHeritageSites = async (req, res) => {
  const heritageCollection = req.db.heritageCollection;
  try {
    const heritage = await heritageCollection.find().toArray();
    res.json(heritage);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch heritage sites' });
  }
};

export const adminAddHeritageSite = async (req, res) => {
  const heritageCollection = req.db.heritageCollection;
  const {
    name_en, name_np,
    shortDescription_en, shortDescription_np,
    history_en, history_np,
    location_en, location_np,
    entryFee,
  } = req.body;

  if (!name_en || !name_np) {
    return res.status(400).json({ success: false, message: 'Both English and Nepali names are required' });
  }

  const image = req.files?.image ? req.files.image[0].path : null;
  const gallery = req.files?.gallery ? req.files.gallery.map(f => f.path) : [];

  try {
    const newHeritage = {
      name_en,
      name_np,
      shortDescription_en,
      shortDescription_np,
      history_en,
      history_np,
      location_en,
      location_np,
      entryFee: entryFee || null,
      image,
      gallery,
    };
    const result = await heritageCollection.insertOne(newHeritage);
    res.status(201).json({ success: true, _id: result.insertedId, ...newHeritage });
  } catch (err) {
    console.error('Add heritage error:', err);
    res.status(500).json({ success: false, message: 'Failed to add heritage site' });
  }
};

export const adminUpdateHeritageSite = async (req, res) => {
  const heritageCollection = req.db.heritageCollection;
  const id = req.params.id;

  const {
    name_en, name_np,
    shortDescription_en, shortDescription_np,
    history_en, history_np,
    location_en, location_np,
    entryFee,
  } = req.body;

  try {
    const existing = await heritageCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ success: false, message: 'Heritage site not found' });

    const updateFields = {
      name_en, name_np,
      shortDescription_en, shortDescription_np,
      history_en, history_np,
      location_en, location_np,
      entryFee: entryFee || null,
    };

    // Delete old image if new one uploaded
    if (req.files?.image) {
      deleteFileIfExists(existing.image);
      updateFields.image = req.files.image[0].path;
    }

    // Delete old gallery if new one uploaded
    if (req.files?.gallery) {
      deleteFilesIfExist(existing.gallery || []);
      updateFields.gallery = req.files.gallery.map(f => f.path);
    }

    const result = await heritageCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    res.json({ success: true, data: result.value });
  } catch (err) {
    console.error('Update heritage error:', err);
    res.status(500).json({ success: false, message: 'Failed to update heritage site' });
  }
};

export const adminDeleteHeritageSite = async (req, res) => {
  const heritageCollection = req.db.heritageCollection;
  const id = req.params.id;

  try {
    const existing = await heritageCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ success: false, message: 'Heritage site not found' });

    deleteFileIfExists(existing.image);
    deleteFilesIfExist(existing.gallery || []);

    await heritageCollection.deleteOne({ _id: new ObjectId(id) });

    res.json({ success: true, message: 'Heritage site deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete heritage site' });
  }
};
