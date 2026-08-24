import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function HeroSection({ userName }) {
  return (
    <section
      className="relative overflow-hidden rounded-[16px] bg-[#F6F3FA] border border-[#E4E4E8] px-8 py-10 mb-8 shadow-card bg-contain bg-no-repeat"
      style={{ backgroundColor: '#F6F3FA', backgroundImage: "url('/Banner-Home.png')", backgroundPosition: '95% center' }}
    >
      <div className="relative z-10 max-w-lg">
        <h1 className="text-[28px] leading-tight font-semibold text-[#22162B] mb-2">
          ยินดีต้อนรับ, {userName}
        </h1>
        <p className="text-sm text-[#646469] leading-relaxed mb-6 font-medium">
          สร้างเอกสารจากเทมเพลตของคุณได้อย่างรวดเร็ว
          <br />
          กรอกข้อมูล ตรวจสอบ และส่งออกหรือส่งให้ผู้รับได้ทันที
        </p>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-[10px] bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white text-sm font-semibold hover:opacity-95 transition-opacity"
        >
          <Plus size={18} strokeWidth={2.5} />
          สร้างเอกสารใหม่
        </Link>
      </div>
    </section>
  );
}
