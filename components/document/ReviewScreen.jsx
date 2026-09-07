"use client";

import { useContext, useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Download,
  Loader2,
  ChevronDown,
  FileText,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { DocumentFieldsContext } from "@/context/DocumentFieldsContext";
import DocumentHeader from "./DocumentHeader";
import DocumentFooter from "./DocumentFooter";

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

export default function ReviewScreen({
  template,
  pages,
  status,
  onExport,
  onSendEmail,
  exporting,
  onBackToEdit,
  customRender = false,
}) {
  const docFieldsCtx = useContext(DocumentFieldsContext);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const exportMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBack = () => {
    if (onBackToEdit) {
      onBackToEdit();
    } else if (docFieldsCtx) {
      docFieldsCtx.setReadOnly(false);
    }
  };

  const isCustomDoc = customRender || template?.isCustomDoc;

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-noto-looped">
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-700">
            <ArrowLeft size={20} />
          </button>
          <p className="text-sm font-semibold text-gray-900">ตรวจสอบเอกสารก่อนส่ง</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className={`rounded-[16px] px-5 py-4 mb-6 flex items-center gap-3 ${status.isComplete ? "bg-[#DDEEE2]" : "bg-[#F6F6FA] border border-[#E4E4E8]"}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${status.isComplete ? "bg-[#239742]" : "bg-[#B2AFBC]"}`} />
            <div>
              <p className={`text-sm font-semibold ${status.isComplete ? "text-[#17682F]" : "text-[#22162B]"}`}>
                {status.isComplete ? "✓ กรอกข้อมูลครบแล้ว" : `กรอกข้อมูลแล้ว ${status.filled}/${status.total} รายการ`}
              </p>
              <p className="text-xs text-[#646469]">
                {status.isComplete ? "พร้อมสำหรับการตรวจสอบเอกสาร" : "กรุณากลับไปกรอกข้อมูลให้ครบก่อนส่งออก"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              onClick={onSendEmail}
              disabled={!status.isComplete || exporting}
              className="flex items-center gap-2 h-11 px-5 rounded-[10px] border border-[#E4E4E8] bg-white text-[#22162B] text-sm font-medium hover:bg-[#F6F6FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
              ส่ง Email
            </button>

            {/* ปุ่ม Multi-Format Export (PDF, HTML, WebP) */}
            <div className="relative flex items-center" ref={exportMenuRef}>
              <button
                onClick={() => onExport?.(selectedFormat)}
                disabled={!status.isComplete || exporting}
                className="flex items-center gap-2 h-11 pl-5 pr-3 rounded-l-[10px] bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white text-sm font-semibold hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer"
                title={`ส่งออกเอกสารในรูปแบบ .${selectedFormat}`}
              >
                {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                <span>{exporting ? "กำลังส่งออก..." : `Export ${selectedFormat.toUpperCase()}`}</span>
              </button>
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                disabled={!status.isComplete || exporting}
                className="h-11 px-2.5 rounded-r-[10px] bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white hover:opacity-95 border-l border-white/25 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex items-center justify-center cursor-pointer"
                title="เลือกรูปแบบการส่งออก (PDF, HTML, WebP)"
              >
                <ChevronDown size={15} className={`transition-transform duration-150 ${exportMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {exportMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                  <div className="px-3 py-1.5 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    เลือกรูปแบบการ Export
                  </div>

                  {/* 1. PDF */}
                  <button
                    onClick={() => {
                      setSelectedFormat("pdf");
                      setExportMenuOpen(false);
                      onExport?.("pdf");
                    }}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-gray-50 flex items-start gap-3 transition-colors cursor-pointer group ${
                      selectedFormat === "pdf" ? "bg-purple-50/50" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">PDF Document (.pdf)</span>
                        <span className="text-[10px] font-medium bg-red-50 text-red-700 px-1.5 py-0.5 rounded">พิมพ์ / ส่งงาน</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">เอกสารต้นฉบับคมชัดมาตรฐาน สำหรับพิมพ์และส่งทางการ</p>
                    </div>
                  </button>

                  {/* 2. HTML */}
                  <button
                    onClick={() => {
                      setSelectedFormat("html");
                      setExportMenuOpen(false);
                      onExport?.("html");
                    }}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-gray-50 flex items-start gap-3 transition-colors cursor-pointer group border-t border-gray-100 ${
                      selectedFormat === "html" ? "bg-purple-50/50" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <Globe size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">HTML Webpage (.html)</span>
                        <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">เว็บเพจ</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">หน้าเว็บ Standalone พกพาสะดวก เปิดบนเบราว์เซอร์ได้ทันที</p>
                    </div>
                  </button>

                  {/* 3. WebP */}
                  <button
                    onClick={() => {
                      setSelectedFormat("webp");
                      setExportMenuOpen(false);
                      onExport?.("webp");
                    }}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-gray-50 flex items-start gap-3 transition-colors cursor-pointer group border-t border-gray-100 ${
                      selectedFormat === "webp" ? "bg-purple-50/50" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <ImageIcon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">WebP Image (.webp)</span>
                        <span className="text-[10px] font-medium bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">รูปภาพ 2x</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">รูปภาพความละเอียดสูง คมชัดระดับ Retina ขนาดไฟล์เล็ก</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8 pb-12 flex flex-col items-center">
            {pages.map((PageContent, i) => {
              if (isCustomDoc) {
                return (
                  <div key={i} className="shrink-0">
                    <PageContent />
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className="bg-white shadow-document font-noto-looped shrink-0 text-gray-900 overflow-hidden"
                  style={{ width: A4_WIDTH, height: A4_HEIGHT, minHeight: A4_HEIGHT }}
                >
                  <div
                    className="flex flex-col overflow-hidden text-left"
                    style={{
                      padding: `${template.hasHeader !== false ? "28px" : "0px"} 48px ${template.hasFooter !== false ? "28px" : "0px"} 48px`,
                      height: A4_HEIGHT,
                      boxSizing: "border-box",
                    }}
                  >
                    {template.hasHeader !== false && <DocumentHeader logo={template.logo} />}
                    <div className="flex-1 min-h-0 flex flex-col">
                      <PageContent />
                    </div>
                    {template.hasFooter !== false && (
                      <DocumentFooter title={template.fullName} pageNumber={i + 1} totalPages={pages.length} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}