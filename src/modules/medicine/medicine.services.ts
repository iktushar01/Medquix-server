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
  images?: string[];
}


interface UpdateMedicinePayload {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  manufacturer?: string;
  expiryDate?: Date;
  isActive?: boolean;
  images?: string[];
}

export const createMedicineService = async (payload: CreateMedicinePayload) => {
  const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
  if (!category) throw new Error("Category not found");

  const { images, ...medicineData } = payload;

  const medicine = await prisma.medicine.create({
    data: {
      ...medicineData,
      ...(images ? { images: { create: images.map((url) => ({ imageUrl: url })) } } : {}),
    },
    include: { images: true },
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

export const updateSellerMedicineInDB = async (
  medicineId: number,
  sellerId: string,
  payload: UpdateMedicinePayload
) => {
  const medicine = await prisma.medicine.findFirst({
    where: { id: medicineId, sellerId, isActive: true },
    include: { images: true },
  });

  if (!medicine) throw new Error("Medicine not found or unauthorized");

  // Update medicine fields
  const { images, ...medicineData } = payload;

  // Update medicine fields
  const updatedMedicine = await prisma.medicine.update({
    where: { id: medicineId },
    data: medicineData,
    include: { images: true },
  });

  // If new images are provided, replace existing
  if (payload.images) {
    // Delete old images
    await prisma.medicineImage.deleteMany({ where: { medicineId } });

    // Create new images
    await prisma.medicineImage.createMany({
      data: payload.images.map((url) => ({ medicineId, imageUrl: url })),
    });
  }

  return prisma.medicine.findUnique({
    where: { id: medicineId },
    include: { images: true },
  });
};


export const deleteSellerMedicineFromDB = async (
  medicineId: number,
  sellerId: string
) => {
  // 1️⃣ Ownership check
  const medicine = await prisma.medicine.findFirst({
    where: {
      id: medicineId,
      sellerId,
      isActive: true,
    },
  });

  if (!medicine) {
    throw new Error("Medicine not found or unauthorized");
  }

  // 2️⃣ Soft delete
  const deletedMedicine = await prisma.medicine.update({
    where: { id: medicineId },
    data: {
      isActive: false,
    },
  });

  return deletedMedicine;
};
