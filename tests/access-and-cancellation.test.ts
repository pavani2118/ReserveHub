import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authMock,
  findUserMock,
  updateManyMock,
  revalidatePathMock,
} = vi.hoisted(() => ({
  authMock: vi.fn(),
  findUserMock: vi.fn(),
  updateManyMock: vi.fn(),
  revalidatePathMock: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: authMock }));
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: findUserMock },
    reservation: { updateMany: updateManyMock },
  },
}));

import { cancelReservationAction } from "@/actions/cancel-reservation";

const reservationId = "00000000-0000-4000-8000-000000000003";
const userId = "00000000-0000-4000-8000-000000000002";

describe("cancelReservationAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires an authenticated user", async () => {
    authMock.mockResolvedValue(null);

    await expect(
      cancelReservationAction(reservationId, { ok: false, message: "" }, new FormData())
    ).resolves.toEqual({
      ok: false,
      message: "Please sign in to continue.",
    });
    expect(findUserMock).not.toHaveBeenCalled();
  });

  it("rejects malformed reservation IDs", async () => {
    authMock.mockResolvedValue({ user: { id: userId } });

    await expect(
      cancelReservationAction("invalid", { ok: false, message: "" }, new FormData())
    ).resolves.toEqual({
      ok: false,
      message: "Invalid reservation ID.",
    });
  });

  it("limits member cancellation to the member's own confirmed reservation", async () => {
    authMock.mockResolvedValue({ user: { id: userId } });
    findUserMock.mockResolvedValue({ id: userId, role: "MEMBER" });
    updateManyMock.mockResolvedValue({ count: 1 });

    await expect(
      cancelReservationAction(reservationId, { ok: false, message: "" }, new FormData())
    ).resolves.toEqual({
      ok: true,
      message: "Reservation cancelled successfully.",
    });
    expect(updateManyMock).toHaveBeenCalledWith({
      where: { id: reservationId, status: "CONFIRMED", userId },
      data: { status: "CANCELLED" },
    });
  });

  it("allows an administrator to cancel a confirmed reservation", async () => {
    authMock.mockResolvedValue({ user: { id: userId } });
    findUserMock.mockResolvedValue({ id: userId, role: "ADMIN" });
    updateManyMock.mockResolvedValue({ count: 1 });

    await cancelReservationAction(
      reservationId,
      { ok: false, message: "" },
      new FormData()
    );

    expect(updateManyMock).toHaveBeenCalledWith({
      where: { id: reservationId, status: "CONFIRMED" },
      data: { status: "CANCELLED" },
    });
  });

  it("reports already-cancelled, missing, or unauthorized reservations", async () => {
    authMock.mockResolvedValue({ user: { id: userId } });
    findUserMock.mockResolvedValue({ id: userId, role: "MEMBER" });
    updateManyMock.mockResolvedValue({ count: 0 });

    await expect(
      cancelReservationAction(reservationId, { ok: false, message: "" }, new FormData())
    ).resolves.toEqual({
      ok: false,
      message: "Reservation not found, already cancelled, or access denied.",
    });
  });
});
