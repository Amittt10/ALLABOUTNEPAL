import express from "express";
import {
  getAllPlaces,
  getPlaceById,
  getPlaceBySlug,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/placeController.js";
import { uploadPlaceFiles } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllPlaces);

// Make sure slug route comes before id route
router.get("/slug/:slug", getPlaceBySlug);
router.get("/:id", getPlaceById);

router.post("/", uploadPlaceFiles, createPlace);
router.put("/:id", uploadPlaceFiles, updatePlace);
router.delete("/:id", deletePlace);

export default router;
