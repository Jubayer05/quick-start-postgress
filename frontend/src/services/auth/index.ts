import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/auth/api";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdatePasswordPayload,
  VerifyEmailPayload,
} from "@/types/auth/payloads";
import type { LoginResponseData } from "@/types/auth/user";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(
  url: string,
  options: RequestInit,
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new Error(json.message ?? "Request failed");
  }

  return json;
}

// ── Auth services ─────────────────────────────────────────────────────────────

export const registerUser = (payload: RegisterPayload) =>
  apiFetch<never>(API_ENDPOINTS.auth.register, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginUser = (payload: LoginPayload) =>
  apiFetch<LoginResponseData>(API_ENDPOINTS.auth.login, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
  });

export const sendVerificationEmail = (payload: VerifyEmailPayload) =>
  apiFetch<never>(API_ENDPOINTS.auth.verifyEmail, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const forgotPassword = (payload: ForgotPasswordPayload) =>
  apiFetch<never>(API_ENDPOINTS.auth.forgotPassword, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const resetPassword = (payload: ResetPasswordPayload) =>
  apiFetch<never>(API_ENDPOINTS.auth.resetPassword, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updatePassword = (payload: UpdatePasswordPayload) =>
  apiFetch<never>(API_ENDPOINTS.auth.updatePassword, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
  });

export const logoutUser = () =>
  apiFetch<never>(API_ENDPOINTS.auth.logout, {
    method: "POST",
    credentials: "include",
  });
