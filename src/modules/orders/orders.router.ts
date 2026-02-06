import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth.js";
import { createOrder } from "./orders.controller.js";

const router = Router();

router.post("/", auth(UserRole.USER), createOrder);

export default router;
