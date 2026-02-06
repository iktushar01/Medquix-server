import { Router } from "express";
import { createCategory, getCategories, updateCategory } from "./categories.controller.js";
import auth, { UserRole } from "../../middlewares/auth.js";

const router = Router();

// POST → admin only
router.post("/", auth(UserRole.ADMIN), createCategory);

// PATCH → admin only
router.patch("/:id", auth(UserRole.ADMIN), updateCategory);

// GET routes → public
router.get("/", getCategories);

export default router;
