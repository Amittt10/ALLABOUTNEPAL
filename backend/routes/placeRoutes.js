// backend/routes/placeRoutes.js
import express from "express";
import {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/placeController.js";
import { uploadPlaceFiles } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPlaces);
router.get("/:id", getPlaceById);

// 🔓 Unprotected admin routes (removed authenticateJWT, authorizeAdmin)
router.post("/", uploadPlaceFiles, createPlace);
router.put("/:id", uploadPlaceFiles, updatePlace);
router.delete("/:id", deletePlace);

export default router;
