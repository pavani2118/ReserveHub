import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authMock,
  findUserMock,
  redirectMock,
} = vi.hoisted(() => ({
  authMock: vi.fn(),
  findUserMock: vi.fn(),
  redirectMock: vi.fn((path: string): never => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock("@/auth", () => ({ auth: authMock }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));
vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: findUserMock } },
}));

import { requireAdmin } from "@/lib/auth/require-admin";

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated users to login", async () => {
    authMock.mockResolvedValue(null);

    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/login");
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("redirects members away from administrator surfaces", async () => {
    authMock.mockResolvedValue({ user: { id: "member-id" } });
    findUserMock.mockResolvedValue({
      id: "member-id",
      name: "Member",
      role: "MEMBER",
    });

    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/");
    expect(redirectMock).toHaveBeenCalledWith("/");
  });

  it("returns the current administrator", async () => {
    const admin = { id: "admin-id", name: "Admin", role: "ADMIN" };
    authMock.mockResolvedValue({ user: { id: admin.id } });
    findUserMock.mockResolvedValue(admin);

    await expect(requireAdmin()).resolves.toEqual(admin);
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
