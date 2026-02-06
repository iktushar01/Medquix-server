import { Request, Response } from "express";
import { createMedicineService } from "./medicine.services.js";

export const createMedicine = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user!.id; // from auth middleware
    const payload = { ...req.body, sellerId };

    const medicine = await createMedicineService(payload);

    res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      data: medicine
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
