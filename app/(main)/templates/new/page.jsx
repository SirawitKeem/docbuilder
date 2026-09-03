"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamic import for DocumentEditor with SSR disabled
const DocumentEditor = dynamic(
  () => import("./components/editor/DocumentEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[85vh] bg-[#F1F3F6]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-700">กำลังเตรียม Document Studio...</p>
        </div>
      </div>
    ),
  }
);

// Dynamic import for SheetEditor with SSR disabled
const SheetEditor = dynamic(
  () => import("./components/sheet/SheetEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[85vh] bg-[#F8FAFC]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-700">กำลังเตรียม Spreadsheet Studio (.xlsx)...</p>
        </div>
      </div>
    ),
  }
);

function TemplateBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams.get("categoryId") || "notification";
  const editorTypeParam = searchParams.get("editorType") || "document";
  const canvasPresetParam = searchParams.get("canvasPreset") || "a4-portrait";
  const editId = searchParams.get("edit");

  const [categoryId, setCategoryId] = useState(categoryIdParam);
  const [editorType, setEditorType] = useState(editorTypeParam);
  const [canvasPreset, setCanvasPreset] = useState(canvasPresetParam);
  const [categoryName, setCategoryName] = useState("Notification Letter");
  const [templateName, setTemplateName] = useState(editorTypeParam === "sheet" ? "New Spreadsheet Template" : "เทมเพลตเอกสารใหม่ (A4)");
  const [initialPages, setInitialPages] = useState(null);
  const [initialSheetData, setInitialSheetData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 1. If edit mode (load existing template from Database)
    if (editId) {
      fetch(`/api/templates/${editId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((tmpl) => {
          if (tmpl) {
            if (tmpl.name) setTemplateName(tmpl.name);
            if (tmpl.categoryId) setCategoryId(tmpl.categoryId);
            if (tmpl.editorType) setEditorType(tmpl.editorType);
            if (tmpl.canvasPreset) setCanvasPreset(tmpl.canvasPreset);
            if (tmpl.pages && Array.isArray(tmpl.pages) && tmpl.pages.length > 0) {
              setInitialPages(tmpl.pages);
            }
            if (tmpl.sheetData && Array.isArray(tmpl.sheetData) && tmpl.sheetData.length > 0) {
              setInitialSheetData(tmpl.sheetData);
            }

            // Fetch category details based on the template's actual category
            const targetCat = tmpl.categoryId || categoryIdParam;
            fetch("/api/categories")
              .then((res) => (res.ok ? res.json() : []))
              .then((cats) => {
                if (Array.isArray(cats)) {
                  const match = cats.find((c) => c.id === targetCat);
                  if (match) setCategoryName(match.name);
                }
              })
              .catch((err) => console.error("Error fetching categories for edit:", err));
          }
        })
        .catch((err) => console.error("Error fetching template:", err));
    } else {
      // 2. New template mode: Fetch Category details from query param
      fetch("/api/categories")
        .then((res) => (res.ok ? res.json() : []))
        .then((cats) => {
          if (Array.isArray(cats)) {
            const match = cats.find((c) => c.id === categoryIdParam);
            if (match) setCategoryName(match.name);
          }
        })
        .catch((err) => console.error("Error fetching categories:", err));
    }
  }, [categoryIdParam, editId]);

  const handleSave = async (editorData) => {
    setSaving(true);
    try {
      const activeEditorType = editorData?.editorType || editorType || "document";
      const isSheet = activeEditorType === "sheet";

      const payload = {
        name: editorData?.name || templateName || (isSheet ? "New Spreadsheet Template" : "เทมเพลตใหม่"),
        categoryId: categoryId || categoryIdParam,
        editorType: activeEditorType,
        canvasPreset: isSheet ? null : editorData?.canvasPreset || canvasPreset || "a4-portrait",
        description: isSheet ? `เทมเพลตสเปรดชีต ${categoryName}` : `เทมเพลต ${categoryName} จำนวน ${editorData?.pageCount || 1} หน้า`,
        icon: isSheet ? "Table" : "FileText",
        badge: "กำหนดเอง",
        status: "published",
        orientation: isSheet ? "landscape" : "portrait",
        pageCount: isSheet ? 0 : editorData?.pageCount || 1,
        pages: isSheet ? [] : editorData?.pages || [],
        sheetData: isSheet ? editorData?.sheetData || [] : [],
        theme: {
          primaryColor: isSheet ? "#059669" : "#5542F6",
          backgroundColor: "#FFFFFF",
          hasWatermark: false,
        },
      };

      const url = editId ? `/api/templates/${editId}` : "/api/templates";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "เกิดข้อผิดพลาดในการบันทึกเทมเพลต");
      }

      alert("🎉 บันทึกเทมเพลตลงฐานข้อมูลสำเร็จเรียบร้อยแล้ว!");
      router.push("/templates");
    } catch (err) {
      console.error("Save error:", err);
      alert(`⚠️ ไม่สามารถบันทึกได้: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (editorType === "sheet") {
    return (
      <SheetEditor
        templateName={templateName}
        categoryName={categoryName}
        initialSheetData={initialSheetData}
        onSave={handleSave}
        saving={saving}
      />
    );
  }

  return (
    <DocumentEditor
      templateName={templateName}
      categoryName={categoryName}
      editorType={editorType}
      canvasPreset={canvasPreset}
      initialPages={initialPages}
      onSave={handleSave}
      saving={saving}
    />
  );
}

export default function TemplateBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-gray-500">
          กำลังโหลดหน้าสร้างเทมเพลต...
        </div>
      }
    >
      <TemplateBuilderContent />
    </Suspense>
  );
}