import { prisma } from "../../lib/prisma.js";

interface CreateMedicinePayload {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  manufacturer?: string;
  expiryDate?: Date;
  sellerId: string;
}

export const createMedicineService = async (payload: CreateMedicinePayload) => {
  // Check if category exists
  const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
  if (!category) throw new Error("Category not found");

  // Create medicine
  const medicine = await prisma.medicine.create({
    data: payload
  });

  return medicine;
};


export const getAllMedicinesService = async (filters: any) => {
  const { category, minPrice, maxPrice, name } = filters;

  const where: any = { isActive: true };

  if (category) where.categoryId = Number(category);
  if (minPrice) where.price = { gte: Number(minPrice) };
  if (maxPrice) where.price = { ...where.price, lte: Number(maxPrice) };
  if (name) where.name = { contains: name, mode: "insensitive" };

  return await prisma.medicine.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getMedicineByIdService = async (id: number) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: { category: true, reviews: true },
  });
  if (!medicine) throw new Error("Medicine not found");
  return medicine;
};


 export const getSellerMedicinesFromDB = async (sellerId: string) => {
  const medicines = await prisma.medicine.findMany({
    where: {
      sellerId,
      isActive: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return medicines;
};

