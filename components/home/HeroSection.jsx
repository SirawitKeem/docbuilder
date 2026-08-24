import React from "react";
import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection({ userName }) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-surface border border-border px-8 py-10 shadow-xs bg-contain bg-no-repeat transition-colors"
      style={{
        backgroundImage: "url('/Banner-Home.png')",
        backgroundPosition: '95% center',
      }}
    >
      {/* Light/Dark mode overlay to ensure background image contrast in Dark Mode */}
      <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-lg">
        <span className="text-xs font-semibold text-primary mb-1 inline-block">
          ยินดีต้อนรับกลับมา,
        </span>
        <h1 className="text-2xl sm:text-3xl leading-tight font-extrabold tracking-tight text-foreground mb-3">
          {userName || "Admin"} 👋
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
          สร้างเอกสารจากเทมเพลตของคุณได้อย่างรวดเร็ว
          <br />
          กรอกข้อมูล ตรวจสอบ และส่งเอกสารออนไลน์ได้ทันที
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="rounded-xl font-semibold bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white shadow-sm hover:opacity-95 transition-opacity border-0 gap-2 px-5">
            <Link href="/create">
              <Plus size={18} strokeWidth={2.5} />
              สร้างเอกสารใหม่
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="rounded-xl font-semibold bg-surface border border-border text-foreground hover:bg-muted/60 gap-2 px-5">
            <Link href="/create">
              <Upload size={16} strokeWidth={2} />
              นำเข้าเอกสาร
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
