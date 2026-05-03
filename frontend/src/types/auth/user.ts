/** App roles allowed at registration; server defaults unknown values to USER. */
export type UserRole = "ADMIN" | "USER" | "MODERATOR";

/** Signed-in user shape (Better Auth user + Prisma `role` / profile fields). */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

/** Session slice returned with email sign-in (cookie / expiry alignment). */
export interface AuthSession {
  id?: string;
  userId?: string;
  expiresAt?: string | Date | number;
  token?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponseData {
  user: AuthUser;
  session?: AuthSession;
}
