import { Request, Response } from "express";
import * as ReviewService from "./reviews.services.js";

export const createReview = async (req: Request, res: Response) => {
  try {
    const customerId = req.user!.id;
    const { medicineId, rating, comment } = req.body;

    // Basic validation
    if (!medicineId || !rating) {
      return res.status(400).json({
        success: false,
        message: "medicineId and rating are required",
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
      Number(rating),
      comment
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
