import { Router } from "express";
import {
  createMedicine,
  deleteSellerMedicine,
  getAllMedicines,
  getMedicineById,
  getSellerMedicines,
  updateSellerMedicine,
} from "./medicine.controller.js";
import auth, { UserRole } from "../../middlewares/auth.js";

const router = Router();
const sellerRouter = Router();

// Seller routes
sellerRouter.get("/", auth(UserRole.SELLER), getSellerMedicines);
sellerRouter.post("/", auth(UserRole.SELLER), createMedicine);
sellerRouter.patch("/:id", auth(UserRole.SELLER), updateSellerMedicine);
sellerRouter.delete("/:id", auth(UserRole.SELLER), deleteSellerMedicine);

// Public routes
router.get("/", getAllMedicines);
router.get("/:id", getMedicineById);

export { sellerRouter };
export default router;
