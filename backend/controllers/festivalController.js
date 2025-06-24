// backend/controllers/festivalController.js
import { ObjectId } from 'mongodb';
import fs from 'fs';

const deleteFileIfExists = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', filePath, err);
    });
  }
};

export const getFestivals = async (req, res) => {
  try {
    const festivalCollection = req.db.festivalCollection;
    if (!festivalCollection) {
      return res.status(500).json({ message: 'Festival collection not found' });
    }
    const festivals = await festivalCollection.find().toArray();
    res.status(200).json(festivals);
  } catch (err) {
    console.error('Error fetching festivals:', err);
    res.status(500).json({ message: 'Failed to fetch festivals' });
  }
};


export const getFestivalById = async (req, res) => {
  const festivalCollection = req.db.festivalCollection;
  const id = req.params.id;

  try {
    const festival = await festivalCollection.findOne({ _id: new ObjectId(id) });
    if (!festival) {
      return res.status(404).json({ success: false, message: 'Festival not found' });
    }
    res.json(festival);
  } catch (err) {
    console.error('Fetch festival by ID error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch festival' });
  }
};

export const adminAddFestival = async (req, res) => {
  const festivalCollection = req.db.festivalCollection;

  const {
    name_en,
    name_np,
    dateBS,
    dateAD,
    description_en,
    description_np,
    significance_en,
    significance_np,
    location_en,
    location_np,
    category,
  } = req.body;

  if (!name_en || !name_np || !dateBS) {
    return res.status(400).json({ success: false, message: 'name_en, name_np, and dateBS are required' });
  }

  // Correct multer single file usage here
  const image = req.file ? req.file.path : null;

  try {
    const newFestival = {
      name_en,
      name_np,
      dateBS,
      dateAD: dateAD || null,
      description_en: description_en || '',
      description_np: description_np || '',
      significance_en: significance_en || '',
      significance_np: significance_np || '',
      location_en: location_en || '',
      location_np: location_np || '',
      category: category || 'general',
      image,
      createdAt: new Date(),
    };

    const result = await festivalCollection.insertOne(newFestival);
    res.status(201).json({ success: true, _id: result.insertedId, ...newFestival });
  } catch (err) {
    console.error('Add festival error:', err);
    res.status(500).json({ success: false, message: 'Failed to add festival' });
  }
};

export const adminUpdateFestival = async (req, res) => {
  const festivalCollection = req.db.festivalCollection;
  const id = req.params.id;

  const {
    name_en,
    name_np,
    dateBS,
    dateAD,
    description_en,
    description_np,
    significance_en,
    significance_np,
    location_en,
    location_np,
    category,
  } = req.body;

  try {
    const existing = await festivalCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ success: false, message: 'Festival not found' });

    const updateFields = {
      name_en,
      name_np,
      dateBS,
      dateAD: dateAD || null,
      description_en: description_en || '',
      description_np: description_np || '',
      significance_en: significance_en || '',
      significance_np: significance_np || '',
      location_en: location_en || '',
      location_np: location_np || '',
      category: category || 'general',
    };

    if (req.file) {
      deleteFileIfExists(existing.image);
      updateFields.image = req.file.path;
    }

    const result = await festivalCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    res.json({ success: true, data: result.value });
  } catch (err) {
    console.error('Update festival error:', err);
    res.status(500).json({ success: false, message: 'Failed to update festival' });
  }
};

export const adminDeleteFestival = async (req, res) => {
  const festivalCollection = req.db.festivalCollection;
  const id = req.params.id;

  try {
    const existing = await festivalCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ success: false, message: 'Festival not found' });

    deleteFileIfExists(existing.image);

    await festivalCollection.deleteOne({ _id: new ObjectId(id) });

    res.json({ success: true, message: 'Festival deleted' });
  } catch (err) {
    console.error('Delete festival error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete festival' });
  }
};
