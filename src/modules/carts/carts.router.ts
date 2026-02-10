import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth.js";
import { addToCart, getCart, removeFromCart, updateQuantity } from "./carts.controller.js";

const router = Router();

router.post("/", auth(UserRole.USER), addToCart);                  // Add item
router.get("/", auth(UserRole.USER), getCart);                    // Get cart
router.patch("/:cartItemId", auth(UserRole.USER), updateQuantity); // Update quantity
router.delete("/:cartItemId", auth(UserRole.USER), removeFromCart); // Delete item

export default router;
