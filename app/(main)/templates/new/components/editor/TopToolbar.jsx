"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Ruler,
  Save,
  Edit2,
  Check,
} from "lucide-react";

export default function TopToolbar({
  templateName,
  onUpdateTemplateName,
  categoryName,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  showRuler,
  onToggleRuler,
  showMargin,
  onToggleMargin,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  saving,
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(templateName);

  const handleFinishRename = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      onUpdateTemplateName(titleInput.trim());
    } else {
      setTitleInput(templateName);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs select-none">
      {/* ── LEFT: Back & Title ── */}
      <div className="flex items-center gap-3">
        <Link
          href="/templates"
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          title="กลับไปหน้ารายการเทมเพลต"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              หมวดหมู่: {categoryName}
            </span>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-[11px] text-gray-500 font-mono">A4 (794×1123px)</span>
          </div>

          {/* Document Title with inline edit */}
          <div className="flex items-center gap-1.5 mt-0.5">
            {isEditingTitle ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleFinishRename();
                    if (e.key === "Escape") {
                      setTitleInput(templateName);
                      setIsEditingTitle(false);
                    }
                  }}
                  autoFocus
                  className="text-sm font-bold text-gray-900 border border-indigo-500 rounded px-1.5 py-0.5 outline-none bg-white shadow-inner"
                />
                <button
                  onClick={handleFinishRename}
                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                  title="ยืนยัน"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="group flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 px-1.5 py-0.5 rounded transition-colors"
                title="คลิกเพื่อเปลี่ยนชื่อเทมเพลต"
              >
                <h1 className="text-sm font-bold text-gray-900 leading-tight">
                  {templateName}
                </h1>
                <Edit2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CENTER: History & Zoom & View Guides ── */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-md text-gray-700 hover:bg-white disabled:opacity-35 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="เลิกทำ (Undo - Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-md text-gray-700 hover:bg-white disabled:opacity-35 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="ทำซ้ำ (Redo - Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5 text-gray-700 text-xs font-medium">
          <button
            onClick={onZoomOut}
            className="p-1.5 hover:bg-white rounded-md transition-colors cursor-pointer"
            title="ย่อขนาด"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-2 select-none min-w-[48px] text-center font-mono font-bold text-xs text-gray-800">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            className="p-1.5 hover:bg-white rounded-md transition-colors cursor-pointer"
            title="ขยายขนาด"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={onZoomReset}
            className="p-1.5 hover:bg-white rounded-md transition-colors border-l border-gray-200 ml-0.5 cursor-pointer"
            title="รีเซ็ตขนาดพอดี (85%)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* View Guides Toggles */}
        <div className="flex items-center gap-1.5 ml-1">
          <button
            onClick={onToggleRuler}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              showRuler
                ? "bg-slate-800 text-white border-slate-800 shadow-xs"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
            title="เปิด/ปิด ไม้บรรทัดหน่วยมิลลิเมตร (mm)"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>ไม้บรรทัด (mm)</span>
          </button>

          <button
            onClick={onToggleMargin}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              showMargin
                ? "bg-rose-50 text-rose-700 border-rose-200 font-semibold"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
            title="เปิด/ปิด เส้นไกด์ระยะขอบ 15mm"
          >
            Margin (15mm)
          </button>
        </div>
      </div>

      {/* ── RIGHT: Save Button ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "กำลังบันทึก..." : "บันทึกเทมเพลต"}</span>
        </button>
      </div>
    </header>
  );
}