import multer from "multer";
import fs from "fs";

// Utility to ensure folder exists
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Create dynamic storage for folders like 'profiles', 'places'
const createStorage = (folderName) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `./uploads/${folderName}`;
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const sanitizedFilename = file.originalname.replace(/\s+/g, "-");
      cb(null, `${uniqueSuffix}-${sanitizedFilename}`);
    },
  });

/**
 * 1️⃣ Upload profile photo (single image)
 * Used in: profileRoutes.js
 */
export const uploadSingleImage = multer({
  storage: createStorage("profiles"),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for profile photo"));
    }
  },
}).single("photo");

/**
 * 2️⃣ Upload place files:
 * - thumbnail (1 image)
 * - video (1 file)
 * - images (up to 10 images for description gallery)
 * Used in: placeRoutes.js
 */
export const uploadPlaceFiles = multer({
  storage: createStorage("places"),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB max per file
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image or video files are allowed"));
    }
  },
}).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);
