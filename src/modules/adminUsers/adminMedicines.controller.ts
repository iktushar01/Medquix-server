import { Request, Response } from "express";
import * as AdminMedicineService from "./adminMedicines.services.js";
export const getAllMedicines = async (req: Request, res: Response) => {
  try {
    const medicines = await AdminMedicineService.getAllMedicines();
    res.status(200).json({
      success: true,
      message: "All medicines fetched successfully",
      data: medicines,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
