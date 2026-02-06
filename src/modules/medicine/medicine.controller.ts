import { Request, Response } from "express";
import { createMedicineService, getAllMedicinesService, getMedicineByIdService, getSellerMedicinesFromDB, updateSellerMedicineInDB, deleteSellerMedicineFromDB } from "./medicine.services.js";

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


export const getAllMedicines = async (req: Request, res: Response) => {
  try {
    const medicines = await getAllMedicinesService(req.query);
    res.status(200).json({ success: true, data: medicines });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMedicineById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const medicine = await getMedicineByIdService(id);
    res.status(200).json({ success: true, data: medicine });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getSellerMedicines = async (req: Request, res: Response) => {
  const sellerId = req.user!.id;

  const result = await getSellerMedicinesFromDB(sellerId);

  res.status(200).json({
    success: true,
    message: "Seller medicines fetched successfully",
    data: result,
  });
};


export const updateSellerMedicine = async (req: Request, res: Response) => {
  const medicineId = Number(req.params.id);
  const sellerId = req.user!.id;
  const payload = req.body;

  const result = await updateSellerMedicineInDB(
    medicineId,
    sellerId,
    payload
  );

  res.status(200).json({
    success: true,
    message: "Medicine updated successfully",
    data: result,
  });
};

export const deleteSellerMedicine = async (req: Request, res: Response) => {
  const medicineId = Number(req.params.id);
  const sellerId = req.user!.id;

  const result = await deleteSellerMedicineFromDB(
    medicineId,
    sellerId
  );

  res.status(200).json({
    success: true,
    message: "Medicine deleted successfully",
    data: result,
  });
};