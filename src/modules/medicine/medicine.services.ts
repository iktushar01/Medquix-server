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


interface UpdateMedicinePayload {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  manufacturer?: string;
  expiryDate?: Date;
  isActive?: boolean;
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

export const updateSellerMedicineInDB = async (
  medicineId: number,
  sellerId: string,
  payload: UpdateMedicinePayload
) => {
  // 1️⃣ Check ownership
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

  // 2️⃣ Update medicine
  const updatedMedicine = await prisma.medicine.update({
    where: { id: medicineId },
    data: payload,
  });

  return updatedMedicine;
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
//   const medicine = await prisma.medicine.findFirst({
//     where: {
//       id,
//       isActive: true,
//     },
//     include: {
//       category: true,
//       reviews: {
//         where: { isActive: true },
//         select: {
//           id: true,
//           rating: true,
//           comment: true,
//           customerId: true,
//           createdAt: true
//         }
//       }
//     },
//   });

//   if (!medicine) throw new Error("Medicine not found");

//   return medicine;
// };