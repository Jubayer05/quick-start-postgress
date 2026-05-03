"use client";

import { API_ENDPOINTS } from "@/config/apiConfig";
import type { AuthUser } from "@/types/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

/** How often to confirm the server session is still valid (legacy cookies / early revocation). */
const SESSION_VALIDATE_INTERVAL_MS = 90_000;

interface AuthContextValue {
  user: AuthUser | null;
  /** Second arg: Better Auth session.expiresAt — cookie Expires header matches this instant (no max-age drift). */
  setAuth: (user: AuthUser, sessionExpiresAt?: string | number | null) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const COOKIE_NAME = "app-user";

/** Fallback Max-Age when API does not return session.expiresAt (seconds). */
const DEFAULT_MAX_AGE_SEC = 60 * 60 * 24 * 7;

interface StoredAuthPayload {
  user: AuthUser;
  /** ISO time when the Better Auth session ends; null for legacy flat cookies (browser Max-Age only). */
  sessionExpiresAt: string | null;
}

function isExpired(iso: string): boolean {
  const t = Date.parse(iso);
  return Number.isNaN(t) || t <= Date.now();
}

function parseJsonCookieValue(raw: string): unknown | null {
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}

function parseStoredCookie(raw: string): StoredAuthPayload | null {
  try {
    const parsed: unknown = parseJsonCookieValue(raw);
    if (!parsed) return null;

    // New shape: { user, sessionExpiresAt }
    if (
      parsed &&
      typeof parsed === "object" &&
      "user" in parsed &&
      "sessionExpiresAt" in parsed
    ) {
      const p = parsed as StoredAuthPayload;
      if (!p.user?.id || typeof p.sessionExpiresAt !== "string") return null;
      if (isExpired(p.sessionExpiresAt)) return null;
      return p;
    }

    // Legacy flat AuthUser — no embedded expiry; rely on cookie Max-Age only (no client timer).
    if (
      parsed &&
      typeof parsed === "object" &&
      "id" in parsed &&
      "role" in parsed &&
      !("user" in parsed)
    ) {
      return { user: parsed as AuthUser, sessionExpiresAt: null };
    }

    return null;
  } catch {
    return null;
  }
}

function readStoredAuth(): StoredAuthPayload | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  const raw = match.split("=").slice(1).join("=") ?? "";
  const stored = parseStoredCookie(raw);
  if (!stored) {
    try {
      const parsed: unknown = parseJsonCookieValue(raw);
      if (
        parsed &&
        typeof parsed === "object" &&
        "sessionExpiresAt" in parsed &&
        typeof (parsed as { sessionExpiresAt: unknown }).sessionExpiresAt ===
          "string" &&
        isExpired((parsed as { sessionExpiresAt: string }).sessionExpiresAt)
      ) {
        deleteUserCookie();
      }
    } catch {
      /* ignore */
    }
    return null;
  }
  return stored;
}

/**
 * Map login/session payloads to an absolute end time. Handles ISO strings and unix
 * timestamps (ms or sec) so Expires matches Better Auth regardless of serialization.
 */
function normalizeSessionEndToDate(
  input: string | number | null | undefined,
): Date | null {
  if (input == null) return null;
  if (typeof input === "number" && Number.isFinite(input)) {
    const ms = input < 1_000_000_000_000 ? input * 1000 : input;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof input === "string") {
    const t = Date.parse(input);
    if (Number.isNaN(t)) return null;
    return new Date(t);
  }
  return null;
}

function writeUserCookie(
  user: AuthUser,
  sessionExpiresAt: string | number | null | undefined,
) {
  const fromServer = normalizeSessionEndToDate(
    sessionExpiresAt === undefined ? null : sessionExpiresAt,
  );
  const end = fromServer ?? new Date(Date.now() + DEFAULT_MAX_AGE_SEC * 1000);

  if (end.getTime() <= Date.now()) {
    deleteUserCookie();
    return;
  }

  const expiresAtIso = end.toISOString();
  const payload: StoredAuthPayload = {
    user,
    sessionExpiresAt: expiresAtIso,
  };
  const value = encodeURIComponent(JSON.stringify(payload));
  const msLeft = end.getTime() - Date.now();
  const maxAgeSec = Math.max(1, Math.ceil(msLeft / 1000));
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${COOKIE_NAME}=${value}; path=/; Expires=${end.toUTCString()}; max-age=${maxAgeSec}; SameSite=Lax${secure ? "; Secure" : ""}`;
}

function deleteUserCookie() {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secure ? "; Secure" : ""}; SameSite=Lax`;
}

// ---------------------------------------------------------------------------
// External store
// ---------------------------------------------------------------------------
const listeners = new Set<() => void>();
let _user: AuthUser | null = null;
let sessionExpiryTimer: ReturnType<typeof setTimeout> | null = null;

function clearSessionExpiryTimer() {
  if (sessionExpiryTimer !== null) {
    clearTimeout(sessionExpiryTimer);
    sessionExpiryTimer = null;
  }
}

type SessionEndReason = "logout" | "expired";

function clearClientAuthState(reason: SessionEndReason) {
  clearSessionExpiryTimer();
  deleteUserCookie();
  _user = null;
  notifyListeners();
  if (reason === "expired" && typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("app:session-expired"));
  }
}

function scheduleSessionExpiry(sessionExpiresAt: string | null | undefined) {
  clearSessionExpiryTimer();
  if (!sessionExpiresAt || Number.isNaN(Date.parse(sessionExpiresAt))) return;
  const ms = Date.parse(sessionExpiresAt) - Date.now();
  if (ms <= 0) {
    clearClientAuthState("expired");
    return;
  }
  sessionExpiryTimer = setTimeout(() => {
    sessionExpiryTimer = null;
    clearClientAuthState("expired");
  }, ms);
}

async function validateSessionWithServer(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const res = await fetch(API_ENDPOINTS.profile.get, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) {
      clearClientAuthState("expired");
    }
  } catch {
    // Network errors: keep local session; next poll or navigation may recover.
  }
}

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getServerSnapshot(): null {
  return null;
}

function getClientSnapshot(): AuthUser | null {
  return _user;
}

// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = readStoredAuth();
    _user = stored?.user ?? null;
    if (stored?.sessionExpiresAt) {
      scheduleSessionExpiry(stored.sessionExpiresAt);
    }
    notifyListeners();
    if (_user) {
      void validateSessionWithServer();
    }
  }, []);

  const user = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (!user) return;

    const tick = () => {
      void validateSessionWithServer();
    };

    const id = window.setInterval(tick, SESSION_VALIDATE_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [user]);

  const setAuth = useCallback(
    (newUser: AuthUser, sessionExpiresAt?: string | number | null) => {
      _user = newUser;
      const sync = () => {
        writeUserCookie(newUser, sessionExpiresAt ?? null);
        const stored = readStoredAuth();
        scheduleSessionExpiry(stored?.sessionExpiresAt ?? null);
        notifyListeners();
      };
      queueMicrotask(sync);
    },
    [],
  );

  const clearAuth = useCallback(() => {
    clearClientAuthState("logout");
  }, []);

  return (
    <AuthContext.Provider value={{ user, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
