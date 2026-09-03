"use client";

import React, { useState, useRef } from "react";
import {
  Type,
  Square,
  Circle,
  Minus,
  UploadCloud,
  FileText,
  LayoutTemplate,
  Table,
  PenTool,
  Building,
  FileCheck2,
  ScrollText,
  Braces,
  Sparkles,
} from "lucide-react";
import { AVAILABLE_TOKEN_CATEGORIES } from "@/lib/tokens/tokenEngine";

export default function LeftSidebar({
  editorType = "document",
  onAddText,
  onAddShape,
  onAddImage,
  onAddPreset,
  onAddTable,
  onAddSignature,
  onInsertToken,
}) {
  const isSlide = editorType === "slide";
  const [activeTab, setActiveTab] = useState(isSlide ? "text" : "blocks"); // "blocks" | "tokens" | "text" | "shapes" | "uploads"
  const fileInputRef = useRef(null);

  // Handle local image file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl && onAddImage) {
        onAddImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex h-[calc(100vh-53px)] select-none z-20 shrink-0 shadow-xs">
      {/* ── NARROW ICON NAVIGATION RAIL ── */}
      <nav className="w-18 bg-gray-50/90 border-r border-gray-200 flex flex-col items-center py-3 gap-1.5 shrink-0">
        <button
          onClick={() => setActiveTab("blocks")}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === "blocks"
              ? "bg-indigo-600 text-white shadow-sm font-semibold"
              : "text-gray-600 hover:bg-gray-200/70 hover:text-gray-900"
          }`}
          title={isSlide ? "โครงร่างสไลด์ (Slide Layouts)" : "บล็อกโครงสร้างเอกสาร"}
        >
          <LayoutTemplate className="w-5 h-5" />
          <span className="text-[10px]">{isSlide ? "โครงร่างสไลด์" : "บล็อกเอกสาร"}</span>
        </button>

        {/* 🏷️ TAB: TOKENS / DYNAMIC VARIABLES (Phase 6) */}
        <button
          onClick={() => setActiveTab("tokens")}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === "tokens"
              ? "bg-indigo-600 text-white shadow-sm font-semibold"
              : "text-gray-600 hover:bg-gray-200/70 hover:text-gray-900"
          }`}
          title="ตัวแปรไดนามิก {{token}}"
        >
          <Braces className="w-5 h-5" />
          <span className="text-[10px]">ตัวแปรไดนามิก</span>
        </button>

        <button
          onClick={() => setActiveTab("text")}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === "text"
              ? "bg-indigo-600 text-white shadow-sm font-semibold"
              : "text-gray-600 hover:bg-gray-200/70 hover:text-gray-900"
          }`}
          title="ข้อความและฟอนต์"
        >
          <Type className="w-5 h-5" />
          <span className="text-[10px]">ข้อความ</span>
        </button>

        <button
          onClick={() => setActiveTab("shapes")}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === "shapes"
              ? "bg-indigo-600 text-white shadow-sm font-semibold"
              : "text-gray-600 hover:bg-gray-200/70 hover:text-gray-900"
          }`}
          title="รูปทรงและเส้น"
        >
          <Square className="w-5 h-5" />
          <span className="text-[10px]">รูปทรง</span>
        </button>

        <button
          onClick={() => setActiveTab("uploads")}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === "uploads"
              ? "bg-indigo-600 text-white shadow-sm font-semibold"
              : "text-gray-600 hover:bg-gray-200/70 hover:text-gray-900"
          }`}
          title="อัปโหลดรูปภาพ / โลโก้"
        >
          <UploadCloud className="w-5 h-5" />
          <span className="text-[10px]">อัปโหลด</span>
        </button>
      </nav>

      {/* ── TAB CONTENT PANEL ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ── TAB 1: BLOCKS / SLIDE LAYOUTS ── */}
        {activeTab === "blocks" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {isSlide ? "โครงร่างสไลด์นำเสนอ (16:9)" : "บล็อกเฉพาะทางเอกสาร A4"}
              </h2>
              {isSlide ? (
                <div className="space-y-2">
                  {/* Slide Preset 1: Title & Subtitle */}
                  <button
                    onClick={() => onAddPreset && onAddPreset("slide_title_subtitle")}
                    className="w-full text-left p-3 rounded-xl border border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1 text-indigo-700 font-bold text-xs">
                      <LayoutTemplate className="w-4 h-4" />
                      <span>หัวข้อและคำอธิบาย (Title & Subtitle)</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      กล่องข้อความหัวเรื่องหลักขนาด 44px พร้อมคำอธิบายย่อยจัดกึ่งกลาง
                    </p>
                  </button>

                  {/* Slide Preset 2: Two Column Cards */}
                  <button
                    onClick={() => onAddPreset && onAddPreset("slide_two_column")}
                    className="w-full text-left p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1 text-gray-800 font-bold text-xs">
                      <Table className="w-4 h-4 text-emerald-600" />
                      <span>เนื้อหา 2 คอลัมน์ (Comparison Cards)</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      การ์ดเนื้อหาเปรียบเทียบซ้าย-ขวา 2 ฝั่ง พร้อมหัวข้อย่อย
                    </p>
                  </button>

                  {/* Slide Preset 3: Key Metric / Stat Callout */}
                  <button
                    onClick={() => onAddPreset && onAddPreset("slide_stat_callout")}
                    className="w-full text-left p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1 text-gray-800 font-bold text-xs">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>สถิติสำคัญ (KPI / Key Metric Card)</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      ตัวเลขไฮไลท์ขนาดใหญ่พร้อมข้อความระบุผลลัพธ์
                    </p>
                  </button>

                  {/* Slide Preset 4: Bullet Points */}
                  <button
                    onClick={() => onAddPreset && onAddPreset("slide_bullets")}
                    className="w-full text-left p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1 text-gray-800 font-bold text-xs">
                      <ScrollText className="w-4 h-4 text-amber-600" />
                      <span>รายการจุดเด่น (Key Takeaways)</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      รายการสรุปข้อคิดและจุดเด่น 3 ข้อพร้อมไอคอนนำ
                    </p>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* 1. Quotation Table */}
                  <button
                    onClick={() => onAddTable && onAddTable()}
                    className="w-full text-left p-3 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1 text-blue-700 font-bold text-xs">
                      <Table className="w-4 h-4" />
                      <span>ตารางใบเสนอราคา (Pricing Table)</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      ตาราง 5 คอลัมน์พร้อมคำนวณ VAT 7% และยอดรวมอัตโนมัติ
                    </p>
                  </button>

                  {/* 2. Signature Dual Block */}
                  <button
                    onClick={() => onAddSignature && onAddSignature("dual")}
                    className="w-full text-left p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1 text-gray-800 font-bold text-xs">
                      <PenTool className="w-4 h-4 text-indigo-600" />
                      <span>บล็อกลงนามคู่ (ผู้เสนอราคา + ลูกค้า)</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      ช่องลงลายมือชื่อ 2 ฝั่งซ้าย-ขวา พร้อมวันที่และตำแหน่ง
                    </p>
                  </button>

                  {/* 3. Company Header Block */}
                  <button
                    onClick={() => onAddPreset && onAddPreset("company_header")}
                    className="w-full text-left p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1 text-gray-800 font-bold text-xs">
                      <Building className="w-4 h-4 text-emerald-600" />
                      <span>หัวกระดาษบริษัท (Company Header)</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      ชื่อบริษัท, เลขประจำตัวผู้เสียภาษี, ที่อยู่, เบอร์โทร
                    </p>
                  </button>

                  {/* 4. Party Info Grid */}
                  <button
                    onClick={() => onAddPreset && onAddPreset("party_info")}
                    className="w-full text-left p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1 text-gray-800 font-bold text-xs">
                      <FileCheck2 className="w-4 h-4 text-purple-600" />
                      <span>ข้อมูลคู่สัญญา / เลขที่เอกสาร (Info Grid)</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      กล่อง Bill To และช่องเลขที่/วันที่เอกสารแบบ 2 คอลัมน์
                    </p>
                  </button>

                  {/* 5. Terms & Conditions Box */}
                  <button
                    onClick={() => onAddPreset && onAddPreset("terms_box")}
                    className="w-full text-left p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1 text-gray-800 font-bold text-xs">
                      <ScrollText className="w-4 h-4 text-amber-600" />
                      <span>เงื่อนไขและข้อตกลง (Terms & Conditions)</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      กล่องข้อกำหนดการชำระเงินและเงื่อนไขการส่งมอบ
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: DYNAMIC TOKENS (Phase 6) ── */}
        {activeTab === "tokens" && (
          <div className="space-y-4">
            <div className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>ตัวแปรไดนามิก (Data Binding)</span>
              </div>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                คลิกที่ตัวแปรด้านล่างเพื่อแทรกลงในข้อความ หรือแทรกลงในตาราง ระบบจะดึงข้อมูลจริงมาแทนที่อัตโนมัติเมื่อสร้างเอกสาร
              </p>
            </div>

            {AVAILABLE_TOKEN_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  {cat.category}
                </h3>
                <div className="space-y-1.5">
                  {cat.tokens.map((tok) => (
                    <button
                      key={tok.key}
                      onClick={() => onInsertToken && onInsertToken(tok.key, tok.example)}
                      className="w-full text-left p-2 rounded-lg border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all cursor-pointer group bg-white shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-indigo-600 group-hover:text-indigo-800">
                          {tok.key}
                        </span>
                        <span className="text-[10px] text-gray-500">{tok.label}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 truncate mt-0.5">
                        ตัวอย่าง: {tok.example}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 3: TEXT ── */}
        {activeTab === "text" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                เพิ่มข้อความ
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    onAddText &&
                    onAddText({
                      text: "หัวข้อเอกสาร (Heading 1)",
                      fontSize: 22,
                      fontWeight: "bold",
                    })
                  }
                  className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer"
                >
                  <p className="font-bold text-base text-gray-900">หัวข้อใหญ่ (H1)</p>
                  <p className="text-[11px] text-gray-400">22px • ตัวหนา (Bold)</p>
                </button>

                <button
                  onClick={() =>
                    onAddText &&
                    onAddText({
                      text: "หัวข้อย่อย (Heading 2)",
                      fontSize: 16,
                      fontWeight: "bold",
                    })
                  }
                  className="w-full text-left p-2.5 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer"
                >
                  <p className="font-bold text-sm text-gray-800">หัวข้อย่อย (H2)</p>
                  <p className="text-[11px] text-gray-400">16px • กึ่งหนา</p>
                </button>

                <button
                  onClick={() =>
                    onAddText &&
                    onAddText({
                      text: "ข้อความเนื้อหาเอกสาร รายละเอียด หรือเงื่อนไขต่างๆ...",
                      fontSize: 12,
                      fontWeight: "normal",
                    })
                  }
                  className="w-full text-left p-2.5 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer"
                >
                  <p className="text-xs text-gray-700">เนื้อหาเอกสาร (Body Text)</p>
                  <p className="text-[11px] text-gray-400">12px • ขนาดปกติ</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: SHAPES ── */}
        {activeTab === "shapes" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                รูปทรงเรขาคณิต & เส้น
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAddShape && onAddShape({ type: "rect" })}
                  className="p-3 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/30 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Square className="w-6 h-6 text-gray-700" />
                  <span className="text-xs font-medium text-gray-700">สี่เหลี่ยม</span>
                </button>

                <button
                  onClick={() => onAddShape && onAddShape({ type: "circle" })}
                  className="p-3 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/30 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Circle className="w-6 h-6 text-gray-700" />
                  <span className="text-xs font-medium text-gray-700">วงกลม</span>
                </button>

                <button
                  onClick={() => onAddShape && onAddShape({ type: "line" })}
                  className="p-3 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/30 flex flex-col items-center gap-1.5 transition-all cursor-pointer col-span-2"
                >
                  <Minus className="w-6 h-6 text-gray-700" />
                  <span className="text-xs font-medium text-gray-700">เส้นคั่น (Divider Line)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: UPLOADS ── */}
        {activeTab === "uploads" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                อัปโหลดรูปภาพ / โลโก้
              </h2>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-5 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 flex flex-col items-center justify-center gap-2 text-indigo-700 transition-colors cursor-pointer"
              >
                <UploadCloud className="w-8 h-8 text-indigo-500" />
                <span className="text-xs font-bold">เลือกไฟล์รูปภาพ / โลโก้</span>
                <span className="text-[10px] text-gray-400">PNG, JPG, SVG</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}