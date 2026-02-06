import { prisma } from "../../lib/prisma.js";

interface CreateCategoryPayload {
  name: string;
  description?: string;
  parentId?: number;
}

interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  parentId?: number | null;
  isActive?: boolean;
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


export const updateCategoryService = async (id: number, payload: UpdateCategoryPayload) => {
  // check if category exists
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Category not found");
  }

  // optional: validate parentId (cannot set itself as parent)
  if (payload.parentId && payload.parentId === id) {
    throw new Error("Category cannot be its own parent");
  }

  // optional: check if parent exists
  if (payload.parentId) {
    const parent = await prisma.category.findUnique({ where: { id: payload.parentId } });
    if (!parent) throw new Error("Parent category not found");
  }

  // update
  const updated = await prisma.category.update({
    where: { id },
    data: payload
  });

  return updated;
};