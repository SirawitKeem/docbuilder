"use client";

import React from "react";
import { FileText, Send, Clock, TrendingUp, FileEdit } from "lucide-react";

const stats = [
  {
    title: "เอกสารทั้งหมดในระบบ",
    value: "142",
    unit: "ฉบับ",
    change: "+12.4%",
    trend: "up",
    subtext: "เปรียบเทียบกับเดือนที่แล้ว",
    icon: FileText,
    iconBg: "bg-primary/10 text-primary",
  },
  {
    title: "ส่งอนุมัติ/ส่งผู้รับแล้ว",
    value: "98",
    unit: "ฉบับ",
    change: "96%",
    trend: "up",
    subtext: "อัตราจัดส่งสำเร็จ",
    icon: Send,
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "เอกสารฉบับร่าง",
    value: "44",
    unit: "ฉบับ",
    change: "รอตรวจสอบ",
    trend: "neutral",
    subtext: "อยู่ระหว่างแก้ไขข้อมูล",
    icon: FileEdit,
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    title: "เวลาเฉลี่ยในการสร้าง",
    value: "2.4",
    unit: "นาที",
    change: "-18%",
    trend: "up",
    subtext: "รวดเร็วขึ้นกว่าเดิม",
    icon: Clock,
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-surface border border-border/80 rounded-2xl p-5 shadow-xs hover:border-primary/30 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.iconBg} transition-transform group-hover:scale-105`}>
                <Icon size={18} />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {stat.unit}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
              <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded-md">
                <TrendingUp size={11} /> {stat.change}
              </span>
              <span className="truncate">{stat.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
