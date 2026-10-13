import { describe, expect, it } from "vitest";
import { reservationSchema } from "@/lib/validators/reservation";

const resourceId = "00000000-0000-4000-8000-000000000001";

function input(hoursFromNow: number, durationHours: number) {
  const start = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

  return {
    resourceId,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    purpose: "Team planning",
  };
}

describe("reservationSchema", () => {
  it("accepts a future reservation up to eight hours", () => {
    expect(reservationSchema.safeParse(input(2, 8)).success).toBe(true);
  });

  it("rejects an end time that is not after the start", () => {
    const result = reservationSchema.safeParse(input(2, 0));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toContain(
        "End time must be after start time"
      );
    }
  });

  it("rejects reservations in the past", () => {
    const result = reservationSchema.safeParse(input(-2, 1));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toContain(
        "Reservations must be in the future"
      );
    }
  });

  it("rejects reservations longer than eight hours", () => {
    const result = reservationSchema.safeParse(input(2, 8.01));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toContain(
        "Reservation duration cannot exceed 8 hours"
      );
    }
  });

  it("rejects invalid resource IDs and short purposes", () => {
    const result = reservationSchema.safeParse({
      ...input(2, 1),
      resourceId: "not-a-uuid",
      purpose: "No",
    });

    expect(result.success).toBe(false);
  });
});
