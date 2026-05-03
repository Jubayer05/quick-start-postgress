import { prisma } from "../../lib/prisma.js";

export const getProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateProfile = async (
  userId: string,
  payload: { name?: string },
) => {
  const data: { name?: string } = {};
  if (typeof payload.name === "string" && payload.name.trim() !== "") {
    data.name = payload.name.trim();
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const uploadAvatar = async (userId: string, image: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { image },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const getSessions = async (userId: string) => {
  return prisma.session.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
      ipAddress: true,
      userAgent: true,
    },
  });
};

export const revokeSession = async (userId: string, sessionId: string) => {
  const deleted = await prisma.session.deleteMany({
    where: { id: sessionId, userId },
  });
  return { revoked: deleted.count > 0 };
};

export const deleteAccount = async (userId: string) => {
  await prisma.user.delete({ where: { id: userId } });
  return { deleted: true };
};

