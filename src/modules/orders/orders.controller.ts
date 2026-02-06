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


export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const orders = await OrderService.getMyOrders(userId);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.id);

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    const order = await OrderService.getOrderDetails(userId, orderId);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};


export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.id);

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    const cancelledOrder = await OrderService.cancelOrder(userId, orderId);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: cancelledOrder,
    });
  } catch (error: any) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user!.id;
    const orderId = Number(req.params.id);
    const { status } = req.body;

    if (!["PROCESSING", "SHIPPED", "DELIVERED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const updatedOrder = await OrderService.updateOrderStatus(
      sellerId,
      orderId,
      status
    );

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error: any) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};


export const getSellerOrders = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user!.id;

    const orders = await OrderService.getSellerOrders(sellerId);

    res.status(200).json({
      success: true,
      message: "Seller orders fetched successfully",
      data: orders,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};