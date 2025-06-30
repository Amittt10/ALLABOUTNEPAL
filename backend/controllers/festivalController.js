import { ObjectId } from 'mongodb';
import fs from 'fs';

// Helper: delete file from disk
const deleteFileIfExists = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', filePath, err);
    });
  }
};

// GET all festivals
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

// GET festival by ID
export const getFestivalById = async (req, res) => {
  const festivalCollection = req.db.festivalCollection;
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid festival ID' });
  }

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

// ADD new festival (Admin)
export const adminAddFestival = async (req, res) => {
  const festivalCollection = req.db.festivalCollection;

  const {
    name_en,
    name_np,
    dateBS,
    dateAD,
    description_en,
    description_np,
    location_en,
    location_np,
    category,
  } = req.body;

  if (!name_en || !name_np || !dateBS) {
    return res.status(400).json({ success: false, message: 'name_en, name_np, and dateBS are required' });
  }

  const image = req.file ? req.file.filename : null;

  try {
    const newFestival = {
      name_en,
      name_np,
      dateBS,
      dateAD: dateAD || null,
      description_en: description_en || '',
      description_np: description_np || '',
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

// UPDATE festival (Admin)
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
      location_en: location_en || '',
      location_np: location_np || '',
      category: category || 'general',
    };

    if (req.file) {
      deleteFileIfExists(`uploads/${existing.image}`);
      updateFields.image = req.file.filename;
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

// DELETE festival (Admin)
export const adminDeleteFestival = async (req, res) => {
  const festivalCollection = req.db.festivalCollection;
  const id = req.params.id;

  try {
    const existing = await festivalCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ success: false, message: 'Festival not found' });

    deleteFileIfExists(`uploads/${existing.image}`);

    await festivalCollection.deleteOne({ _id: new ObjectId(id) });

    res.json({ success: true, message: 'Festival deleted' });
  } catch (err) {
    console.error('Delete festival error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete festival' });
  }
};

// GET festivals in next 7 days
export const getUpcomingFestivals = async (req, res) => {
  const festivalCollection = req.db.festivalCollection;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);

    const festivals = await festivalCollection.find().toArray();

    const upcoming = festivals.filter(festival => {
      if (!festival.dateAD) return false;
      const festDate = new Date(festival.dateAD);
      return festDate >= today && festDate <= nextWeek;
    });

    upcoming.sort((a, b) => new Date(a.dateAD) - new Date(b.dateAD));

    res.status(200).json(upcoming);
  } catch (error) {
    console.error("Error fetching upcoming festivals:", error);
    res.status(500).json({ error: "Failed to fetch upcoming festivals" });
  }
};
