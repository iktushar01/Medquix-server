import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "./categories.controller.js";
import auth, { UserRole } from "../../middlewares/auth.js";

const router = Router();

// ADMIN-only
router.post("/", auth(UserRole.ADMIN), createCategory);
router.patch("/:id", auth(UserRole.ADMIN), updateCategory);
router.delete("/:id", auth(UserRole.ADMIN), deleteCategory);

// Public GET
router.get("/", getCategories);

export default router;
