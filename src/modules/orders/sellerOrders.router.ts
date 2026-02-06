import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth.js";
import { updateOrderStatus } from "./orders.controller.js";

const router = Router();

router.patch("/:id/status", auth(UserRole.SELLER), updateOrderStatus);

export default router;
