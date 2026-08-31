"use client";

import Link from "next/link";
import { ArrowLeft, Undo2, Redo2, Eye, Download, Save, MoreHorizontal, Loader2, Check, CopyPlus, SlidersHorizontal } from "lucide-react";

export default function EditorToolbar({
  template,
  status,
  onPreview,
  onExport,
  exporting,
  onSave,
  isSaving,
  savedAt,
  onCreateRevision,
  isCreatingRevision,
  isFormOpen,
  onToggleForm,
}) {
  return (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4 min-w-0">
        <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-700 shrink-0">
          <ArrowLeft size={20} />
        </Link>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{template.fullName}</p>
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            {savedAt && (
              <span className="text-[11px] text-gray-400 font-normal hidden sm:inline-flex items-center gap-1">
                <Check size={12} className="text-success-600" />
                บันทึกเมื่อ {savedAt}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-1">
        <button disabled className="p-2 rounded-lg text-gray-300 cursor-not-allowed">
          <Undo2 size={18} />
        </button>
        <button disabled className="p-2 rounded-lg text-gray-300 cursor-not-allowed">
          <Redo2 size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* ปุ่ม เปิด/ปิด แถบฟอร์มกรอกข้อมูล */}
        {onToggleForm && (
          <button
            onClick={onToggleForm}
            className={`flex items-center gap-1.5 h-10 px-3.5 rounded-[10px] border text-xs font-bold transition-all cursor-pointer ${
              isFormOpen
                ? "border-[#5542F6] bg-[#F5F1FF] text-[#5542F6]"
                : "border-[#E4E4E8] bg-white text-[#52525B] hover:bg-[#F6F6FA]"
            }`}
            title="เปิด/ปิด แถบฟอร์มกรอกข้อมูล"
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">{isFormOpen ? "ซ่อนฟอร์ม" : "เปิดฟอร์ม"}</span>
          </button>
        )}
        {/* ปุ่ม สร้าง Rev ใหม่ (เมื่อเป็นเอกสารที่บันทึกแล้ว) */}
        {onCreateRevision && (
          <button
            onClick={onCreateRevision}
            disabled={isCreatingRevision}
            className="flex items-center gap-2 h-10 px-4 rounded-[10px] border border-[#E4E4E8] text-[#22162B] text-sm font-medium hover:bg-[#F6F6FA] transition-colors disabled:opacity-60"
            title="สร้างฉบับปรับปรุงใหม่ (คงเลข Quotation No. เดิม แต่อัปเกรด Rev ขึ้น)"
          >
            {isCreatingRevision ? (
              <Loader2 size={16} className="animate-spin text-[#7C4DFF]" />
            ) : (
              <CopyPlus size={16} />
            )}
            <span className="hidden sm:inline">{isCreatingRevision ? "กำลังสร้าง..." : "สร้าง Rev ใหม่"}</span>
          </button>
        )}

        {/* ปุ่ม บันทึกเอกสาร (Save Document) */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 h-10 px-4 rounded-[10px] border border-[#E4E4E8] text-[#22162B] text-sm font-medium hover:bg-[#F6F6FA] transition-colors disabled:opacity-60"
          title="บันทึกเอกสารนี้ไว้ในคลัง 'เอกสารของฉัน'"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin text-[#7C4DFF]" /> : <Save size={16} className="text-[#646469]" />}
          <span className="hidden sm:inline">{isSaving ? "กำลังบันทึก..." : "บันทึกเอกสาร"}</span>
        </button>

        {/* ปุ่ม Preview */}
        <button
          onClick={onPreview}
          className="flex items-center gap-2 h-10 px-4 rounded-[10px] border border-[#E4E4E8] text-[#22162B] text-sm font-medium hover:bg-[#F6F6FA] transition-colors"
        >
          <Eye size={16} />
          <span className="hidden sm:inline">Preview</span>
        </button>

        {/* ปุ่ม Export PDF */}
        <button
          onClick={onExport}
          disabled={exporting}
          className="flex items-center gap-2 h-10 px-4 rounded-[10px] bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white text-sm font-semibold hover:opacity-95 transition-opacity disabled:opacity-60"
        >
          {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          <span className="hidden sm:inline">{exporting ? "กำลังสร้าง..." : "Export PDF"}</span>
        </button>

        <button className="p-2 rounded-[10px] text-[#646469] hover:bg-[#F6F6FA]">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status.isComplete) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#17682F]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#239742]" />
        กรอกข้อมูลครบแล้ว
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#646469]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#B2AFBC]" />
      กรอกแล้ว {status.filled}/{status.total}
    </span>
  );
}