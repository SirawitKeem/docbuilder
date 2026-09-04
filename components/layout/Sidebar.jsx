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
} from "lucide-react";

// 4-Point Diamond Sparkle Star (matches Login page design)
function SparkleStar({ className = "w-3.5 h-3.5 text-[#7C4DFF] fill-[#7C4DFF]" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
    </svg>
  );
}
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
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
            className="h-8.5 w-auto object-contain shrink-0 select-none"
          />
          <div className="relative inline-flex items-center group-data-[collapsible=icon]:hidden">
            <span className="font-extrabold text-[#18181B] text-[18px] tracking-tight leading-none pr-0.5 font-sans">
              DocBuilder
            </span>
            <span className="absolute -top-2.5 -right-3">
              <SparkleStar className="w-3.5 h-3.5 text-[#7C4DFF] fill-[#7C4DFF] shrink-0" />
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Sidebar Content Navigation */}
      <SidebarContent className="px-3 py-2 space-y-3.5 overflow-y-auto scrollbar-none">
        {navigationGroups.map((group, groupIdx) => (
          <SidebarGroup key={groupIdx} className="py-0 px-0">
            <SidebarGroupLabel className="text-[10px] font-bold text-[#9CA3AF] tracking-[0.14em] uppercase px-3 py-1.5 group-data-[collapsible=icon]:hidden">
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
                        className={`relative h-[40px] text-[13.5px] transition-all duration-150 overflow-hidden ${
                          isActive
                            ? "bg-[#F5F1FF] text-[#5542F6] font-bold rounded-r-xl rounded-l-none"
                            : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] font-medium rounded-xl"
                        } group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center`}
                      >
                        <Link href={item.href} className="flex items-center gap-3 w-full px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                          {/* Active Left Indicator Bar: 3.5px width with rounded right edge */}
                          {isActive && (
                            <span className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#5542F6] rounded-r-md" />
                          )}
                          <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? "text-[#5542F6]" : "text-[#6B7280]"}`} />
                          <span className="truncate group-data-[collapsible=icon]:hidden leading-none">{item.name}</span>

                          {/* NEW Badge: Pill shape with pure white inside & gradient border */}
                          {item.highlight && !isActive && (
                            <span className="ml-auto inline-flex items-center justify-center p-[1px] rounded-full bg-gradient-to-r from-[#60A5FA] via-[#818CF8] to-[#C084FC] group-data-[collapsible=icon]:hidden shrink-0 shadow-2xs">
                              <span className="px-2 py-0.5 rounded-full bg-white text-[9.5px] font-black text-[#5542F6] tracking-wider leading-none">
                                NEW
                              </span>
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
