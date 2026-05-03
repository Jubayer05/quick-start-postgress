import { API_ENDPOINTS } from "@/config/apiConfig";
import { apiFetch } from "@/lib/api-fetch";
import type { AdminStats, AdminUser } from "@/types/admin";

export async function adminListUsers(): Promise<AdminUser[]> {
  const res = await apiFetch<AdminUser[]>(API_ENDPOINTS.admin.users, {
    method: "GET",
    cache: "no-store",
  });
  return res.data ?? [];
}

export async function adminUpdateUserRole(
  userId: string,
  role: string,
): Promise<AdminUser> {
  const res = await apiFetch<AdminUser>(
    `${API_ENDPOINTS.admin.user(userId)}/role`,
    { method: "PATCH", body: JSON.stringify({ role }) },
  );
  if (!res.data) throw new Error(res.error ?? "Invalid response from server");
  return res.data;
}

export async function adminBanUser(userId: string): Promise<AdminUser> {
  const res = await apiFetch<AdminUser>(
    `${API_ENDPOINTS.admin.user(userId)}/ban`,
    { method: "POST" },
  );
  if (!res.data) throw new Error(res.error ?? "Invalid response from server");
  return res.data;
}

export async function adminUnbanUser(userId: string): Promise<AdminUser> {
  const res = await apiFetch<AdminUser>(
    `${API_ENDPOINTS.admin.user(userId)}/unban`,
    { method: "POST" },
  );
  if (!res.data) throw new Error(res.error ?? "Invalid response from server");
  return res.data;
}

export async function adminDeleteUser(userId: string): Promise<void> {
  await apiFetch<{ deleted: boolean }>(API_ENDPOINTS.admin.user(userId), {
    method: "DELETE",
  });
}

export async function adminGetStats(): Promise<AdminStats> {
  const res = await apiFetch<AdminStats>(API_ENDPOINTS.admin.stats, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.data) throw new Error(res.error ?? "Invalid response from server");
  return res.data;
}

