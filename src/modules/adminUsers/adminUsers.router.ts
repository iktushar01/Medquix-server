import { Router } from "express";
import { getUsers } from "./adminUsers.controller.js";
import auth, { UserRole } from "../../middlewares/auth.js";

const router = Router();

// GET all users (Admin only)
router.get("/", auth(UserRole.ADMIN), getUsers);

export default router;
