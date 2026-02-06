import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth.js";
import { createOrder, getMyOrders } from "./orders.controller.js";

const router = Router();

router.post("/", auth(UserRole.USER), createOrder);
router.get("/", auth(UserRole.USER), getMyOrders);

export default router;
