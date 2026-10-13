
import { z } from "zod";

export const resourceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Resource name must have at least 2 characters")
    .max(100),

  location: z
    .string()
    .trim()
    .min(2, "Location is required")
    .max(120),

  capacity: z.coerce
    .number<number>()
    .int("Capacity must be a whole number")
    .min(1, "Capacity must be at least 1")
    .max(10000),

  description: z.string().trim().max(500),
});

export type ResourceInput = z.infer<typeof resourceSchema>;
