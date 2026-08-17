"use client";

import Link from "next/link";
import { ArrowLeft, Undo2, Redo2, Eye, Download, Loader2, MoreHorizontal } from "lucide-react";
import { useDocumentFields } from "@/context/DocumentFieldsContext";
import { ndaTemplate, getCompletionStatus } from "@/lib/templates/nda/schema";

export default function EditorToolbar({ onPreview, onExport, exporting }) {
  const { values } = useDocumentFields();
  const status = getCompletionStatus(values);

  return (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
      {/* Left: Back + title */}
      <div className="flex items-center gap-4 min-w-0">
        <Link
          href="/"
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-700 shrink-0"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {ndaTemplate.fullName}
          </p>
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Center: Undo/Redo */}
      <div className="hidden md:flex items-center gap-1">
        <button
          disabled
          className="p-2 rounded-lg text-gray-300 cursor-not-allowed"
          title="ยังไม่มีประวัติการแก้ไข"
        >
          <Undo2 size={18} />
        </button>
        <button disabled className="p-2 rounded-lg text-gray-300 cursor-not-allowed">
          <Redo2 size={18} />
        </button>
      </div>

      {/* Right: Preview + Export */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onPreview}
          className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          <Eye size={16} />
          <span className="hidden sm:inline">Preview</span>
        </button>
        <button
          onClick={onExport}
          disabled={exporting}
          className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 disabled:opacity-60"
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