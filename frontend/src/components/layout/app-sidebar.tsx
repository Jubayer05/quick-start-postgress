"use client";

import { NavMain } from "@/components/navigation/nav-main";
import { Logo } from "@/components/shared/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  adminSidebarMenu,
  moderatorSidebarMenu,
  userSidebarMenu,
  type SidebarMenuItem as SidebarMenuConfigItem,
} from "@/const/sidebar-menus";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/services/auth";
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

const dropdownInkClass =
  "text-[color:var(--app-sidebar-nav)] [&_svg]:text-[color:var(--app-sidebar-nav)]";
const dropdownMenuItemClass = cn(
  "font-semibold",
  dropdownInkClass,
  "focus:text-[color:var(--app-sidebar-nav)] data-[highlighted]:text-[color:var(--app-sidebar-nav)] data-[highlighted]:focus:text-[color:var(--app-sidebar-nav)]",
);

const sectionHeaderIconClass =
  "size-5 shrink-0 text-[color:var(--app-sidebar-nav)] transition-all duration-300 ease-out group-data-[collapsible=icon]:!size-[1.375rem]";
const collapsedNavButtonClass =
  "group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!w-10 group-data-[collapsible=icon]:!min-h-10 group-data-[collapsible=icon]:!min-w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!gap-0 group-data-[collapsible=icon]:!p-1.5";
const collapsedLinkRowClass =
  "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0";
const subNavLabelClass =
  "text-sm font-medium text-[color:var(--app-sidebar-nav)] transition-all duration-200 ease-out";

export function AppSidebar({
  className,
  style,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuth();
  const { isMobile } = useSidebar();

  const navItems = useMemo(() => {
    const role = user?.role;
    const base =
      role === "ADMIN"
        ? adminSidebarMenu
        : role === "MODERATOR"
          ? moderatorSidebarMenu
          : userSidebarMenu;

    const isActiveFor = (item: SidebarMenuConfigItem) => {
      if (pathname === item.url) return true;
      if (pathname.startsWith(item.url + "/")) return true;
      return (
        item.items?.some(
          (sub) => pathname === sub.url || pathname.startsWith(sub.url + "/"),
        ) ?? false
      );
    };

    return base.map((item) => ({
      title: item.title,
      url: item.url,
      icon: item.icon ? <item.icon aria-hidden /> : undefined,
      isActive: isActiveFor(item),
      items: item.items?.map((sub) => ({
        title: sub.title,
        url: sub.url,
        icon: sub.icon ? <sub.icon aria-hidden /> : undefined,
      })),
    }));
  }, [pathname, user?.role]);

  const getUserName = () => user?.name ?? user?.email?.split("@")[0] ?? "User";
  const getUserInitials = () => {
    const name = getUserName().trim();
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2)
      return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    if (parts[0]?.[0]) return parts[0][0].toUpperCase();
    if (user?.email?.[0]) return user.email[0].toUpperCase();
    return "U";
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      clearAuth();
      router.push("/auth/login");
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className={cn(
        "[font-family:var(--font-sans)]",
        "[&_[data-slot=sidebar-inner]]:bg-sidebar",
        className,
      )}
      style={
        {
          ...(style ?? {}),
          "--app-sidebar-nav":
            "var(--admin-sidebar-nav, var(--sidebar-foreground))",
        } as React.CSSProperties
      }
      {...props}
    >
      <SidebarHeader className="px-3 py-3 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className={cn(
                "h-9 gap-3 px-4 py-3 data-[slot=sidebar-menu-button]:!p-0",
                collapsedNavButtonClass,
                "group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!min-h-10",
              )}
            >
              <Logo
                href="/"
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                alt="Quick Start"
                title="Quick Start"
                className={cn(
                  "flex items-center px-4",
                  "transition-transform duration-300 ease-out group-data-[collapsible=icon]:scale-110",
                  collapsedLinkRowClass,
                )}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <div className="group-data-[collapsible=icon]:p-1.5">
          <NavMain items={navItems} />
          <SidebarMenu className="mt-1 gap-1 group-data-[collapsible=icon]:gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="More"
                className={cn(
                  "h-11 gap-3 px-4 py-2.5 text-[color:var(--app-sidebar-nav)] [&>svg]:size-5",
                  collapsedNavButtonClass,
                )}
                onClick={() => router.push("/")}
              >
                <ChevronRight className={sectionHeaderIconClass} aria-hidden />
                <span className={subNavLabelClass}>More</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:p-1.5">
        <SidebarMenu className="gap-1 group-data-[collapsible=icon]:gap-2">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={cn(
                    "h-12 gap-3 px-4 py-3 text-[color:var(--app-sidebar-nav)] data-[state=open]:bg-sidebar-accent data-[state=open]:text-[color:var(--app-sidebar-nav)]",
                    collapsedNavButtonClass,
                    "group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!min-h-10",
                  )}
                >
                  <Avatar className="h-8 w-8 rounded-lg transition-all duration-300 ease-out group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9">
                    <AvatarImage
                      alt={getUserName()}
                      src={user?.image ?? undefined}
                    />
                    <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid min-w-0 flex-1 overflow-hidden text-left text-sm leading-tight transition-[max-width,opacity,transform] duration-300 ease-out max-w-[12rem] group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-[color:var(--app-sidebar-nav)]">
                      {getUserName()}
                    </span>
                    <span className="truncate text-xs text-[color:var(--app-sidebar-nav)]">
                      {user?.email || ""}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 shrink-0 text-[color:var(--app-sidebar-nav)] transition-opacity duration-200 ease-out group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className={cn(
                  "w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg",
                  dropdownInkClass,
                  "[&_[data-slot=dropdown-menu-item]]:font-semibold",
                )}
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div
                    className={cn(
                      "flex items-center gap-2 px-1 py-1.5 text-left text-sm",
                      dropdownInkClass,
                    )}
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        alt={getUserName()}
                        src={user?.image ?? undefined}
                      />
                      <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-[color:var(--app-sidebar-nav)]">
                        {getUserName()}
                      </span>
                      <span className="truncate text-xs text-[color:var(--app-sidebar-nav)]">
                        {user?.email || ""}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className={dropdownMenuItemClass}
                    onClick={() => router.push("/dashboard/profile")}
                  >
                    <User />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={dropdownMenuItemClass}
                    onClick={() => router.push("/dashboard/settings")}
                  >
                    <Settings />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className={dropdownMenuItemClass}>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem className={dropdownMenuItemClass}>
                    <CreditCard />
                    Role: {user?.role ?? "—"}
                  </DropdownMenuItem>
                  <DropdownMenuItem className={dropdownMenuItemClass}>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={dropdownMenuItemClass}
                  onClick={handleLogout}
                >
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
