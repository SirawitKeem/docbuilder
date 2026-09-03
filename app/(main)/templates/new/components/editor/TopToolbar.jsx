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
  Sparkles,
} from "lucide-react";

export default function TopToolbar({
  templateName,
  onUpdateTemplateName,
  categoryName,
  editorType = "document",
  canvasPreset = "a4-portrait",
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
  isPreviewTokens = false,
  onTogglePreviewTokens,
}) {
  const isSlide = editorType === "slide";
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(templateName);

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      onUpdateTemplateName(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSaveTitle();
    if (e.key === "Escape") {
      setTitleInput(templateName);
      setIsEditingTitle(false);
    }
  };

  return (
    <header className="h-[53px] bg-white border-b border-gray-200 px-4 flex items-center justify-between select-none z-30 shadow-2xs">
      {/* ── LEFT: Back + Document Title ── */}
      <div className="flex items-center gap-3">
        <Link
          href="/templates"
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          title="ย้อนกลับไปหน้ารายการเทมเพลต"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                {isSlide ? `${categoryName} • Presentation (16:9)` : categoryName || "A4 Template"}
              </span>
            </div>

            {isEditingTitle ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="text-sm font-bold text-gray-900 bg-gray-50 border border-indigo-500 rounded px-2 py-0.5 outline-none"
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => {
                  setTitleInput(templateName || (isSlide ? "เทมเพลตสไลด์ใหม่ (16:9)" : "เทมเพลตเอกสารใหม่ (A4)"));
                  setIsEditingTitle(true);
                }}
                className="group flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded -ml-1 transition-colors"
                title="คลิกเพื่อเปลี่ยนชื่อเทมเพลต"
              >
                <h1 className="text-sm font-bold text-gray-900 leading-tight">
                  {templateName || (isSlide ? "เทมเพลตสไลด์ใหม่ (16:9)" : "เทมเพลตเอกสารใหม่ (A4)")}
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

      {/* ── RIGHT: Preview & Save Button ── */}
      <div className="flex items-center gap-2">
        {/* Token Preview Toggle */}
        {onTogglePreviewTokens && (
          <button
            onClick={onTogglePreviewTokens}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isPreviewTokens
                ? "bg-amber-500 text-white border-amber-600 shadow-xs animate-pulse"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
            title={isPreviewTokens ? "คลิกเพื่อสลับกลับไปดูชื่อตัวแปร {{...}}" : "คลิกเพื่อแสดงตัวอย่างข้อมูลจริง"}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPreviewTokens ? "พรีวิวข้อมูลจริง (ON)" : "พรีวิวข้อมูลจริง"}</span>
          </button>
        )}

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