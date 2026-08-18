"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 lg:hidden sticky top-0 z-40 h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary-500 flex items-center justify-center text-white">
            <FileText size={18} className="stroke-[2.5]" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight text-base">DocBuilder</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-35 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex flex-col w-sidebar bg-white border-r border-gray-200 transition-transform duration-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center gap-2 px-6 h-16 border-b border-gray-100">
          <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-white">
            <FileText size={20} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 tracking-tight leading-none text-base">DocBuilder</span>
            <span className="text-[10px] text-gray-500 font-medium mt-1">ระบบจัดการเอกสาร</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "transition-colors stroke-[2]",
                    isActive ? "text-primary-600" : "text-gray-500 group-hover:text-gray-900"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold text-sm">
              K
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Keem</p>
              <p className="text-xs text-gray-500 truncate">keem@example.com</p>
            </div>
            <button
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
              aria-label="Log out"
            >
              <LogOut size={16} className="stroke-[2]" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
