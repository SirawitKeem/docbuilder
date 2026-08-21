"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FileEdit,
  FilePlus2,
  FolderOpen,
  LayoutGrid,
  Clock,
  Settings,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";

const navigation = [
  { name: "หน้าหลัก", href: "/", icon: LayoutDashboard },
  { name: "ตั้งค่าข้อมูล", href: "/profile-data", icon: FileEdit },
  { name: "สร้างเอกสาร", href: "/create", icon: FilePlus2 },
  { name: "เอกสารของฉัน", href: "/documents", icon: FolderOpen },
  { name: "เทมเพลต", href: "/templates", icon: LayoutGrid },
  { name: "ประวัติการส่ง", href: "/history", icon: Clock },
  { name: "ตั้งค่า", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, isMobileOpen, setIsMobileOpen } = useSidebar();

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#F3F3F5] border-b border-[#E4E4E8] lg:hidden sticky top-0 z-40 h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] flex items-center justify-center text-white">
            <FileText size={18} className="stroke-[2.5]" />
          </div>
          <span className="font-semibold text-[#22162B] tracking-tight text-base">DocBuilder</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-35 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop & Mobile Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#F3F3F5] border-r border-[#E4E4E8] transition-all duration-300 ease-in-out lg:translate-x-0",
          isCollapsed ? "lg:w-[72px]" : "lg:w-[232px]",
          "w-[232px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className={cn(
          "flex items-center border-b border-[#E4E4E8] h-16 transition-all duration-300 relative",
          isCollapsed ? "justify-center px-2" : "justify-between px-5"
        )}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] flex items-center justify-center text-white shadow-sm shrink-0">
              <FileText size={20} className="stroke-[2.5]" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate animate-in fade-in duration-200">
                <span className="font-semibold text-[#22162B] tracking-tight leading-none text-base truncate">DocBuilder</span>
                <span className="text-[10px] text-[#646469] font-medium mt-1 uppercase tracking-wider">WORKSPACE</span>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={cn(
              "hidden lg:flex items-center justify-center w-7 h-7 rounded-lg border border-[#E4E4E8] bg-white text-[#646469] hover:bg-[#F6F6FA] hover:text-[#22162B] transition-colors shadow-2xs shrink-0",
              isCollapsed ? "absolute -right-3.5 top-5 z-50 rounded-full border-gray-300" : ""
            )}
            title={isCollapsed ? "ขยายเมนู (Expand)" : "ย่อเมนู (Collapse)"}
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-150",
                    isCollapsed ? "justify-center px-0" : "",
                    isActive
                      ? "bg-[#F5F1FF] text-[#7C4DFF] font-semibold"
                      : "text-[#646469] hover:bg-[#E4E4E8]/50 hover:text-[#22162B]"
                  )}
                >
                  <Icon
                    size={19}
                    className={cn(
                      "transition-colors stroke-[2] shrink-0",
                      isActive ? "text-[#7C4DFF]" : "text-[#646469] group-hover:text-[#22162B]"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="truncate animate-in fade-in duration-150">{item.name}</span>
                  )}
                </Link>

                {/* Hover Tooltip when Collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-gray-900 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50">
                    {item.name}
                    {/* Tooltip Arrow */}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-[#E4E4E8] bg-[#F3F3F5]">
          <div className={cn(
            "flex items-center gap-3 py-1.5 relative group",
            isCollapsed ? "justify-center px-0" : "px-2"
          )}>
            <div className="w-9 h-9 rounded-full bg-[#F5F1FF] text-[#7C4DFF] flex items-center justify-center font-semibold text-sm shrink-0">
              K
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in duration-150">
                <p className="text-sm font-semibold text-[#22162B] truncate">Keem</p>
                <p className="text-xs text-[#646469] truncate">keem@example.com</p>
              </div>
            )}
            {!isCollapsed && (
              <button
                className="p-1.5 rounded-[10px] text-[#646469] hover:bg-[#E4E4E8] hover:text-[#22162B] transition-colors shrink-0"
                aria-label="Log out"
                title="ออกจากระบบ"
              >
                <LogOut size={16} className="stroke-[2]" />
              </button>
            )}

            {/* Hover Tooltip for Profile when Collapsed */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50 space-y-0.5">
                <p className="font-semibold">Keem</p>
                <p className="text-[10px] text-gray-300">keem@example.com</p>
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
