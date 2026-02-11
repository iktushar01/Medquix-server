import { Router } from "express";
import auth from "../../middlewares/auth.js";
import { getProfile, updateProfile } from "./auth.controller.js";

const router = Router();

const authMiddleware = auth();

router.get("/", authMiddleware, getProfile);
router.get("/me", authMiddleware, getProfile);
router.patch("/", authMiddleware, updateProfile);
router.patch("/me", authMiddleware, updateProfile);

export default router;
