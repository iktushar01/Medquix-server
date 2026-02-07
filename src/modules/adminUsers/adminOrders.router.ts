import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth.js";
import { getAllOrders } from "./adminUsers.controller.js";

const router = Router();

// GET all orders (Admin only)
router.get("/", auth(UserRole.ADMIN), getAllOrders);

export default router;