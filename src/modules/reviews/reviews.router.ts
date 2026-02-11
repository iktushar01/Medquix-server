import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth.js";
import {
  createReview,
  getReviewsByMedicine,
  updateReview,
  deleteReview,
} from "./reviews.controller.js";

const router = Router();

// Customer only
router.post("/", auth(UserRole.USER), createReview);
router.put("/", auth(UserRole.USER), updateReview);
router.delete("/:id", auth(UserRole.USER), deleteReview);

// Public
router.get("/medicine/:id", getReviewsByMedicine);

export default router;
