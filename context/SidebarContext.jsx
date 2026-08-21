"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext({
  isCollapsed: false,
  setIsCollapsed: () => {},
  toggleSidebar: () => {},
  isMobileOpen: false,
  setIsMobileOpen: () => {},
});

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Read initial collapsed state from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("docbuilder_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("docbuilder_sidebar_collapsed", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        toggleSidebar,
        isMobileOpen,
        setIsMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
