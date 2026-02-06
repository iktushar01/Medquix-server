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
