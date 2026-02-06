import { Router } from "express";
import auth from "../../middlewares/auth.js";
import { addToCart, getCart, removeFromCart } from "./carts.controller.js";

const router = Router();

import { UserRole } from "../../middlewares/auth.js";

router.post("/", auth(UserRole.USER), addToCart);
router.get("/", auth(UserRole.USER), getCart);
router.delete("/:medicineId", auth(UserRole.USER), removeFromCart);

export default router;
