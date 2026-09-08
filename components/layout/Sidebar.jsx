"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  FilePlus,
  Folder,
  FileText,
  Copy,
  Gear,
  SidebarSimple,
} from "@phosphor-icons/react";
import { BrandMark } from "@/components/ui/BrandMark";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationGroups = [
  {
    title: "WORKSPACE",
    items: [
      { name: "Dashboard", href: "/", icon: SquaresFour },
      { name: "Create Document", href: "/create", icon: FilePlus, highlight: true },
      { name: "My Documents", href: "/documents", icon: Folder },
      { name: "Templates", href: "/templates", icon: Copy },
    ],
  },
  {
    title: "DATA & ASSETS",
    items: [
      { name: "Profile Data", href: "/profile-data", icon: FileText },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { name: "Settings", href: "/settings", icon: Gear },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="border-none bg-sidebar text-foreground select-none transition-[width] duration-280 ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      {/* Sidebar Header — 56px height (matching tenant-hub --topbar-height) */}
      <SidebarHeader className="h-14 flex flex-row items-center justify-between px-4 border-b-0 shrink-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <Link
          href="/"
          aria-label="Workspace home"
          className="flex items-center gap-2.5 min-w-0 group-data-[collapsible=icon]:hidden outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar rounded-[6px]"
        >
          <BrandMark />
          <span className="text-base font-medium leading-5 text-sidebar-foreground tracking-tight">
            DocBuilder
          </span>
        </Link>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
          title={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
          className="size-8 rounded-[6px] text-muted-foreground hover:text-foreground hover:bg-[#EEEEEE] dark:hover:bg-[#242424] transition-colors shrink-0 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring cursor-pointer"
        >
          <SidebarSimple
            size={19}
            className={`shrink-0 transition-transform duration-200 ${
              state === "collapsed" ? "rotate-180" : ""
            }`}
          />
        </button>
      </SidebarHeader>

      {/* Sidebar Content Navigation */}
      <SidebarContent className="px-3 py-2 space-y-3 overflow-y-auto scrollbar-none group-data-[collapsible=icon]:px-1.5">
        {navigationGroups.map((group, groupIdx) => (
          <SidebarGroup key={groupIdx} className="py-0 px-0">
            <SidebarGroupLabel className="text-[11px] font-medium text-muted-foreground tracking-[0.08em] uppercase px-3 py-1 group-data-[collapsible=icon]:hidden">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => {
                  // Strict preservation of active routing logic
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.name} className="flex justify-center">
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.name}
                        className={`relative h-9 text-sm leading-5 rounded-[6px] transition-colors duration-100 outline-none select-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar ${
                          isActive
                            ? "!bg-white !text-[#171717] font-medium shadow-card hover:!bg-white hover:!text-[#171717] dark:!bg-[#2B2B2B] dark:!text-[#FAFAFA] dark:shadow-none dark:hover:!bg-[#2B2B2B]"
                            : "font-normal text-[#525252] hover:bg-[#EEEEEE] hover:text-[#171717] dark:text-[#A3A3A3] dark:hover:bg-[#242424] dark:hover:text-[#FAFAFA]"
                        } group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center`}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 w-full px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
                        >
                          <Icon
                            size={18}
                            weight={isActive ? "fill" : "regular"}
                            className={`size-[18px] shrink-0 transition-colors ${
                              isActive
                                ? "text-[#171717] dark:text-[#FAFAFA]"
                                : "text-[#737373] group-hover:text-[#171717] dark:group-hover:text-[#FAFAFA]"
                            }`}
                          />
                          <span className="truncate group-data-[collapsible=icon]:hidden leading-normal py-0.5">
                            {item.name}
                          </span>

                          {/* Refined Pill Badge matching tenant-hub badge scale */}
                          {item.highlight && !isActive && (
                            <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 group-data-[collapsible=icon]:hidden shrink-0">
                              NEW
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
