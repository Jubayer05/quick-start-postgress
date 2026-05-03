import type { LucideIcon } from "lucide-react";

export interface NavbarMenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: LucideIcon;
  items?: NavbarMenuItem[];
}

export interface NavbarProps {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: NavbarMenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
  };
}
