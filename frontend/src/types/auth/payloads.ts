import type { UserRole } from "./user";

export interface RegisterPayload {
  name?: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
  /** Better Auth / email plugin may accept this */
  rememberMe?: boolean;
  callbackURL?: string;
}

export interface VerifyEmailPayload {
  email: string;
  callbackURL?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

/** Better Auth password reset body (token from email link). */
export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
