
import { prisma } from "@/lib/prisma";

import type {
  ResourceInput,
} from "@/lib/validators/resource";

// ==========================================
// GET ALL RESOURCES
// ==========================================

export async function getAllResources() {
  return prisma.resource.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      location: true,
      capacity: true,
      isActive: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

// ==========================================
// CREATE RESOURCE
// ==========================================

export async function createResource(
  data: ResourceInput
) {
  return prisma.resource.create({
    data: {
      name: data.name,
      location: data.location,
      capacity: data.capacity,
      description: data.description || null,
      isActive: true,
    },
  });
}

// ==========================================
// DISABLE / REACTIVATE RESOURCE
// ==========================================

export async function setResourceActive(
  id: string,
  isActive: boolean
) {
  const result = await prisma.resource.updateMany({
    where: {
      id,
    },

    data: {
      isActive,
    },
  });

  if (result.count === 0) {
    throw new Error("Resource not found");
  }

  return result;
}

// ==========================================
// GET RESOURCE BY ID
// ==========================================

export async function getResourceById(
  id: string
) {
  return prisma.resource.findUnique({
    where: {
      id,
    },
  });
}

// ==========================================
// UPDATE RESOURCE
// ==========================================

export async function updateResource(
  id: string,
  data: ResourceInput
) {
  const result = await prisma.resource.updateMany({
    where: {
      id,
    },

    data: {
      name: data.name,
      location: data.location,
      capacity: data.capacity,
      description: data.description || null,
    },
  });

  if (result.count === 0) {
    throw new Error("Resource not found");
  }

  return result;
}

// ==========================================
// GET ACTIVE RESOURCES FOR BOOKINGS
// ==========================================

export async function getActiveResources() {
  return prisma.resource.findMany({
    where: {
      isActive: true,
    },

    select: {
      id: true,
      name: true,
      location: true,
      capacity: true,
    },

    orderBy: {
      name: "asc",
    },
  });
}
