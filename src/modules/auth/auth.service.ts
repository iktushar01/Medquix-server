
import { prisma } from "../../lib/prisma.js";

export const AuthService = {
  // Fetch user profile by ID
  getProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  // Update user profile
  updateProfile: async (
    userId: string,
    data: { name?: string; phone?: string }
  ) => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
      },
    });

    return updatedUser;
  },
};
