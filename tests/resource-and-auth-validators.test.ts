import { describe, expect, it } from "vitest";
import { loginSchema } from "@/lib/validators/auth";
import { resourceSchema } from "@/lib/validators/resource";

describe("loginSchema", () => {
  it("normalizes valid email input and requires a password", () => {
    expect(loginSchema.parse({ email: "USER@EXAMPLE.COM", password: "secret" })).toEqual({
      email: "user@example.com",
      password: "secret",
    });
    expect(loginSchema.safeParse({ email: " user@example.com ", password: "secret" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "user@example.com", password: "" }).success).toBe(false);
  });
});

describe("resourceSchema", () => {
  it("accepts valid resource data and coerces capacity", () => {
    expect(resourceSchema.parse({
      name: "Board Room",
      location: "First floor",
      capacity: "12",
      description: "",
    })).toMatchObject({ name: "Board Room", capacity: 12, description: "" });
  });

  it("rejects invalid capacity and missing required location", () => {
    expect(resourceSchema.safeParse({
      name: "Room",
      location: "",
      capacity: "0",
      description: "",
    }).success).toBe(false);
  });
});
