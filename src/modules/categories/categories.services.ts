import { prisma } from "../../lib/prisma.js";

interface CreateCategoryPayload {
  name: string;
  description?: string;
  parentId?: number;
}

export const createCategoryService = async (payload: CreateCategoryPayload) => {
  const { name, description, parentId } = payload;

  // optional: check parent exists
  if (parentId) {
    const parentCategory = await prisma.category.findUnique({
      where: { id: parentId }
    });

    if (!parentCategory) {
      throw new Error("Parent category not found");
    }
  }

  const category = await prisma.category.create({
    data: {
      name,
      description: description ?? null,
      parentId: parentId ?? null
    }
  });

  return category;
};


export const getCategoriesService = async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
};
