import { prisma } from "../../lib/prisma.js";

export const addToCart = async (
  userId: string,
  medicineId: number,
  quantity: number
) => {
  // 1. Check medicine
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
  });

  if (!medicine || !medicine.isActive) {
    throw new Error("Medicine not available");
  }

  if (medicine.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  // 2. Check if item already in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      customerId_medicineId: {
        customerId: userId,
        medicineId,
      },
    },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  }

  // 3. Add new item
  return prisma.cartItem.create({
    data: {
      customerId: userId,
      medicineId,
      quantity,
    },
  });
};


export const getCart = async (userId: string) => {
  const cartItems = await prisma.cartItem.findMany({
    where: {
      customerId: userId,
    },
    include: {
      medicine: {
        select: {
          id: true,
          name: true,
          price: true,
          manufacturer: true,
          stock: true,
        },
      },
    },
  });

  const total = cartItems.reduce((sum, item) => {
    return sum + Number(item.medicine.price) * item.quantity;
  }, 0);

  return {
    items: cartItems,
    total,
  };
};

