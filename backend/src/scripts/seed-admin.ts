import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hashPassword } from "@better-auth/utils/password";
import { prisma } from "../lib/prisma.js";

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (!email) {
    throw new Error("ADMIN_EMAIL is required");
  }
  if (!password) {
    throw new Error("ADMIN_PASSWORD is required");
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  const userId = existing?.id ?? randomUUID();

  await prisma.user.upsert({
    where: { email },
    create: {
      id: userId,
      email,
      name: "Admin",
      emailVerified: true,
      role: "ADMIN",
    },
    update: {
      role: "ADMIN",
      emailVerified: true,
    },
  });

  const hash = await hashPassword(password);

  const existingAccount = await prisma.account.findFirst({
    where: { userId, providerId: "credential" },
    select: { id: true },
  });

  if (existingAccount) {
    await prisma.account.update({
      where: { id: existingAccount.id },
      data: { password: hash },
    });
  } else {
    await prisma.account.create({
      data: {
        id: randomUUID(),
        userId,
        providerId: "credential",
        accountId: userId,
        password: hash,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });

