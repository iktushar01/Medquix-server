import { Request, Response } from "express";
import * as AdminUserService from "./adminUsers.services.js";

export const getUsers = async (req: Request, res: Response) => {
  try {
    // Call service to fetch all users
    const users = await AdminUserService.getUsers();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;           // User ID to update
    const { status } = req.body;         // New status (ACTIVE or BANNED)

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!status || !["ACTIVE", "BANNED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'ACTIVE' or 'BANNED'.",
      });
    }

    const updatedUser = await AdminUserService.updateUserStatus(id, status);

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};