import { Router } from "express";
import { getUsers, updateUserStatus } from "./adminUsers.controller.js";
import auth, { UserRole } from "../../middlewares/auth.js";

const router = Router();

// GET all users (Admin only)
router.get("/", auth(UserRole.ADMIN), getUsers);

// PATCH user status (Ban/Unban) — Admin only
router.patch("/:id", auth(UserRole.ADMIN), updateUserStatus);

export default router;
