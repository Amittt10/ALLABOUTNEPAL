import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import slugify from 'slugify'; 

// Helper: Delete single file
const deleteFileIfExists = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', filePath, err);
    });
  }
};

// Helper: Delete multiple files
const deleteFilesIfExist = (filePaths) => {
  filePaths.forEach((filePath) => deleteFileIfExists(filePath));
};

// ================= Public GET =================

export const getHeritageSites = async (req, res) => {
  try {
    const { location } = req.query;
    const filter = location ? { location_en: location } : {};
    const heritageSites = await req.db.heritageCollection.find(filter).toArray();

    if (heritageSites.length === 0) {
      return res.status(404).json({ message: `No heritage sites found for ${location}.` });
    }

    res.status(200).json(heritageSites);
  } catch (error) {
    console.error('Error fetching heritage sites:', error);
    res.status(500).json({ message: "Error fetching heritage sites" });
  }
};

export const getHeritageSiteById = async (req, res) => {
  const { id } = req.params;

  try {
    const site = await req.db.heritageCollection.findOne({ _id: new ObjectId(id) });
    if (!site) {
      return res.status(404).json({ success: false, message: 'Heritage site not found' });
    }
    res.json(site);
  } catch (err) {
    console.error('Public fetch heritage by ID error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch heritage site' });
  }
};

// ✅ GET heritage site by slug
export const getHeritageSiteBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const site = await req.db.heritageCollection.findOne({ slug });
    if (!site) {
      return res.status(404).json({ message: 'Heritage site not found' });
    }
    res.json(site);
  } catch (err) {
    console.error('Error fetching heritage site by slug:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= Admin GET =================

export const adminGetHeritageSiteById = async (req, res) => {
  try {
    const site = await req.db.heritageCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!site) return res.status(404).json({ success: false, message: 'Heritage site not found' });
    res.json(site);
  } catch (err) {
    console.error('Fetch heritage by ID error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch heritage site' });
  }
};

export const adminGetHeritageSites = async (req, res) => {
  try {
    const heritage = await req.db.heritageCollection.find().toArray();
    res.json(heritage);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch heritage sites' });
  }
};

// ================= Admin POST =================

export const adminAddHeritageSite = async (req, res) => {
  const {
    name_en, name_np,
    shortDescription_en, shortDescription_np,
    history_en, history_np,
    location_en, location_np,
    entryFee,
    lat, lng
  } = req.body;

  if (!name_en || !name_np) {
    return res.status(400).json({ success: false, message: 'Both English and Nepali names are required' });
  }

  const image = req.files?.image ? req.files.image[0].path : null;
  const gallery = req.files?.gallery ? req.files.gallery.map(f => f.path) : [];
  const slug = slugify(name_en, { lower: true, strict: true });

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
      entryFee: entryFee ? parseFloat(entryFee) : null,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      image,
      gallery,
      slug, // ✅
    };

    const result = await req.db.heritageCollection.insertOne(newHeritage);
    res.status(201).json({ success: true, _id: result.insertedId, ...newHeritage });
  } catch (err) {
    console.error('Add heritage error:', err);
    res.status(500).json({ success: false, message: 'Failed to add heritage site' });
  }
};

// ================= Admin PUT =================

export const adminUpdateHeritageSite = async (req, res) => {
  const { id } = req.params;

  const {
    name_en, name_np,
    shortDescription_en, shortDescription_np,
    history_en, history_np,
    location_en, location_np,
    entryFee,
    lat, lng
  } = req.body;

  try {
    const existing = await req.db.heritageCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ success: false, message: 'Heritage site not found' });

    const updateFields = {
      name_en,
      name_np,
      shortDescription_en,
      shortDescription_np,
      history_en,
      history_np,
      location_en,
      location_np,
      entryFee: entryFee ? parseFloat(entryFee) : null,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      slug: typeof name_en === 'string' && name_en.trim()
      ? slugify(name_en.trim(), { lower: true, strict: true })
      : existing.slug, // fallback to old slug if no new name provided
    };

    if (req.files?.image) {
      deleteFileIfExists(existing.image);
      updateFields.image = req.files.image[0].path;
    }

    if (req.files?.gallery) {
      deleteFilesIfExist(existing.gallery || []);
      updateFields.gallery = req.files.gallery.map(f => f.path);
    }

    const result = await req.db.heritageCollection.findOneAndUpdate(
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

// ================= Admin DELETE =================

export const adminDeleteHeritageSite = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await req.db.heritageCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ success: false, message: 'Heritage site not found' });

    deleteFileIfExists(existing.image);
    deleteFilesIfExist(existing.gallery || []);

    await req.db.heritageCollection.deleteOne({ _id: new ObjectId(id) });

    res.json({ success: true, message: 'Heritage site deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete heritage site' });
  }
};
