import React from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content wrapper with padding on desktop to offset fixed sidebar */}
      <div className="flex-1 flex flex-col lg:pl-[232px] min-h-screen">
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
