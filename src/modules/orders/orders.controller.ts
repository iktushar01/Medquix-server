import { Request, Response } from "express";
import * as OrderService from "./orders.services.js";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const order = await OrderService.createOrder(userId, shippingAddress);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
