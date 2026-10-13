import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    $transaction: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import {
  createReservation,
} from "@/services/reservation.service";

const resourceId = "00000000-0000-4000-8000-000000000001";
const userId = "00000000-0000-4000-8000-000000000002";

function booking(durationHours = 1) {
  const start = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

  return {
    resourceId,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    purpose: "Team planning",
  };
}

function transactionFor(resource: { isActive: boolean } | null, existingBooking: object | null = null) {
  const tx = {
    resource: { findUnique: vi.fn().mockResolvedValue(resource) },
    reservation: {
      findFirst: vi.fn().mockResolvedValue(existingBooking),
      create: vi.fn().mockResolvedValue({
        id: "00000000-0000-4000-8000-000000000003",
        resourceId,
        userId,
        status: "CONFIRMED",
      }),
    },
  };

  prismaMock.$transaction.mockImplementation(async (callback) => callback(tx));
  return tx;
}

describe("createReservation", () => {
  beforeEach(() => {
    prismaMock.$transaction.mockReset();
  });

  it("rejects a past or reversed time range before database access", async () => {
    const data = booking();
    data.startTime = new Date(Date.now() - 60_000).toISOString();
    data.endTime = new Date(Date.now() - 30_000).toISOString();

    await expect(createReservation(userId, data)).rejects.toMatchObject({
      message: "Invalid reservation date or time",
      statusCode: 400,
    });
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("rejects a missing resource", async () => {
    transactionFor(null);

    await expect(createReservation(userId, booking())).rejects.toEqual(
      expect.objectContaining({
        message: "Resource not found",
        statusCode: 404,
      })
    );
  });

  it("rejects an inactive resource", async () => {
    transactionFor({ isActive: false });

    await expect(createReservation(userId, booking())).rejects.toEqual(
      expect.objectContaining({
        message: "This resource is currently unavailable",
        statusCode: 400,
      })
    );
  });

  it("rejects an overlapping confirmed reservation", async () => {
    const tx = transactionFor({ isActive: true }, { id: "existing" });

    await expect(createReservation(userId, booking())).rejects.toEqual(
      expect.objectContaining({
        message: "This resource is already booked during the selected time",
        statusCode: 409,
      })
    );
    expect(tx.reservation.create).not.toHaveBeenCalled();
  });

  it("accepts a slot that the database overlap query considers adjacent", async () => {
    const tx = transactionFor({ isActive: true });

    await expect(createReservation(userId, booking())).resolves.toMatchObject({
      status: "CONFIRMED",
    });
    expect(tx.reservation.create).toHaveBeenCalledOnce();
  });

  it("maps PostgreSQL exclusion violations to a conflict error", async () => {
    transactionFor({ isActive: true });
    prismaMock.$transaction.mockRejectedValue({
      code: "23P01",
      message: "reservation_prevent_overlap",
    });

    await expect(createReservation(userId, booking())).rejects.toEqual(
      expect.objectContaining({
        message: "This time slot is already reserved",
        statusCode: 409,
      })
    );
  });

});
