
import "dotenv/config";
import { hash } from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !email.includes("@")) {
    throw new Error("A valid ADMIN_EMAIL is required");
  }

  if (!password || password.length < 12) {
    throw new Error(
      "Admin password must be at least 12 characters"
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const passwordHash = await hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      name: "ReserveHub Admin",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Admin account created successfully!");
  console.log("Email:", admin.email);
  console.log("Role:", admin.role);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
