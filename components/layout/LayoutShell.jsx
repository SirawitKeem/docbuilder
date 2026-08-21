"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";

function LayoutContent({ children }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content wrapper with smooth transition */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:pl-[72px]" : "lg:pl-[232px]"
        )}
      >
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function LayoutShell({ children }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
