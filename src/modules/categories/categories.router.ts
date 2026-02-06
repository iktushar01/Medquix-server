import { Router } from "express";
import { createCategory } from "./categories.controller.js";
import auth, { UserRole } from "../../middlewares/auth.js";

const router = Router();

// POST /api/categories
router.post(
  "/",
  auth(UserRole.ADMIN),
  createCategory
);

export default router;
