import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth.js";
import { cancelOrder, createOrder, getMyOrders, getOrderDetails } from "./orders.controller.js";

const router = Router();

router.post("/", auth(UserRole.USER), createOrder);
router.get("/", auth(UserRole.USER), getMyOrders);
router.get("/:id", auth(UserRole.USER), getOrderDetails);
router.patch("/:id/cancel", auth(UserRole.USER), cancelOrder);

export default router;
