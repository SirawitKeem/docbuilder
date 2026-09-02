"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  FileText,
  Receipt,
  FileSignature,
  Building2,
  Handshake,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Edit3,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

function TemplateBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const categoryIdParam = searchParams.get("categoryId");

  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [zoomScale, setZoomScale] = useState(0.85);

  // Template State (Pure A4 document state)
  const [templateData, setTemplateData] = useState({
    name: "เทมเพลตเอกสารใหม่ (A4)",
    categoryId: categoryIdParam || "quotation",
    description: "",
    icon: "FileText",
    badge: "กำหนดเอง",
    orientation: "portrait", // "portrait" | "landscape"
    status: "published",
    theme: {
      primaryColor: "#5542F6",
      backgroundColor: "#FFFFFF",
      hasWatermark: false,
    },
    blocks: [],
  });

  useEffect(() => {
    // 1. Load Categories matching /create
    fetch("/api/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          if (categoryIdParam) {
            setTemplateData((prev) => ({ ...prev, categoryId: categoryIdParam }));
          } else if (!templateData.categoryId) {
            setTemplateData((prev) => ({ ...prev, categoryId: data[0].id }));
          }
        }
      })
      .catch((err) => console.error("Error loading categories:", err));

    // 2. If editing existing template
    if (editId) {
      setIsEditMode(true);
      fetch(`/api/templates/${editId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((tmpl) => {
          if (tmpl) {
            setTemplateData({
              name: tmpl.name || "เทมเพลตไม่มีชื่อ",
              categoryId: tmpl.categoryId || "quotation",
              description: tmpl.description || "",
              icon: tmpl.icon || "FileText",
              badge: tmpl.badge || "กำหนดเอง",
              orientation: tmpl.orientation || "portrait",
              status: tmpl.status || "published",
              theme: tmpl.theme || {
                primaryColor: "#5542F6",
                backgroundColor: "#FFFFFF",
                hasWatermark: false,
              },
              blocks: Array.isArray(tmpl.blocks) ? tmpl.blocks : [],
            });
          }
        })
        .catch((err) => console.error("Error loading template for edit:", err));
    }
  }, [editId, categoryIdParam]);

  // Save Template Handler
  const handleSaveTemplate = async () => {
    if (!templateData.name.trim()) {
      setErrorMsg("กรุณาระบุชื่อเทมเพลต");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const url = isEditMode ? `/api/templates/${editId}` : "/api/templates";
      const method = isEditMode ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "บันทึกเทมเพลตไม่สำเร็จ");

      setSuccessMsg("บันทึกเทมเพลตเรียบร้อยแล้ว");
      setTimeout(() => {
        router.push("/templates");
      }, 700);
    } catch (err) {
      setErrorMsg(err.message);
      setSaving(false);
    }
  };

  const isLandscape = templateData.orientation === "landscape";
  const paperWidth = isLandscape ? 1123 : 794;
  const paperHeight = isLandscape ? 794 : 1123;

  return (
    <div className="space-y-4 text-left pb-16 min-h-screen">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-2xs cursor-pointer"
            title="ย้อนกลับไปคลังเทมเพลต"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">คลังเทมเพลต /</span>
              <span className="text-xs font-bold text-[#5542F6]">
                {isEditMode ? "แก้ไขเทมเพลต" : "สร้างเทมเพลตใหม่"}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#5542F6] border border-purple-100">
                {isLandscape ? "แนวนอน (Landscape)" : "แนวตั้ง (Portrait)"}
              </span>
            </div>
            {/* Inline Renaming */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="text"
                value={templateData.name}
                onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
                placeholder="ระบุชื่อเทมเพลต..."
                className="text-base font-black text-gray-900 leading-tight bg-transparent outline-none border-b border-transparent hover:border-gray-300 focus:border-[#5542F6] transition-colors min-w-[260px]"
              />
              <Edit3 size={14} className="text-gray-400 shrink-0" />
            </div>
          </div>
        </div>

        {/* Toolbar Center / Right */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Category Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <span className="text-xs text-gray-500 font-semibold">หมวดหมู่:</span>
            <select
              value={templateData.categoryId}
              onChange={(e) => setTemplateData({ ...templateData, categoryId: e.target.value })}
              className="bg-transparent text-xs font-bold text-gray-800 outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Orientation Button */}
          <button
            type="button"
            onClick={() =>
              setTemplateData({
                ...templateData,
                orientation: isLandscape ? "portrait" : "landscape",
              })
            }
            className="px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="เปลี่ยนการวางแนวกระดาษ"
          >
            <FileSpreadsheet size={15} className="text-[#5542F6]" />
            <span>{isLandscape ? "สลับเป็นแนวตั้ง (A4)" : "สลับเป็นแนวนอน (A4)"}</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setZoomScale((s) => Math.max(0.4, Number((s - 0.1).toFixed(1))))}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-gray-600 transition-colors cursor-pointer"
              title="ซูมออก"
            >
              <ZoomOut size={13} />
            </button>
            <span className="text-[11px] font-mono font-bold px-1.5 text-gray-600">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomScale((s) => Math.min(1.5, Number((s + 0.1).toFixed(1))))}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-gray-600 transition-colors cursor-pointer"
              title="ซูมเข้า"
            >
              <ZoomIn size={13} />
            </button>
            <button
              type="button"
              onClick={() => setZoomScale(0.85)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 hover:text-gray-600 transition-colors cursor-pointer ml-0.5"
              title="รีเซ็ตซูม 85%"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSaveTemplate}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#5542F6] hover:bg-[#4332D6] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Save size={15} />
            <span>{saving ? "กำลังบันทึก..." : "บันทึกเทมเพลต"}</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold flex items-center gap-2">
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Pure A4 Paper Workspace (Centered, clean A4 canvas) */}
      <div className="w-full bg-gray-100/80 rounded-2xl border border-gray-200/80 p-8 sm:p-12 flex justify-center items-start min-h-[85vh] overflow-auto">
        <div
          style={{
            width: paperWidth * zoomScale,
            minHeight: paperHeight * zoomScale,
            backgroundColor: "#FFFFFF",
          }}
          className="rounded-sm shadow-2xl border border-gray-300 transition-all relative flex flex-col justify-between"
        >
          {/* Pure Empty A4 Content */}
          <div className="flex-1 p-8 sm:p-12 flex flex-col justify-between">
            {/* Header Area placeholder */}
            <div className="w-full border-b border-gray-100 pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-800">{templateData.name}</p>
                  <p className="text-[10px] text-gray-400">
                    ขนาดมาตรฐาน A4 ({isLandscape ? "297 x 210 mm แนวนอน" : "210 x 297 mm แนวตั้ง"})
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-200">
                  A4 Canvas
                </span>
              </div>
            </div>

            {/* Middle Empty Canvas Area */}
            <div className="flex-1 flex flex-col items-center justify-center my-12 text-center text-gray-300">
              <p className="text-sm font-semibold text-gray-400">หน้ากระดาษ A4 เปล่า (Blank Canvas)</p>
              <p className="text-xs text-gray-300 mt-1">
                เอกสารพร้อมสำหรับบันทึกเป็นแม่แบบเทมเพลตในระบบ
              </p>
            </div>

            {/* Footer Area */}
            <div className="w-full border-t border-gray-100 pt-4 flex justify-between items-center text-[10px] text-gray-400">
              <span>DocBuilder Template Studio</span>
              <span>หน้า 1 / 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplateBuilderPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-xs text-gray-500">กำลังโหลดหน้าสร้างเทมเพลต...</div>}>
      <TemplateBuilderContent />
    </React.Suspense>
  );
}
