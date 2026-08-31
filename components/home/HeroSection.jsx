"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Database, Sparkles } from "lucide-react";

// 4-Point Diamond Sparkle Star (matches Login & Brand style)
function SparkleStar({ className = "w-4 h-4 text-white fill-white" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
    </svg>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "สวัสดีตอนเช้า";
  if (hour >= 12 && hour < 17) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
}

function getThaiDate() {
  const date = new Date();
  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear() + 543}`;
}

export default function HeroSection({ userName }) {
  const [greeting, setGreeting] = useState("ยินดีต้อนรับกลับมา");
  const [thaiDate, setThaiDate] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(getGreeting());
    setThaiDate(getThaiDate());
  }, []);

  return (
    <section className="relative overflow-hidden rounded-[24px] bg-white border border-[#EAEAEF] p-7 sm:p-9 shadow-xs select-none">
      {/* Decorative Subtle Gradient Glow Backdrop on the right */}
      <div
        role="presentation"
        className="pointer-events-none absolute -right-12 -top-12 h-[320px] w-[320px] rounded-full blur-[65px] bg-[radial-gradient(circle,rgba(124,77,255,0.18)_0%,rgba(96,165,250,0.12)_45%,transparent_75%)]"
      />
      <div
        role="presentation"
        className="pointer-events-none absolute right-[18%] -bottom-16 h-[240px] w-[240px] rounded-full blur-[55px] bg-[radial-gradient(circle,rgba(192,132,252,0.15)_0%,rgba(124,77,255,0.08)_50%,transparent_75%)]"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Left Side: Content & Actions */}
        <div className="max-w-xl text-left">
          {/* Top Pill Badge: Greeting & Thai Date */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F1FF] border border-[#EBE3FF] text-[#5542F6] text-[12px] font-bold mb-3 shadow-2xs">
            <Sparkles size={13} className="text-[#5542F6] shrink-0" />
            <span>{greeting}</span>
            {thaiDate && (
              <>
                <span className="text-[#D4D4D8]">•</span>
                <span className="text-[#71717A] font-medium">{thaiDate}</span>
              </>
            )}
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-[30px] font-black tracking-tight text-gray-900 leading-tight mb-2.5 font-sans">
            {userName || "คุณ Keem"} 👋
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 font-normal">
            สร้างเอกสาร หนังสือสัญญา และใบเสนอราคาจากเทมเพลตได้อย่างรวดเร็ว
            <br className="hidden sm:inline" />
            กรอกข้อมูล ซิงค์ข้อมูลกลาง และส่งออก PDF พร้อมส่งอีเมลได้ทันที
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Main Action: Animated Gradient Button with ✦ SparkleStar */}
            <Link
              href="/create"
              className="animate-gradient-button inline-flex items-center gap-2 h-11 px-5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <SparkleStar className="w-4 h-4 text-white fill-white shrink-0" />
              <span className="text-white font-bold">สร้างเอกสารใหม่</span>
            </Link>

            {/* Secondary Action: Central Profile Data */}
            <Link
              href="/profile-data"
              className="inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-[#E4E4E8] bg-white hover:bg-[#F6F6FA] text-gray-700 font-bold text-sm shadow-2xs hover:border-[#D0D0D8] transition-all cursor-pointer"
            >
              <Database size={16} className="text-[#5542F6]" />
              <span>ตั้งค่าข้อมูลกลาง</span>
            </Link>
          </div>
        </div>

        {/* Right Side: 3D Document Stack & Digital Seal Graphic */}
        <div className="hidden lg:flex items-center justify-center relative w-[340px] xl:w-[380px] h-[210px] shrink-0 pointer-events-none select-none pr-4">
          {/* Back Card (Quotation Mockup) */}
          <div className="absolute w-[205px] h-[165px] bg-white/75 backdrop-blur-md rounded-2xl border border-purple-200/70 shadow-lg transform translate-x-6 -translate-y-2.5 rotate-[6deg] p-3.5 flex flex-col justify-between opacity-85">
            <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-md bg-blue-500/20 flex items-center justify-center">
                  <span className="text-[9px] font-black text-blue-600">CZ</span>
                </div>
                <span className="text-[10px] font-bold text-gray-700">QUOTATION</span>
              </div>
              <span className="text-[8px] font-medium text-gray-400">QT-2026-08</span>
            </div>
            <div className="space-y-1.5 py-1">
              <div className="h-1.5 w-3/4 bg-gray-200/80 rounded-full" />
              <div className="h-1.5 w-full bg-gray-200/60 rounded-full" />
              <div className="h-1.5 w-1/2 bg-gray-200/60 rounded-full" />
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
              <span className="text-[9px] font-semibold text-gray-400">Total</span>
              <span className="text-[10px] font-black text-blue-600">฿125,000</span>
            </div>
          </div>

          {/* Front Card (NDA Contract Mockup with Stamp) */}
          <div className="absolute w-[220px] h-[180px] bg-white/95 backdrop-blur-lg rounded-2xl border border-[#E9E4FC] shadow-xl transform -translate-x-3 translate-y-1 -rotate-[3deg] p-3.5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-[#F5F1FF] flex items-center justify-center border border-[#EBE3FF]">
                  <SparkleStar className="w-3 h-3 text-[#5542F6] fill-[#5542F6]" />
                </div>
                <span className="text-[11px] font-black text-gray-900 tracking-tight">NDA AGREEMENT</span>
              </div>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[8px] font-black border border-emerald-100">
                OFFICIAL
              </span>
            </div>

            {/* Skeleton Paragraph */}
            <div className="space-y-1.5 py-1.5">
              <div className="h-1.5 w-full bg-gradient-to-r from-purple-200/70 to-purple-100 rounded-full" />
              <div className="h-1.5 w-5/6 bg-purple-100/80 rounded-full" />
              <div className="h-1.5 w-4/5 bg-purple-100/60 rounded-full" />
              <div className="h-1.5 w-2/3 bg-purple-100/50 rounded-full" />
            </div>

            {/* Signature & Digital Stamp */}
            <div className="flex items-end justify-between pt-1.5 border-t border-purple-50">
              <div className="space-y-0.5">
                <div className="h-1 w-14 bg-gray-300 rounded-full" />
                <span className="text-[8px] text-gray-400 font-medium">Crest Zendo Co.</span>
              </div>

              {/* Official Digital Seal Badge */}
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-dashed border-[#7C4DFF] bg-[#F5F1FF] text-[#5542F6] shadow-2xs rotate-[-5deg]">
                <span className="text-[9px] font-black tracking-wider">SIGNED ✓</span>
              </div>
            </div>
          </div>

          {/* Floating Mini Badge 1: Top Right */}
          <div className="absolute -top-1 right-3 bg-white/95 backdrop-blur-md border border-[#EBE3FF] shadow-md px-2.5 py-0.5 rounded-full flex items-center gap-1.5 text-[10px] font-bold text-gray-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>4 Templates</span>
          </div>

          {/* Floating Mini Badge 2: Bottom Left */}
          <div className="absolute -bottom-1 left-2 bg-white/95 backdrop-blur-md border border-[#EBE3FF] shadow-md px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold text-[#5542F6]">
            <SparkleStar className="w-3 h-3 text-[#5542F6] fill-[#5542F6]" />
            <span>AI Ready</span>
          </div>

          {/* Floating Sparkle Stars */}
          <div className="absolute -top-2 left-6 text-[#7C4DFF] animate-pulse">
            <SparkleStar className="w-5 h-5 text-[#7C4DFF] fill-[#7C4DFF]" />
          </div>
          <div className="absolute bottom-5 right-1 text-[#A855F7] animate-pulse">
            <SparkleStar className="w-3.5 h-3.5 text-[#A855F7] fill-[#A855F7]" />
          </div>
          <div className="absolute top-1/2 -left-2 text-[#60A5FA] animate-pulse">
            <SparkleStar className="w-4 h-4 text-[#60A5FA] fill-[#60A5FA]" />
          </div>
        </div>
      </div>
    </section>
  );
}
