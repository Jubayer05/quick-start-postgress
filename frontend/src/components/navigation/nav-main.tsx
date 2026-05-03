"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const sectionHeaderIconClass =
  "shrink-0 text-[color:var(--app-sidebar-nav)] transition-all duration-300 ease-out [&>svg]:size-4.5 group-data-[collapsible=icon]:[&>svg]:!size-[1.125rem]";
const navLabelClass =
  "text-[color:var(--app-sidebar-nav)] max-w-[12rem] overflow-hidden whitespace-nowrap font-semibold transition-[max-width,opacity,transform] duration-300 ease-out group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:-translate-x-2 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:!hidden";
const subNavLabelClass =
  "text-sm font-medium text-[color:var(--app-sidebar-nav)] transition-all duration-200 ease-out";
const subNavIconClass =
  "inline-block shrink-0 text-[color:var(--app-sidebar-nav)] transition-all duration-200 ease-out [&>svg]:size-4.5";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: React.ReactNode;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu className="gap-1 group-data-[collapsible=icon]:gap-2">
        {items.map((item) => {
          const hasChildren = (item.items?.length ?? 0) > 0;

          if (!hasChildren) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className="h-11 gap-3 px-4 py-2.5 text-[color:var(--app-sidebar-nav)] [&>svg]:size-5"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    {item.icon ? (
                      <span className={sectionHeaderIconClass} aria-hidden>
                        {item.icon}
                      </span>
                    ) : null}
                    <span className={navLabelClass}>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="h-11 gap-3 px-4 py-2.5 text-[color:var(--app-sidebar-nav)] [&>svg]:size-5"
                  >
                    {item.icon ? (
                      <span className={sectionHeaderIconClass} aria-hidden>
                        {item.icon}
                      </span>
                    ) : null}
                    <span className={navLabelClass}>{item.title}</span>
                    <ChevronRightIcon className="ml-auto h-4 w-4 text-[color:var(--app-sidebar-nav)] transition-all duration-200 ease-out group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="mt-1 gap-1 py-0.5">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title} className="px-3">
                        <SidebarMenuSubButton
                          asChild
                          className="text-[color:var(--app-sidebar-nav)] data-[active=true]:text-[color:var(--app-sidebar-nav)]"
                        >
                          <Link
                            href={subItem.url}
                            className="flex items-center gap-2.5 text-[color:var(--app-sidebar-nav)]"
                          >
                            {subItem.icon ? (
                              <span className={subNavIconClass} aria-hidden>
                                {subItem.icon}
                              </span>
                            ) : null}
                            <span className={subNavLabelClass}>
                              {subItem.title}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
