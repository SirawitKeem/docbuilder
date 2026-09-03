"use client";

import React, { useEffect } from "react";
import { X, FileText, Presentation, Table, Sparkles } from "lucide-react";

export default function NewTemplateTypeModal({
  isOpen,
  onClose,
  onSelect,
  categoryName = "",
}) {
  // Close on ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col animate-in fade-in zoom-in-95 duration-150 overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="h-18 px-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5542F6] flex items-center justify-center shrink-0 border border-purple-100/60 shadow-2xs">
              <Sparkles size={20} className="text-[#5542F6]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                เลือกรูปแบบการสร้างเทมเพลต {categoryName ? `(${categoryName})` : ""}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                เลือกประเภทเครื่องมือออกแบบที่คุณต้องการใช้สร้างแม่แบบเอกสาร
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center cursor-pointer"
            title="ปิดหน้าต่าง (ESC)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body: 3-Column Type Cards */}
        <div className="p-6 bg-[#FAFBFD]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: 📄 Docs (Enabled) */}
            <div
              onClick={() => onSelect?.("document")}
              className="group bg-white rounded-2xl border-2 border-purple-200 hover:border-[#5542F6] p-5.5 flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer relative overflow-hidden text-left"
            >
              {/* Highlight Ribbon */}
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                <div className="absolute transform rotate-45 bg-gradient-to-r from-[#5542F6] to-[#7C4DFF] text-white text-[9px] font-black py-0.5 right-[-32px] top-[18px] w-[120px] text-center shadow-xs">
                  พร้อมใช้งาน
                </div>
              </div>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100/80 text-[#5542F6] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                  <FileText size={24} />
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-base font-black text-gray-900 group-hover:text-[#5542F6] transition-colors">
                    Docs (เอกสาร A4)
                  </h3>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  สร้างเอกสาร สัญญา ใบเสนอราคา ใบเสร็จ หรือประกาศทางการ ขนาดกระดาษ A4 เสมือนจริง พร้อมระบบตารางและตัวแปรไดนามิก
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400">ขนาด 794 × 1123 px</span>
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-[#5542F6] group-hover:bg-[#4332D6] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>เลือก Docs</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Card 2: 🖼️ Slides (Enabled) */}
            <div
              onClick={() => onSelect?.("slide")}
              className="group bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-500 p-5.5 flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer relative overflow-hidden text-left"
            >
              {/* Highlight Ribbon */}
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                <div className="absolute transform rotate-45 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black py-0.5 right-[-32px] top-[18px] w-[120px] text-center shadow-xs">
                  พร้อมใช้งาน
                </div>
              </div>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100/80 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                  <Presentation size={24} />
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-base font-black text-gray-900 group-hover:text-amber-600 transition-colors">
                    Slides (งานนำเสนอ 16:9)
                  </h3>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  สร้างสไลด์งานนำเสนออัตราส่วน 16:9 สไตล์ PowerPoint / Canva พร้อมรองรับหลายหน้าสไลด์และส่งออกเป็น PDF เวกเตอร์
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400">ขนาด 1280 × 720 px (16:9)</span>
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 group-hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>เลือก Slides</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Card 3: 📊 Sheets (Enabled) */}
            <div
              onClick={() => onSelect?.("sheet")}
              className="group bg-white rounded-2xl border-2 border-emerald-200 hover:border-emerald-500 p-5.5 flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer relative overflow-hidden text-left"
            >
              {/* Highlight Ribbon */}
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                <div className="absolute transform rotate-45 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-black py-0.5 right-[-32px] top-[18px] w-[120px] text-center shadow-xs">
                  พร้อมใช้งาน
                </div>
              </div>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100/80 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                  <Table size={24} />
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-base font-black text-gray-900 group-hover:text-emerald-600 transition-colors">
                    Sheets (ตารางคำนวณ .xlsx)
                  </h3>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  สร้างตารางคำนวณข้อมูล บัญชีสินค้า ใบแจกแจงรายการ พร้อมฟังก์ชันคำนวณสูตรอัตโนมัติและส่งออกเป็นไฟล์ Excel (.xlsx) แท้
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400">สูตรคำนวณ & ส่งออก .xlsx</span>
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>เลือก Sheets</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>กด ESC เพื่อยกเลิก</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}