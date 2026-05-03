import { API_ENDPOINTS } from "@/config/apiConfig";
import { apiFetch } from "@/lib/api-fetch";
import type { UserProfile, UserSession } from "@/types/user";

export async function getMe(): Promise<UserProfile> {
  const res = await apiFetch<UserProfile>(API_ENDPOINTS.user.me, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.data) throw new Error(res.error ?? "Invalid response from server");
  return res.data;
}

export async function updateMe(payload: { name?: string }): Promise<UserProfile> {
  const res = await apiFetch<UserProfile>(API_ENDPOINTS.user.updateMe, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.data) throw new Error(res.error ?? "Invalid response from server");
  return res.data;
}

export async function uploadMyAvatar(file: File): Promise<UserProfile> {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch(API_ENDPOINTS.user.avatar, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const text = await response.text();
  const json = text ? (JSON.parse(text) as { data?: UserProfile; message?: string }) : {};

  if (!response.ok) {
    throw new Error(json.message ?? "Upload failed");
  }
  if (!json.data) throw new Error("Invalid response from server");
  return json.data;
}

export async function getMySessions(): Promise<UserSession[]> {
  const res = await apiFetch<UserSession[]>(API_ENDPOINTS.user.sessions, {
    method: "GET",
    cache: "no-store",
  });
  return res.data ?? [];
}

export async function deleteMyAccount(): Promise<void> {
  await apiFetch<{ deleted: boolean }>(API_ENDPOINTS.user.deleteMe, {
    method: "DELETE",
  });
}

