import { Router } from "express";
import auth from "../../middlewares/auth.js";
import { addToCart, getCart } from "./carts.controller.js";

const router = Router();

import { UserRole } from "../../middlewares/auth.js";

router.post("/", auth(UserRole.USER), addToCart);
router.get("/", auth(UserRole.USER), getCart);

export default router;
