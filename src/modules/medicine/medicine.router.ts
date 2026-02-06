import { Router } from "express";
import { createMedicine } from "./medicine.controller.js";
import auth, { UserRole } from "../../middlewares/auth.js";

const router = Router();

// POST /api/seller/medicines — seller only
router.post("/", auth(UserRole.SELLER), createMedicine);

export default router;
