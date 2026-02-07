import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth.js";
import { createReview } from "./reviews.controller.js";

const router = Router();

// Customer only → must be logged in
router.post("/", auth(UserRole.USER), createReview);

export default router;
