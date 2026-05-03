import { prisma } from "../../lib/prisma.js";
import { sendTemplateEmail } from "../../lib/mailer.js";

const ALLOWED_ROLES = new Set(["ADMIN", "USER", "MODERATOR"]);

export const listUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      bannedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateRole = async (userId: string, role: string) => {
  const normalized = role.trim().toUpperCase();
  if (!ALLOWED_ROLES.has(normalized)) {
    const allowed = Array.from(ALLOWED_ROLES).join(", ");
    throw new Error(`Invalid role. Allowed roles: ${allowed}`);
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role: normalized },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      bannedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const banUser = async (userId: string) => {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { bannedAt: new Date() },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      bannedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  await prisma.session.deleteMany({ where: { userId } });

  const appName = process.env.APP_NAME ?? "YourApp";
  void sendTemplateEmail({
    to: updated.email,
    subject: "Account suspended",
    template: "banned.html",
    variables: {
      appName,
      userName: updated.name || "there",
    },
  }).catch((err) => {
    console.error("Banned email failed:", err);
  });

  return updated;
};

export const unbanUser = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { bannedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      bannedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteUser = async (userId: string) => {
  await prisma.user.delete({ where: { id: userId } });
  return { deleted: true };
};

export const getStats = async () => {
  const [totalUsers, verifiedUsers, bannedUsers, totalSessions] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.user.count({ where: { bannedAt: { not: null } } }),
      prisma.session.count(),
    ]);

  return { totalUsers, verifiedUsers, bannedUsers, totalSessions };
};

