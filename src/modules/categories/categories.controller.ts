import { Request, Response } from "express";
import { createCategoryService, getCategoriesService, updateCategoryService,deleteCategoryService } from "./categories.services.js";

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


export const updateCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID"
      });
    }

    const payload = req.body; // { name?, description?, parentId?, isActive? }

    const updatedCategory = await updateCategoryService(categoryId, payload);

    res.json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory
    });

  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Category name already exists under this parent"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};


export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID"
      });
    }

    const deletedCategory = await deleteCategoryService(categoryId);

    res.json({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};