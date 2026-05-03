export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "ADMIN" | "MODERATOR" | "USER" | (string & {});
  bannedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminStats = {
  totalUsers: number;
  verifiedUsers: number;
  bannedUsers: number;
  totalSessions: number;
};

