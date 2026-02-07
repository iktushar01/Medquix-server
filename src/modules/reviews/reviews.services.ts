import { prisma } from "../../lib/prisma.js";

export const createReview = async (
  customerId: string,
  medicineId: number,
  rating: number,
  comment?: string
) => {
  // 1️⃣ Check if medicine exists
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
  });

  if (!medicine || !medicine.isActive) {
    throw new Error("Medicine not found or inactive");
  }

  // 2️⃣ Check if customer received this medicine (DELIVERED order)
  const deliveredItem = await prisma.orderItem.findFirst({
    where: {
      medicineId,
      order: {
        customerId,
        status: "DELIVERED",
      },
    },
  });

  if (!deliveredItem) {
    throw new Error("You can only review medicines you have received");
  }

  // 3️⃣ Prevent duplicate review (unique constraint logic)
  const existingReview = await prisma.review.findUnique({
    where: {
      customerId_medicineId: {
        customerId,
        medicineId,
      },
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this medicine");
  }

  // 4️⃣ Create review
  return prisma.review.create({
    data: {
      customerId,
      medicineId,
      rating,
      comment: comment || null,
    },
  });
};
