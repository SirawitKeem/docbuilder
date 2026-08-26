"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  Moon,
  Sun,
  Bell,
  FileText,
  Plus,
  FolderOpen,
  LayoutGrid,
  Settings,
  LogOut,
  User,
  Clock,
  CheckCircle2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

export function TopBar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openCommand, setOpenCommand] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "สร้างใบเสนอราคา CZ2608063 สำเร็จ",
      time: "10 นาทีที่แล้ว",
      unread: true,
      icon: FileText,
      iconColor: "text-primary",
    },
    {
      id: 2,
      title: "Partner Agreement ถูกส่งทางอีเมลแล้ว",
      time: "1 ชั่วโมงที่แล้ว",
      unread: true,
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: 3,
      title: "อัปเดตระบบเทมเพลตเวอร์ชันใหม่ 2.0",
      time: "เมื่อวานนี้",
      unread: false,
      icon: Sparkles,
      iconColor: "text-muted-foreground",
    },
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCommand((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const handleSelectRoute = (path) => {
    setOpenCommand(false);
    router.push(path);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <>
      <header className="flex h-16 w-full items-center justify-between border-b border-border bg-surface px-4 sm:px-6 select-none shrink-0 transition-colors">
        {/* Left Side: Sidebar Trigger & Search Bar */}
        <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-xl">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" />

          {/* Quick Search Button / Input (Cmd+K NextAdmin Style) */}
          <button
            onClick={() => setOpenCommand(true)}
            className="flex items-center justify-between w-full max-w-xs sm:max-w-sm h-9.5 px-3.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 text-muted-foreground text-xs font-medium transition-colors shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <Search size={15} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              <span>Search pages...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold bg-background border border-border rounded text-muted-foreground shadow-2xs">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Side: Real Dark Mode Toggle, Notifications, Avatar User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real Dark Mode Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center shadow-2xs"
            title={mounted && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {mounted && theme === "dark" ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} />
            )}
          </button>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative h-9 w-9 rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center shadow-2xs"
                title="การแจ้งเตือน"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive ring-2 ring-surface animate-pulse" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-80 p-0 shadow-md border border-border bg-surface z-50 rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
                <DropdownMenuLabel className="p-0 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  การแจ้งเตือน
                </DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-normal border-primary/30 text-primary">
                    {unreadCount} ใหม่
                  </Badge>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] text-muted-foreground hover:text-foreground font-medium underline"
                    >
                      อ่านทั้งหมด
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-border/60 bg-surface">
                {notifications.map((n) => {
                  const ItemIcon = n.icon;
                  return (
                    <div
                      key={n.id}
                      onClick={() => toggleNotificationRead(n.id)}
                      className={`p-3 text-xs transition-colors hover:bg-muted/60 cursor-pointer flex items-start gap-2.5 ${
                        n.unread ? "bg-primary/5 font-medium" : "text-muted-foreground"
                      }`}
                    >
                      <ItemIcon size={16} className={`shrink-0 mt-0.5 ${n.iconColor}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-foreground leading-snug">{n.title}</p>
                          {n.unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock size={11} /> {n.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-2 border-t border-border text-center bg-muted/20">
                <Button variant="ghost" size="sm" className="w-full text-xs text-primary h-7">
                  ดูการแจ้งเตือนทั้งหมด
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Avatar with Name & Chevron Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-lg hover:bg-muted/60 transition-colors outline-none cursor-pointer group">
                <Avatar className="h-8 w-8 ring-1 ring-border shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                    K
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block text-xs font-semibold text-foreground tracking-tight">
                  Keem
                </span>
                <ChevronDown size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-56 shadow-md border border-border bg-surface z-50 rounded-xl">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-foreground leading-none">Keem</p>
                  <p className="text-xs text-muted-foreground leading-none">keem@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSelectRoute("/profile-data")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>ตั้งค่าโปรไฟล์</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSelectRoute("/documents")} className="cursor-pointer">
                <FolderOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>เอกสารของฉัน</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSelectRoute("/settings")} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>ตั้งค่าระบบ</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSelectRoute("/login")} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>ออกจากระบบ</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Command Search Dialog (Cmd+K) */}
      <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
        <CommandInput placeholder="พิมพ์คำค้นหาเอกสาร, เมนู, หรือเทมเพลต..." />
        <CommandList>
          <CommandEmpty>ไม่พบข้อมูลที่ค้นหา</CommandEmpty>
          <CommandGroup heading="เมนูระบบ">
            <CommandItem onSelect={() => handleSelectRoute("/")}>
              <FileText className="mr-2 h-4 w-4 text-primary" />
              <span>หน้าหลัก (Dashboard)</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelectRoute("/create")}>
              <Plus className="mr-2 h-4 w-4 text-primary" />
              <span>สร้างเอกสารใหม่</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelectRoute("/documents")}>
              <FolderOpen className="mr-2 h-4 w-4 text-primary" />
              <span>เอกสารของฉัน</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelectRoute("/templates")}>
              <LayoutGrid className="mr-2 h-4 w-4 text-primary" />
              <span>คลังเทมเพลตทั้งหมด</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="สร้างเอกสารด่วน">
            <CommandItem onSelect={() => handleSelectRoute("/create/quotation")}>
              <FileText className="mr-2 h-4 w-4 text-primary" />
              <span>ใบเสนอราคา (Quotation)</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelectRoute("/create/partner")}>
              <FileText className="mr-2 h-4 w-4 text-primary" />
              <span>สัญญาแต่งตั้งพันธมิตร (Partner Agreement)</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelectRoute("/create/nda")}>
              <FileText className="mr-2 h-4 w-4 text-primary" />
              <span>สัญญาไม่เปิดเผยข้อมูล (NDA)</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
