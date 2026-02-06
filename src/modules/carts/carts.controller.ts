import { Request, Response } from "express";
import * as CartService from "./carts.services.js";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { medicineId, quantity } = req.body;

    if (!medicineId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "medicineId and valid quantity are required",
      });
    }

    const cartItem = await CartService.addToCart(
      userId,
      medicineId,
      quantity
    );

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: cartItem,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const cartItems = await CartService.getCart(userId);

    res.status(200).json({
      success: true,
      data: cartItems,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const medicineId = Number(req.params.medicineId);

    if (!medicineId) {
      return res.status(400).json({
        success: false,
        message: "medicineId is required",
      });
    }

    await CartService.removeFromCart(userId, medicineId);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};