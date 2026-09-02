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
} from "lucide-react";

export default function LeftSidebar({
  onAddText,
  onAddShape,
  onAddImage,
  onAddPreset,
  onAddTable,
  onAddSignature,
}) {
  const [activeTab, setActiveTab] = useState("blocks"); // "blocks" | "text" | "shapes" | "uploads"
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
          title="บล็อกโครงสร้างเอกสาร"
        >
          <LayoutTemplate className="w-5 h-5" />
          <span className="text-[10px]">บล็อกเอกสาร</span>
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
        {/* ── TAB 1: DOCUMENT BLOCKS (Phase 4) ── */}
        {activeTab === "blocks" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                บล็อกเฉพาะทางเอกสาร A4
              </h2>
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
                  <p className="text-[11px] text-gray-500 leading-snug">
                    ตารางรายการสินค้า พร้อมสูตรสรุปยอดรวม และภาษี VAT 7%
                  </p>
                </button>

                {/* 2. Dual Signature */}
                <button
                  onClick={() => onAddSignature && onAddSignature("dual")}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1 text-gray-900 group-hover:text-indigo-600 font-bold text-xs">
                    <PenTool className="w-4 h-4" />
                    <span>กล่องลงนาม 2 ฝั่ง (Dual Signature)</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    ช่องลงนาม 2 คอลัมน์ (ผู้มีอำนาจฝ่ายเรา vs คู่สัญญา/ลูกค้า)
                  </p>
                </button>

                {/* 3. Single Signature */}
                <button
                  onClick={() => onAddSignature && onAddSignature("single")}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1 text-gray-900 group-hover:text-indigo-600 font-bold text-xs">
                    <PenTool className="w-4 h-4" />
                    <span>ช่องลงนามเดี่ยว (Single Signature)</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    คำลงท้าย ขอแสดงความนับถือ + เส้นประ + ตำแหน่ง
                  </p>
                </button>

                {/* 4. Company Header */}
                <button
                  onClick={() => onAddPreset && onAddPreset("company_header")}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1 text-gray-900 group-hover:text-indigo-600 font-bold text-xs">
                    <Building className="w-4 h-4" />
                    <span>หัวกระดาษบริษัท (Company Letterhead)</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    ชื่อบริษัท + เลขประจำตัวผู้เสียภาษี + ที่อยู่ + เส้นคั่น
                  </p>
                </button>

                {/* 5. Party Info Grid */}
                <button
                  onClick={() => onAddPreset && onAddPreset("party_info")}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1 text-gray-900 group-hover:text-indigo-600 font-bold text-xs">
                    <FileCheck2 className="w-4 h-4" />
                    <span>กล่องข้อมูลผู้รับ & วันที่ (Info Grid)</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    เรียน / To, เรื่อง / Subject, วันที่ / Date
                  </p>
                </button>

                {/* 6. Terms Box */}
                <button
                  onClick={() => onAddPreset && onAddPreset("terms_box")}
                  className="w-full text-left p-3 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1 text-amber-800 font-bold text-xs">
                    <ScrollText className="w-4 h-4" />
                    <span>ข้อกำหนดและเงื่อนไข (Terms Box)</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    กล่องข้อกำหนดชำระเงิน การยืนราคา และเงื่อนไขสัญญา
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: TEXT ── */}
        {activeTab === "text" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                เพิ่มข้อความ
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    onAddText({
                      text: "หัวข้อเอกสาร (Heading)",
                      fontSize: 22,
                      fontWeight: "bold",
                    })
                  }
                  className="w-full text-left p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group"
                >
                  <p className="text-base font-bold text-gray-900 group-hover:text-indigo-600">
                    หัวข้อใหญ่ (Heading 1)
                  </p>
                  <p className="text-[11px] text-gray-400">ขนาด 22px ตัวหนา</p>
                </button>

                <button
                  onClick={() =>
                    onAddText({
                      text: "หัวข้อย่อย (Subheading)",
                      fontSize: 16,
                      fontWeight: "600",
                    })
                  }
                  className="w-full text-left p-2.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group"
                >
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600">
                    หัวข้อย่อย (Heading 2)
                  </p>
                  <p className="text-[11px] text-gray-400">ขนาด 16px ตัวกึ่งหนา</p>
                </button>

                <button
                  onClick={() =>
                    onAddText({
                      text: "พิมพ์ข้อความเนื้อหาเอกสารตรงนี้...",
                      fontSize: 13,
                      fontWeight: "normal",
                    })
                  }
                  className="w-full text-left p-2.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group"
                >
                  <p className="text-xs font-normal text-gray-700 group-hover:text-indigo-600">
                    เนื้อหาข้อความ (Body Text)
                  </p>
                  <p className="text-[11px] text-gray-400">ขนาด 13px ข้อความปกติ</p>
                </button>
              </div>
            </div>

            {/* Document Specific Text Presets */}
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                ข้อความสำเร็จรูป (Document Labels)
              </h2>
              <div className="space-y-1.5">
                {[
                  {
                    title: "หนังสือแจ้งเปลี่ยนแปลงที่ตั้งสำนักงานใหญ่",
                    fontFamily: "'Noto Sans Thai', sans-serif",
                    fontSize: 16,
                    fontWeight: "bold",
                  },
                  {
                    title: "วันที่ / Date: 01 กันยายน 2569",
                    fontFamily: "'Noto Sans Thai', sans-serif",
                    fontSize: 13,
                    fontWeight: "normal",
                  },
                  {
                    title: "เรียน / To: ท่านคู่ค้าและลูกค้าผู้มีอุปการคุณ",
                    fontFamily: "'Noto Sans Thai', sans-serif",
                    fontSize: 13,
                    fontWeight: "normal",
                  },
                  {
                    title: "เรื่อง / Subject: แจ้งเปลี่ยนแปลงที่อยู่สำนักงานใหญ่",
                    fontFamily: "'Noto Sans Thai', sans-serif",
                    fontSize: 13,
                    fontWeight: "normal",
                  },
                  {
                    title: "ขอแสดงความนับถือ / Sincerely yours,",
                    fontFamily: "'Noto Sans Thai', sans-serif",
                    fontSize: 13,
                    fontWeight: "normal",
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      onAddText({
                        text: item.title,
                        fontSize: item.fontSize,
                        fontWeight: item.fontWeight,
                        fontFamily: item.fontFamily,
                      })
                    }
                    className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 text-xs text-gray-800 transition-colors cursor-pointer"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: SHAPES ── */}
        {activeTab === "shapes" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                รูปทรงพื้นฐาน (Basic Shapes)
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    onAddShape({
                      type: "rect",
                      width: 200,
                      height: 100,
                      fill: "#F3F4F6",
                      stroke: "#9CA3AF",
                      strokeWidth: 1,
                      rx: 0,
                    })
                  }
                  className="p-3 border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Square className="w-8 h-8 text-gray-700" />
                  <span className="text-[11px] font-medium text-gray-700">กล่องสี่เหลี่ยม</span>
                </button>

                <button
                  onClick={() =>
                    onAddShape({
                      type: "rect",
                      width: 240,
                      height: 110,
                      fill: "#F1F5F9",
                      stroke: "#64748B",
                      strokeWidth: 1.5,
                      rx: 8,
                    })
                  }
                  className="p-3 border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-md bg-gray-200 border border-gray-500" />
                  <span className="text-[11px] font-medium text-gray-700">กล่องขอบมน</span>
                </button>

                <button
                  onClick={() =>
                    onAddShape({
                      type: "circle",
                      radius: 45,
                      fill: "#EEF2FF",
                      stroke: "#6366F1",
                      strokeWidth: 2,
                    })
                  }
                  className="p-3 border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Circle className="w-8 h-8 text-indigo-600" />
                  <span className="text-[11px] font-medium text-gray-700">วงกลม / ตรา</span>
                </button>

                <button
                  onClick={() =>
                    onAddShape({
                      type: "line",
                      width: 300,
                      stroke: "#D1D5DB",
                      strokeWidth: 1.5,
                    })
                  }
                  className="p-3 border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Minus className="w-8 h-8 text-gray-500" />
                  <span className="text-[11px] font-medium text-gray-700">เส้นคั่น (Line)</span>
                </button>
              </div>
            </div>

            {/* Document Highlight Cards */}
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                กล่องข้อมูลเอกสาร (Document Cards)
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    onAddShape({
                      type: "rect",
                      width: 680,
                      height: 75,
                      fill: "#F1F3F5",
                      stroke: "#6B7280",
                      strokeWidth: 3,
                      rx: 3,
                    })
                  }
                  className="w-full p-2.5 rounded-lg border-l-4 border-gray-500 bg-[#F1F3F5] text-left hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <p className="text-xs font-bold text-gray-800">กล่องที่อยู่เดิม (Previous Address)</p>
                  <p className="text-[10px] text-gray-500">พื้นหลังสีเทาอ่อน ขอบซ้ายหนา</p>
                </button>

                <button
                  onClick={() =>
                    onAddShape({
                      type: "rect",
                      width: 680,
                      height: 75,
                      fill: "#E2EEFB",
                      stroke: "#1D4ED8",
                      strokeWidth: 3,
                      rx: 3,
                    })
                  }
                  className="w-full p-2.5 rounded-lg border-l-4 border-[#1D4ED8] bg-[#E2EEFB] text-left hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <p className="text-xs font-bold text-blue-900">กล่องที่อยู่ใหม่ (New Address)</p>
                  <p className="text-[10px] text-blue-700">พื้นหลังสีฟ้าพาสเทล ขอบซ้ายสีน้ำเงิน</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: UPLOADS ── */}
        {activeTab === "uploads" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                อัปโหลดรูปภาพของคุณ
              </h2>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-900">คลิกเพื่ออัปโหลดไฟล์</p>
                  <p className="text-[10px] text-indigo-600/70">รองรับ PNG, JPG, SVG, WebP</p>
                </div>
              </button>
            </div>

            {/* Preset Sample Logos */}
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                โลโก้ตัวอย่างในระบบ
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Header Logo", url: "/header_logo.png" },
                  { name: "Quotation Logo", url: "/quotation.png" },
                  { name: "Partner Logo", url: "/Partner-logo.webp" },
                ].map((logo, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAddImage(logo.url)}
                    className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex flex-col items-center gap-2 transition-all cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-white rounded border border-gray-100 flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logo.url}
                        alt={logo.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-gray-700 truncate w-full text-center">
                      {logo.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}