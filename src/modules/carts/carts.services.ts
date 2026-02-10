import { prisma } from "../../lib/prisma.js";

// Add item to cart
export const addToCart = async (userId: string, medicineId: number, quantity: number) => {
  const medicine = await prisma.medicine.findUnique({ where: { id: medicineId } });

  if (!medicine || !medicine.isActive) throw new Error("Medicine not available");
  if (medicine.stock < quantity) throw new Error("Insufficient stock");

  const existingItem = await prisma.cartItem.findUnique({
    where: { customerId_medicineId: { customerId: userId, medicineId } },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }

  return prisma.cartItem.create({
    data: { customerId: userId, medicineId, quantity },
  });
};

// Get all cart items
export const getCart = async (userId: string) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { customerId: userId },
    include: {
      medicine: {
        select: {
          id: true,
          name: true,
          price: true,
          manufacturer: true,
          stock: true,
          images: { select: { imageUrl: true }, orderBy: { id: "asc" } },
        },
      },
    },
  });

  const total = cartItems.reduce((sum, item) => sum + Number(item.medicine.price) * item.quantity, 0);

  return { items: cartItems, total };
};

// Update quantity
export const updateQuantity = async (userId: string, cartItemId: number, quantity: number) => {
  const cartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId } });

  if (!cartItem || cartItem.customerId !== userId) throw new Error("Item not found in cart");

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
};

// Remove item
export const removeFromCart = async (userId: string, cartItemId: number) => {
  const cartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId } });

  if (!cartItem || cartItem.customerId !== userId) throw new Error("Item not found in cart");

  await prisma.cartItem.delete({ where: { id: cartItemId } });
  return true;
};
