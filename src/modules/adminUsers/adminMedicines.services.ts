import { prisma } from "../../lib/prisma.js";

export const getAllMedicines = async () => {
  return prisma.medicine.findMany({
    include: {
      category: true,
      reviews: true,
    },
    orderBy: { createdAt: "desc" },
  });
};
