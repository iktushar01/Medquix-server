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