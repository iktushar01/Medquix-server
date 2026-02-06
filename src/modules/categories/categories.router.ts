import { Router } from "express";
import { createCategory, getCategories } from "./categories.controller.js";
import auth, { UserRole } from "../../middlewares/auth.js";

const router = Router();

// POST /api/categories
router.post(
  "/",
  auth(UserRole.ADMIN),
  createCategory
);

router.get("/", getCategories);

export default router;
