"use client";

import React from "react";
import Sidebar from "./Sidebar";

export default function LayoutShell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col lg:pl-[232px] min-h-screen">
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
