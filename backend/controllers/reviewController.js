import Review from "../models/Review.js";
import { ObjectId } from "mongodb";
import { connectDB } from "../config/db.js";  
import mongoose from "mongoose";



export const addReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user info" });
    }

    const userId = req.user.userId;

    const { targetType, targetId, rating, comment } = req.body;

    if (!userId || !targetType || !targetId || !rating || !comment) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newReview = new Review({
      userId,
      targetType,
      targetId,
      rating,
      comment,
    });

    const savedReview = await newReview.save();
    return res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getReviewsByTarget = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    let { page = 1, limit = 5 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (!targetType || !targetId) {
      return res.status(400).json({ message: "Missing targetType or targetId" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ message: "Invalid targetId format" });
    }

    const id = new mongoose.Types.ObjectId(targetId);

    // Continue with your query...
    const totalReviews = await Review.countDocuments({ targetType, targetId: id });
    const totalPages = Math.ceil(totalReviews / limit);

    const reviews = await Review.find({ targetType, targetId: id })
      .populate("userId", "username")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Calculate average rating
    const allReviews = await Review.find({ targetType, targetId: id });
    const averageRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

    res.json({
      reviews,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (err) {
    console.error("Error in getReviewsByTarget:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// New controller to add reply to review
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const db = await connectDB();
    const { heritageCollection, festivalCollection, placesCollection } = db;

    const reviews = await Review.find()
      .populate("userId", "username email")
      .populate("replies.userId", "username")
      .sort({ createdAt: -1 });

    const reviewsWithTitle = await Promise.all(
      reviews.map(async (review) => {
        let targetTitle = "Unknown";
        let id;

        try {
          id = new ObjectId(review.targetId);
        } catch {
          return { ...review.toObject(), targetTitle: "Invalid ID" };
        }

        if (review.targetType === "heritage") {
          const heritage = await heritageCollection.findOne({ _id: id });
          targetTitle = heritage?.name_en || heritage?.name_np || "Unnamed Heritage";
        } else if (review.targetType === "place") {
          const place = await placesCollection.findOne({ _id: id });
          targetTitle = place?.title_en || place?.title_np || "Unnamed Place";
        } else if (review.targetType === "festival") {
          const festival = await festivalCollection.findOne({ _id: id });
          targetTitle = festival?.name_en || festival?.name_np || "Unnamed Festival";
        }

        return {
          ...review.toObject(),
          targetTitle,
        };
      })
    );

    res.json(reviewsWithTitle);
  } catch (error) {
    console.error("Admin fetch reviews failed:", error);
    res.status(500).json({ message: "Server error while fetching reviews." });
  }
};



export const addReplyToReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.userId;
    const { reviewId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: "Reply comment is required" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.replies.push({ userId, comment });
    await review.save();

    const populatedReview = await Review.findById(reviewId).populate("replies.userId", "username");
    res.status(201).json(populatedReview);
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ message: "Server error while adding reply" });
  }
};

export const getReviewSummary = async (req, res) => {
  try {
    const { targetType, targetIds } = req.query;

    if (!targetType || !targetIds) {
      return res.status(400).json({ message: "Missing targetType or targetIds" });
    }

    const ids = targetIds.split(",").map((id) => new mongoose.Types.ObjectId(id));

    const summaries = await Review.aggregate([
      {
        $match: {
          targetType,
          targetId: { $in: ids },
        },
      },
      {
        $group: {
          _id: "$targetId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const result = {};
    summaries.forEach((summary) => {
      result[summary._id.toString()] = {
        averageRating: Number(summary.averageRating.toFixed(1)),
        reviewCount: summary.reviewCount,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error in getReviewSummary:", error);
    res.status(500).json({ message: "Server error while getting review summary" });
  }
};

