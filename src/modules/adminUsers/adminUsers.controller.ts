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
