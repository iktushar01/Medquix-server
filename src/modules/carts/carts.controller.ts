import { Request, Response } from "express";
import * as CartService from "./carts.services.js";

// Add item to cart
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

    const cartItem = await CartService.addToCart(userId, medicineId, quantity);

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

// Get all cart items for user
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const cart = await CartService.getCart(userId);

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update quantity
export const updateQuantity = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const cartItemId = Number(req.params.cartItemId);
    const { quantity } = req.body;

    if (!cartItemId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "cartItemId and valid quantity are required",
      });
    }

    const updatedItem = await CartService.updateQuantity(userId, cartItemId, quantity);

    res.status(200).json({
      success: true,
      message: "Quantity updated",
      data: updatedItem,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove cart item
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const cartItemId = Number(req.params.cartItemId);

    if (!cartItemId) {
      return res.status(400).json({
        success: false,
        message: "cartItemId is required",
      });
    }

    await CartService.removeFromCart(userId, cartItemId);

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
