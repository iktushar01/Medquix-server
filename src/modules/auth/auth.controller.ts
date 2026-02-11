import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

// ==========================
// GET CURRENT USER PROFILE
// ==========================
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id; // from JWT middleware
    const user = await AuthService.getProfile(userId);

    res.json(user);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// ==========================
// UPDATE USER PROFILE
// ==========================
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, phone } = req.body;

    const updatedUser = await AuthService.updateProfile(userId, { name, phone });

    res.json(updatedUser);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
