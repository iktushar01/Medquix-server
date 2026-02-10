import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth.js";
import { addToCart, getCart, removeFromCart } from "./carts.controller.js";

const router = Router();

// Protect all cart routes for logged-in users
router.post("/", auth(UserRole.USER), addToCart);
router.get("/", auth(UserRole.USER), getCart);
router.delete("/:medicineId", auth(UserRole.USER), removeFromCart);

export default router;
