import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function HeroSection({ userName }) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 px-8 py-10 mb-8 shadow-card bg-contain bg-right bg-no-repeat"
      style={{ backgroundColor: '#f9fbfd', backgroundImage: "url('/Banner-Home.png')" }}
    >
      <div className="relative z-10 max-w-lg">
        <h1 className="text-[28px] leading-tight font-bold text-gray-900 mb-2">
          ยินดีต้อนรับ, {userName}
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">
          สร้างเอกสารจากเทมเพลตของคุณได้อย่างรวดเร็ว
          <br />
          กรอกข้อมูล ตรวจสอบ และส่งออกหรือส่งให้ผู้รับได้ทันที
        </p>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-all shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          สร้างเอกสารใหม่
        </Link>
      </div>
    </section>
  );
}
