import {
  Activity,
  FileText,
  LayoutDashboard,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";

export type SidebarMenuItem = {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  items?: {
    title: string;
    url: string;
    icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  }[];
};

export const adminSidebarMenu: SidebarMenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    items: [
      { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
      { title: "Analytics", url: "/dashboard/admin/analytics", icon: Activity },
    ],
  },
  {
    title: "Admin",
    url: "/dashboard/admin",
    icon: Shield,
    items: [
      { title: "Users", url: "/dashboard/admin/users", icon: Users },
      { title: "Stats", url: "/dashboard/admin/stats", icon: Activity },
      { title: "Activity", url: "/dashboard/admin/activity", icon: Activity },
    ],
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export const moderatorSidebarMenu: SidebarMenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Moderation",
    url: "/dashboard/moderator",
    icon: Activity,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
];

export const userSidebarMenu: SidebarMenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    items: [
      { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
      { title: "Documents", url: "/dashboard/documents", icon: FileText },
    ],
  },
  {
    title: "Documents",
    url: "/dashboard/documents",
    icon: FileText,
    items: [
      { title: "All documents", url: "/dashboard/documents", icon: FileText },
      {
        title: "Shared with me",
        url: "/dashboard/documents/shared",
        icon: Users,
      },
    ],
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Team",
    url: "/dashboard/team",
    icon: Users,
  },
];
