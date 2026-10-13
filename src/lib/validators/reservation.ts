
import { z } from "zod";

const MAX_DURATION_MS = 8 * 60 * 60 * 1000;

export const reservationSchema = z
  .object({
    resourceId: z.uuid(),

    startTime: z.iso.datetime(),

    endTime: z.iso.datetime(),

    purpose: z
      .string()
      .trim()
      .min(3, "Purpose must have at least 3 characters")
      .max(250, "Purpose is too long"),
  })

  // End time must be after start time
  .refine(
    (data) =>
      new Date(data.endTime).getTime() >
      new Date(data.startTime).getTime(),
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  )

  // Reservations must be in the future
  .refine(
    (data) =>
      new Date(data.startTime).getTime() > Date.now(),
    {
      message: "Reservations must be in the future",
      path: ["startTime"],
    }
  )

  // Maximum reservation duration: 8 hours
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);

      return (
        end.getTime() - start.getTime() <=
        MAX_DURATION_MS
      );
    },
    {
      message:
        "Reservation duration cannot exceed 8 hours",
      path: ["endTime"],
    }
  );

export type ReservationInput =
  z.infer<typeof reservationSchema>;
