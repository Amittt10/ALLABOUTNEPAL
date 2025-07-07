import express from "express";
import {
  addReview,
  getReviewsByTarget,
  addReplyToReview,
  getAllReviewsAdmin,
} from "../controllers/reviewController.js";
import { authenticateJWT, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router(); // ✅ define router first

// Public / user-protected routes
router.post("/", authenticateJWT, addReview);
router.get("/:targetType/:targetId", getReviewsByTarget);
router.post("/:reviewId/replies", authenticateJWT, addReplyToReview);

// Admin-only route
router.get("/admin", authenticateJWT, authorizeAdmin, getAllReviewsAdmin); // ✅ moved here after router is defined

export default router;
