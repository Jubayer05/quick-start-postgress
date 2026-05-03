/**
 * Use same-origin API paths by default so auth/session cookies stay first-party
 * in production deployments (e.g. Vercel), avoiding cross-site cookie drops.
 */
const isBrowser = typeof window !== "undefined";
const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const backendOrigin = (
  process.env.BACKEND_URL ?? "http://localhost:5000"
).replace(/\/$/, "");

function resolveServerBaseUrl(): string {
  if (!configuredApiUrl) return `${backendOrigin}/api/v1`;
  if (/^https?:\/\//i.test(configuredApiUrl)) {
    return configuredApiUrl.replace(/\/$/, "");
  }
  if (configuredApiUrl.startsWith("/")) {
    return `${backendOrigin}${configuredApiUrl}`;
  }
  return `${backendOrigin}/${configuredApiUrl}`;
}

const BASE_URL = isBrowser ? "/api/v1" : resolveServerBaseUrl();
const AUTH_BASE_URL = BASE_URL.replace(/\/api\/v1$/, "/api/auth");

export function withQuery(
  base: string,
  params: Record<string, string | number | null | undefined>,
): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || String(v).trim() === "") continue;
    q.set(k, String(v));
  }
  const qs = q.toString();
  return qs ? `${base}?${qs}` : base;
}

export const API_ENDPOINTS = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    verifyEmail: `${BASE_URL}/auth/verify-email`,
    verifyEmailToken: (token: string, callbackURL: string) =>
      withQuery(`${AUTH_BASE_URL}/verify-email`, { token, callbackURL }),
    forgotPassword: `${BASE_URL}/auth/forgot-password`,
    resetPassword: `${BASE_URL}/auth/reset-password`,
    updatePassword: `${BASE_URL}/auth/update-password`,
    logout: `${BASE_URL}/auth/logout`,
  },
  profile: {
    get: `${BASE_URL}/profile`,
    update: `${BASE_URL}/profile`,
  },
  user: {
    me: `${BASE_URL}/users/me`,
    updateMe: `${BASE_URL}/users/me`,
    deleteMe: `${BASE_URL}/users/me`,
    avatar: `${BASE_URL}/users/avatar`,
    sessions: `${BASE_URL}/users/sessions`,
  },
  upload: {
    single: `${BASE_URL}/upload/single`,
  },
  reviews: {
    create: `${BASE_URL}/reviews`,
    byId: (id: string) => `${BASE_URL}/reviews/${encodeURIComponent(id)}`,
    adminDelete: (id: string) =>
      `${BASE_URL}/admin/reviews/${encodeURIComponent(id)}`,
  },
  admin: {
    users: `${BASE_URL}/admin/users`,
    user: (id: string) => `${BASE_URL}/admin/users/${encodeURIComponent(id)}`,
    bookings: `${BASE_URL}/admin/bookings`,
    stats: `${BASE_URL}/admin/stats`,
  },
} as const;
