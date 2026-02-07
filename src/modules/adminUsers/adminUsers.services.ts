import { prisma } from "../../lib/prisma.js";

export const getUsers = async () => {
  // Fetch all users with basic info
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

interface FilterOptions {
  status?: string | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
}



export const updateUserStatus = async (userId: string, newStatus: string) => {
  // 1️⃣ Check if user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  // 2️⃣ Prevent banning/unbanning another admin
  if (user.role === "ADMIN") {
    throw new Error("Cannot change status of another admin");
  }

  // 3️⃣ Update status
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
  });

  return updatedUser;
};


export const getAllOrders = async (filters: FilterOptions) => {
  const { status, startDate, endDate } = filters;

  const whereClause: any = {};

  if (status) whereClause.status = status;
  if (startDate || endDate) {
    whereClause.createdAt = {};
    if (startDate) whereClause.createdAt.gte = startDate;
    if (endDate) whereClause.createdAt.lte = endDate;
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    include: {
      orderItems: {
        include: { medicine: true }, // Include medicines in order items
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
};