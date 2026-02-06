import { Request, Response } from "express";
import { createCategoryService, getCategoriesService } from "./categories.services.js";
import { prisma } from "../../lib/prisma.js";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, parentId } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    const category = await createCategoryService({
      name,
      description,
      parentId
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });

  } catch (error: any) {
    // Prisma unique constraint error
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Category already exists under this parent"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};


export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await getCategoriesService();
    res.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};