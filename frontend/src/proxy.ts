import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE_NAME = "app-user";

// Routes that require authentication
const PROTECTED_PATHS = ["/dashboard"];

// Routes that logged-in users should not see (auth pages)
const AUTH_PATHS = ["/auth/login", "/auth/register"];

function getUserFromRequest(request: NextRequest): {
  role: string | null;
  isLoggedIn: boolean;
} {
  const raw = request.cookies.get(COOKIE_NAME)?.value;
  if (!raw) return { role: null, isLoggedIn: false };

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));

    if (
      parsed &&
      typeof parsed === "object" &&
      "user" in parsed &&
      "sessionExpiresAt" in parsed
    ) {
      const wrapped = parsed as {
        user?: { role?: string };
        sessionExpiresAt?: string;
      };
      const exp = wrapped.sessionExpiresAt;
      if (
        typeof exp === "string" &&
        !Number.isNaN(Date.parse(exp)) &&
        Date.parse(exp) <= Date.now()
      ) {
        return { role: null, isLoggedIn: false };
      }
      const role =
        typeof wrapped.user?.role === "string" ? wrapped.user.role : null;
      return { role, isLoggedIn: !!role };
    }

    // Legacy flat user JSON
    const flat = parsed as { role?: string };
    const role = typeof flat?.role === "string" ? flat.role : null;
    return { role, isLoggedIn: !!role };
  } catch {
    return { role: null, isLoggedIn: false };
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { isLoggedIn } = getUserFromRequest(request);

  // ── Protect dashboard / role sub-routes ──────────────────────────────────
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", request.url);
    // Preserve the intended destination so we can redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect logged-in users away from auth pages ────────────────────────
  const isAuthPage = AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
