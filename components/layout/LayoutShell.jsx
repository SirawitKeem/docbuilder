"use client";

import React from "react";
import AppSidebar from "./Sidebar";
import { TopBar } from "./TopBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function LayoutShell({ children }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-h-screen bg-background text-foreground transition-colors duration-200">
          <TopBar />
          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
