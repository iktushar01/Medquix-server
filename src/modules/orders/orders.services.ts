import { prisma } from "../../lib/prisma.js";

export const createOrder = async (
  userId: string,
  shippingAddress: string
) => {
  // 1️⃣ Get cart items
  const cartItems = await prisma.cartItem.findMany({
    where: { customerId: userId },
    include: { medicine: true },
  });

  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  // Calculate total amount
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.medicine.price) * item.quantity,
    0
  );

  // 2️⃣ Create order
  const order = await prisma.order.create({
    data: {
      customerId: userId,
      shippingAddress,
      status: "PLACED",
      totalAmount,
    },
  });

  // 3️⃣ Create order items + reduce stock
  for (const item of cartItems) {
    if (item.medicine.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.medicine.name}`);
    }

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        medicineId: item.medicineId,
        quantity: item.quantity,
        price: item.medicine.price, // 🔒 freeze price
      },
    });

    await prisma.medicine.update({
      where: { id: item.medicineId },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });
  }

  // 4️⃣ Clear cart
  await prisma.cartItem.deleteMany({
    where: { customerId: userId },
  });

  return order;
};


export const getMyOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: {
      customerId: userId,
    },
    include: {
      orderItems: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};