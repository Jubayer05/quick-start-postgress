import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

type UserRole = "ADMIN" | "MODERATOR" | "USER";

function getRoleFromCookie(raw: string | undefined): UserRole | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));

    if (parsed && typeof parsed === "object" && "user" in parsed) {
      const wrapped = parsed as { user?: { role?: unknown } };
      const role = wrapped.user?.role;
      if (role === "ADMIN" || role === "MODERATOR" || role === "USER") {
        return role;
      }
      return null;
    }

    const flat = parsed as { role?: unknown };
    const role = flat.role;
    if (role === "ADMIN" || role === "MODERATOR" || role === "USER") {
      return role;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function DashboardLayout({
  children,
  admin,
  moderator,
  user,
}: {
  children: ReactNode;
  admin: ReactNode;
  moderator: ReactNode;
  user: ReactNode;
}) {
  const cookieStore = await cookies();
  const role = getRoleFromCookie(cookieStore.get("app-user")?.value);

  const roleSlot =
    role === "ADMIN" ? admin : role === "MODERATOR" ? moderator : user;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="">
        <SiteHeader />
        <div className="flex flex-1 flex-col">{roleSlot ?? children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
