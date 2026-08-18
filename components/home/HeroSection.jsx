import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function HeroSection({ userName }) {
  return (
    <section className="relative overflow-hidden rounded-card bg-white border border-gray-200 px-8 py-10 mb-8 shadow-card">
      <div className="relative z-10 max-w-lg">
        <h1 className="text-[28px] leading-tight font-bold text-gray-900 mb-2">
          ยินดีต้อนรับ, {userName}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          สร้างเอกสารจากเทมเพลตของคุณได้อย่างรวดเร็ว
          <br />
          กรอกข้อมูล ตรวจสอบ และส่งออกหรือส่งให้ผู้รับได้ทันที
        </p>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 h-11 px-5 rounded bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-colors shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          สร้างเอกสารใหม่
        </Link>
      </div>

      {/* Decorative illustration box on the right */}
      <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 w-56 h-56 opacity-90 pointer-events-none">
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100" />
      </div>
    </section>
  );
}
