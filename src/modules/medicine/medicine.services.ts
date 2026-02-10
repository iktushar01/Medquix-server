import { prisma } from "../../lib/prisma.js";

/* =======================
   CREATE
======================= */
export const createMedicineService = async (payload: any) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });
  if (!category) throw new Error("Category not found");

  const { images, ...medicineData } = payload;

  return prisma.medicine.create({
    data: {
      ...medicineData,
      images: images
        ? {
            create: images.map((url: string) => ({
              imageUrl: url,
            })),
          }
        : undefined,
    },
    include: { images: true },
  });
};

/* =======================
   GET ALL (FIXED)
======================= */
export const getAllMedicinesService = async (filters: any) => {
  const { category, minPrice, maxPrice, name } = filters;

  const where: any = { isActive: true };

  if (category) where.categoryId = Number(category);
  if (minPrice) where.price = { gte: Number(minPrice) };
  if (maxPrice) where.price = { ...where.price, lte: Number(maxPrice) };
  if (name)
    where.name = { contains: name, mode: "insensitive" };

  return prisma.medicine.findMany({
    where,
    include: {
      category: true,
      images: true, // ✅ FIX
    },
    orderBy: { createdAt: "desc" },
  });
};

/* =======================
   GET BY ID (FIXED)
======================= */
export const getMedicineByIdService = async (id: number) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: true,
      images: true, // ✅ FIX
    },
  });

  if (!medicine) throw new Error("Medicine not found");
  return medicine;
};

/* =======================
   SELLER MEDICINES (FIXED)
======================= */
export const getSellerMedicinesFromDB = async (sellerId: string) => {
  return prisma.medicine.findMany({
    where: {
      sellerId,
      isActive: true,
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
      images: true, // ✅ FIX
    },
    orderBy: { createdAt: "desc" },
  });
};

/* =======================
   UPDATE
======================= */
export const updateSellerMedicineInDB = async (
  medicineId: number,
  sellerId: string,
  payload: any
) => {
  const medicine = await prisma.medicine.findFirst({
    where: { id: medicineId, sellerId, isActive: true },
  });

  if (!medicine) throw new Error("Medicine not found or unauthorized");

  const { images, ...medicineData } = payload;

  await prisma.medicine.update({
    where: { id: medicineId },
    data: medicineData,
  });

  if (images) {
    await prisma.medicineImage.deleteMany({ where: { medicineId } });

    await prisma.medicineImage.createMany({
      data: images.map((url: string) => ({
        medicineId,
        imageUrl: url,
      })),
    });
  }

  return prisma.medicine.findUnique({
    where: { id: medicineId },
    include: { images: true },
  });
};

/* =======================
   DELETE (SOFT)
======================= */
export const deleteSellerMedicineFromDB = async (
  medicineId: number,
  sellerId: string
) => {
  const medicine = await prisma.medicine.findFirst({
    where: { id: medicineId, sellerId, isActive: true },
  });

  if (!medicine) {
    throw new Error("Medicine not found or unauthorized");
  }

  return prisma.medicine.update({
    where: { id: medicineId },
    data: { isActive: false },
  });
};
