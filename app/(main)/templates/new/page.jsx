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
          <p className="text-sm font-semibold text-gray-700">กำลังเตรียม A4 Document Studio...</p>
        </div>
      </div>
    ),
  }
);

function TemplateBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams.get("categoryId") || "notification";
  const editId = searchParams.get("edit");

  const [categoryName, setCategoryName] = useState("Notification Letter");
  const [templateName, setTemplateName] = useState("เทมเพลตเอกสารใหม่ (A4)");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch Category details
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : []))
      .then((cats) => {
        if (Array.isArray(cats)) {
          const match = cats.find((c) => c.id === categoryIdParam);
          if (match) setCategoryName(match.name);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));

    // If edit mode
    if (editId) {
      fetch(`/api/templates/${editId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((tmpl) => {
          if (tmpl && tmpl.name) {
            setTemplateName(tmpl.name);
          }
        })
        .catch((err) => console.error("Error fetching template:", err));
    }
  }, [categoryIdParam, editId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Phase 1 basic save notification
      alert("✨ Phase 1 Studio พร้อมใช้งาน! (ระบบบันทึกแบบ Full JSON จะถูกผูกใน Phase 6)");
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DocumentEditor
      templateName={templateName}
      categoryName={categoryName}
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