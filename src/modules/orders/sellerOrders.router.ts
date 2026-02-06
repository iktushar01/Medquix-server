import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth.js";
import { updateOrderStatus, getSellerOrders } from "./orders.controller.js";

const router = Router();
router.get("/", auth(UserRole.SELLER), getSellerOrders);
router.patch("/:id/status", auth(UserRole.SELLER), updateOrderStatus);

export default router;
