"use client";

import Link from "next/link";
import { ArrowLeft, Undo2, Redo2, Eye, Download, Save, MoreHorizontal, Loader2, Check } from "lucide-react";

export default function EditorToolbar({
  template,
  status,
  onPreview,
  onExport,
  exporting,
  onSave,
  isSaving,
  savedAt,
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
        {/* ปุ่ม บันทึกเอกสาร (Save Document) */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
          title="บันทึกเอกสารนี้ไว้ในคลัง 'เอกสารของฉัน'"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin text-primary-600" /> : <Save size={16} className="text-gray-600" />}
          <span className="hidden sm:inline">{isSaving ? "กำลังบันทึก..." : "บันทึกเอกสาร"}</span>
        </button>

        {/* ปุ่ม Preview */}
        <button
          onClick={onPreview}
          className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Eye size={16} />
          <span className="hidden sm:inline">Preview</span>
        </button>

        {/* ปุ่ม Export PDF */}
        <button
          onClick={onExport}
          disabled={exporting}
          className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-colors disabled:opacity-60"
        >
          {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          <span className="hidden sm:inline">{exporting ? "กำลังสร้าง..." : "Export PDF"}</span>
        </button>

        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status.isComplete) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-success-600">
        <span className="w-1.5 h-1.5 rounded-full bg-success-600" />
        กรอกข้อมูลครบแล้ว
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
      กรอกแล้ว {status.filled}/{status.total}
    </span>
  );
}