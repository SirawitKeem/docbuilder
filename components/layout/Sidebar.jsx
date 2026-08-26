"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileEdit,
  FilePlus2,
  FolderOpen,
  LayoutGrid,
  Clock,
  Settings,
  User,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationGroups = [
  {
    title: "WORKSPACE",
    items: [
      { name: "หน้าหลัก", href: "/", icon: LayoutGrid },
      { name: "สร้างเอกสาร", href: "/create", icon: FilePlus2, highlight: true },
      { name: "เอกสารของฉัน", href: "/documents", icon: FolderOpen },
      { name: "ตั้งค่าข้อมูลกลาง", href: "/profile-data", icon: FileEdit },
    ],
  },
  {
    title: "CATALOG",
    items: [
      { name: "เทมเพลต", href: "/templates", icon: LayoutGrid },
      { name: "ประวัติการส่ง", href: "/history", icon: Clock },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { name: "ตั้งค่า", href: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar collapsible="icon" className="border-r border-[#E4E4E8] bg-white text-[#18181B] select-none">
      {/* Sidebar Header */}
      <SidebarHeader className="h-16 flex items-center justify-center px-4 border-b-0 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 min-w-0 w-full group-data-[collapsible=icon]:justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo_ally.png"
            alt="Ally Logo"
            className="h-8 w-auto object-contain shrink-0"
          />
          <div className="relative inline-flex items-center group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-[#18181B] text-lg tracking-tight leading-none pr-0.5">
              DocBuilder
            </span>
            <Sparkles className="absolute -top-2.5 -right-2.5 w-3 h-3 text-[#7C4DFF] fill-[#7C4DFF] shrink-0 animate-pulse" />
          </div>
        </Link>
      </SidebarHeader>

      {/* Sidebar Content Navigation */}
      <SidebarContent className="px-3 py-2 space-y-3 overflow-y-auto scrollbar-none">
        {navigationGroups.map((group, groupIdx) => (
          <SidebarGroup key={groupIdx} className="py-0 px-0">
            <SidebarGroupLabel className="text-[10.5px] font-bold text-[#94949E] tracking-wider uppercase px-3 py-1 group-data-[collapsible=icon]:hidden">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.name} className="flex justify-center">
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.name}
                        className={`relative h-[38px] text-[13.5px] font-medium transition-all duration-150 overflow-hidden ${
                          isActive
                            ? "bg-[#F5F1FF] text-[#7C4DFF] font-semibold rounded-r-xl rounded-l-none"
                            : "text-[#52525B] hover:bg-[#F4F4F6] hover:text-[#18181B] rounded-xl"
                        } group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center`}
                      >
                        <Link href={item.href} className="flex items-center gap-3 w-full px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                          {/* Active Left Indicator Bar: Full edge height & flush left (Image 2 match) */}
                          {isActive && (
                            <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#7C4DFF]" />
                          )}
                          <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#7C4DFF]" : "text-[#71717A]"}`} />
                          <span className="truncate group-data-[collapsible=icon]:hidden leading-none">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>

                      {item.highlight && !isActive && (
                        <SidebarMenuBadge className="bg-[#F0EBFF] text-[#7C4DFF] font-semibold text-[10px] px-2 py-0.5 rounded-full group-data-[collapsible=icon]:hidden">
                          NEW
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Sidebar Footer User Card */}
      <SidebarFooter className="p-3 mt-auto border-t-0 shrink-0">
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2.5 p-2 rounded-2xl border border-[#E4E4E8] bg-white hover:bg-[#F4F4F6] transition-colors cursor-pointer w-full group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center shadow-2xs">
                  <div className="w-8 h-8 rounded-full bg-[#5C33CC] text-white font-bold flex items-center justify-center text-xs shrink-0">
                    K
                  </div>
                  <div className="grid flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-bold text-[#18181B] text-[13px]">Keem</span>
                    <span className="truncate text-[11px] text-[#71717A]">keem@example.com</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#71717A] group-data-[collapsible=icon]:hidden shrink-0" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                sideOffset={8}
                className="w-56 rounded-xl border border-[#E4E4E8] shadow-md bg-white text-[#18181B] z-50"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-[#18181B] leading-none">Keem</p>
                    <p className="text-xs text-[#71717A] leading-none">keem@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile-data")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4 text-[#71717A]" />
                  <span>ตั้งค่าข้อมูล</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4 text-[#71717A]" />
                  <span>ตั้งค่าระบบ</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/login")} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ออกจากระบบ</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Resize Rail */}
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
