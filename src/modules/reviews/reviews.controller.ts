import { Request, Response } from "express";
import * as ReviewService from "./reviews.services.js";

// Create a review
export const createReview = async (req: Request, res: Response) => {
  try {
    const customerId = req.user!.id;
    const { medicineId, orderId, rating, comment } = req.body;

    if (!medicineId || !orderId || !rating) {
      return res.status(400).json({
        success: false,
        message: "medicineId, orderId, and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await ReviewService.createReview(
      customerId,
      Number(medicineId),
      Number(orderId),
      Number(rating),
      comment
    );

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to submit review",
    });
  }
};

// Get reviews by medicine
export const getReviewsByMedicine = async (req: Request, res: Response) => {
  try {
    const medicineId = Number(req.params.id);
    if (!medicineId) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine id",
      });
    }

    const result = await ReviewService.getReviewsByMedicine(medicineId);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch reviews",
    });
  }
};

// Update a review
export const updateReview = async (req: Request, res: Response) => {
  try {
    const customerId = req.user!.id;
    const { reviewId, rating, comment } = req.body;

    if (!reviewId || !rating) {
      return res.status(400).json({
        success: false,
        message: "reviewId and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await ReviewService.updateReview(
      customerId,
      Number(reviewId),
      Number(rating),
      comment
    );

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update review",
    });
  }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const customerId = req.user!.id;
    const reviewId = Number(req.params.id);

    if (!reviewId) {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    await ReviewService.deleteReview(customerId, reviewId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete review",
    });
  }
};
