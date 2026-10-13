
import { prisma } from "@/lib/prisma";
import type { ReservationInput } from "@/lib/validators/reservation";

// =====================================
// Reservation Business Error
// =====================================

export class ReservationBusinessError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "ReservationBusinessError";
  }
}

// =====================================
// Detect Database Booking Conflicts
// =====================================

function isOverlapError(error: unknown): boolean {
  let current: unknown = error;

  for (let i = 0; i < 6; i++) {
    if (!current || typeof current !== "object") {
      break;
    }

    const item = current as {
      code?: unknown;
      originalCode?: unknown;
      message?: unknown;
      meta?: unknown;
      cause?: unknown;
    };

    const details =
      typeof item.message === "string"
        ? item.message
        : "";

    const metadata = item.meta
      ? JSON.stringify(item.meta)
      : "";

    if (
      item.code === "23P01" ||
      item.originalCode === "23P01" ||
      details.includes("reservation_prevent_overlap") ||
      metadata.includes("reservation_prevent_overlap") ||
      metadata.includes("23P01")
    ) {
      return true;
    }

    current = item.cause;
  }

  return false;
}

// =====================================
// CREATE RESERVATION
// =====================================

export async function createReservation(
  userId: string,
  data: ReservationInput
) {
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  // Validate reservation time
  if (
    !Number.isFinite(startTime.getTime()) ||
    !Number.isFinite(endTime.getTime()) ||
    startTime.getTime() <= Date.now() ||
    endTime.getTime() <= startTime.getTime()
  ) {
    throw new ReservationBusinessError(
      "Invalid reservation date or time",
      400
    );
  }

  try {
    return await prisma.$transaction(async (tx) => {

      // Check resource exists
      const resource = await tx.resource.findUnique({
        where: {
          id: data.resourceId,
        },
      });

      if (!resource) {
        throw new ReservationBusinessError(
          "Resource not found",
          404
        );
      }

      // Block inactive resources
      if (!resource.isActive) {
        throw new ReservationBusinessError(
          "This resource is currently unavailable",
          400
        );
      }

      // Check overlapping confirmed bookings
      const existingBooking =
        await tx.reservation.findFirst({
          where: {
            resourceId: data.resourceId,
            status: "CONFIRMED",

            startTime: {
              lt: endTime,
            },

            endTime: {
              gt: startTime,
            },
          },
        });

      if (existingBooking) {
        throw new ReservationBusinessError(
          "This resource is already booked during the selected time",
          409
        );
      }

      // Save booking to PostgreSQL
      return tx.reservation.create({
        data: {
          userId,
          resourceId: data.resourceId,
          startTime,
          endTime,
          purpose: data.purpose,
          status: "CONFIRMED",
        },
      });
    });

  } catch (error) {

    // Handle PostgreSQL exclusion constraint
    if (isOverlapError(error)) {
      throw new ReservationBusinessError(
        "This time slot is already reserved",
        409
      );
    }

    throw error;
  }
}

// =====================================
// GET RESERVATIONS
// =====================================

export async function getReservationsForUser(
  userId: string,
  isAdmin: boolean
) {
  return prisma.reservation.findMany({
    where: isAdmin ? {} : { userId },

    include: {
      resource: {
        select: {
          name: true,
          location: true,
        },
      },

      user: {
        select: {
          name: true,
        },
      },
    },

    orderBy: {
      startTime: "desc",
    },

    take: 100,
  });
}
