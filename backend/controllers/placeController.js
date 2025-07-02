import fs from "fs";
import Place from "../models/Place.js";

// GET all places
export const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 });
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single place
export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE place
export const createPlace = async (req, res) => {
  try {
    const {
      title_en,
      title_np,
      description_en = "",
      description_np = "",
      category,
      video_url = "",
      lat,
      lng,
    } = req.body;

    const thumbnail = req.files?.thumbnail ? `/uploads/places/${req.files.thumbnail[0].filename}` : "";
    const videoFile = req.files?.video ? `/uploads/places/${req.files.video[0].filename}` : "";
    const images = req.files?.images ? req.files.images.map(img => `/uploads/places/${img.filename}`) : [];

    const placeData = {
      title_en,
      title_np,
      description_en,
      description_np,
      category,
      thumbnail,
      video_url: video_url || videoFile,
      images,
      location: {
        lat: lat ? parseFloat(lat) : undefined,
        lng: lng ? parseFloat(lng) : undefined,
      },
    };

    const place = new Place(placeData);
    const savedPlace = await place.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    console.error("Error creating place:", error);
    res.status(500).json({ message: "Server error while creating place" });
  }
};

// UPDATE place
export const updatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });

    const {
      title_en,
      title_np,
      description_en,
      description_np,
      category,
      video_url,
      lat,
      lng,
    } = req.body;

    if (req.files?.thumbnail?.[0] && place.thumbnail) {
      fs.unlink(`.${place.thumbnail}`, () => {});
    }
    if (req.files?.video?.[0] && place.video_url && place.video_url.startsWith("/uploads/")) {
      fs.unlink(`.${place.video_url}`, () => {});
    }

    place.title_en = title_en || place.title_en;
    place.title_np = title_np || place.title_np;
    place.description_en = description_en || place.description_en;
    place.description_np = description_np || place.description_np;
    place.category = category || place.category;
    place.video_url = video_url || place.video_url;

    if (lat) place.location.lat = parseFloat(lat);
    if (lng) place.location.lng = parseFloat(lng);

    if (req.files?.thumbnail?.[0]) {
      place.thumbnail = `/uploads/places/${req.files.thumbnail[0].filename}`;
    }

    if (req.files?.video?.[0]) {
      place.video_url = `/uploads/places/${req.files.video[0].filename}`;
    }

    if (req.files?.images?.length) {
      place.images = req.files.images.map(file => `/uploads/places/${file.filename}`);
    }

    const updatedPlace = await place.save();
    res.json(updatedPlace);
  } catch (err) {
    console.error("Error updating place:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE place
export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });

    if (place.thumbnail) fs.unlink(`.${place.thumbnail}`, () => {});
    if (place.video_url && place.video_url.startsWith("/uploads/")) fs.unlink(`.${place.video_url}`, () => {});
    if (place.images?.length) {
      place.images.forEach(img => fs.unlink(`.${img}`, () => {}));
    }

    await place.deleteOne();
    res.json({ message: "Place deleted successfully." });
  } catch (err) {
    console.error("Error deleting place:", err);
    res.status(500).json({ message: err.message });
  }
};
