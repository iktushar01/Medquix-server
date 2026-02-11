import { prisma } from "../../lib/prisma.js";

export const createReview = async (
  customerId: string,
  medicineId: number,
  orderId: number,
  rating: number,
  comment?: string
) => {
  // 1️⃣ Check medicine exists & active
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
  });

  if (!medicine || !medicine.isActive) {
    throw new Error("Medicine not found or inactive");
  }

  // 2️⃣ Check delivered order contains this medicine
  const deliveredItem = await prisma.orderItem.findFirst({
    where: {
      medicineId,
      orderId,
      order: {
        customerId,
        status: "DELIVERED",
      },
    },
  });

  if (!deliveredItem) {
    throw new Error(
      "You can only review medicines from delivered orders"
    );
  }

  // 3️⃣ Prevent duplicate review using findFirst
  const existingReview = await prisma.review.findFirst({
    where: {
      customerId,
      medicineId,
      orderId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this medicine in this order");
  }

  // 4️⃣ Create review
  return prisma.review.create({
    data: {
      customerId,
      medicineId,
      orderId,
      rating,
      comment: comment || null,
    },
  });
};

// ==========================
// Get reviews by medicine
// ==========================
export const getReviewsByMedicine = async (medicineId: number) => {
  const reviews = await prisma.review.findMany({
    where: {
      medicineId,
      isActive: true,
    },
    include: {
      medicine: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

  return {
    medicineId,
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews: reviews.length,
    reviews,
  };
};

// ==========================
// Update review
// ==========================
export const updateReview = async (
  customerId: string,
  reviewId: number,
  rating?: number,
  comment?: string
) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review || review.customerId !== customerId) {
    throw new Error("Review not found or not authorized");
  }

  return prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: rating ?? review.rating,
      comment: comment ?? review.comment,
    },
  });
};

// ==========================
// Delete review
// ==========================
export const deleteReview = async (
  customerId: string,
  reviewId: number
) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review || review.customerId !== customerId) {
    throw new Error("Review not found or not authorized");
  }

  return prisma.review.delete({ where: { id: reviewId } });
};
