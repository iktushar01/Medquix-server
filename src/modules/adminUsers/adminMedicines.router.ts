import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth.js";
import { getAllMedicines } from "./adminMedicines.controller.js";

const router = Router();

// Only admin can access
router.get("/", auth(UserRole.ADMIN), getAllMedicines);

export default router;
