"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { DocumentFieldsProvider, useDocumentFields } from "@/context/DocumentFieldsContext";
import { templateRegistry, getCompletionStatus } from "@/lib/templates/registry";
import { getFieldProfile } from "@/lib/data/fieldProfiles";
import EditorToolbar from "./EditorToolbar";
import DocumentCanvas from "./DocumentCanvas";
import PageControls from "./PageControls";
import ReviewScreen from "./ReviewScreen";
import EmailScreen from "./EmailScreen";
import SuccessScreen from "./SuccessScreen";

function fileNameFor(prefix) {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear() + 543;
  return `${prefix}_${dd}-${mm}-${yyyy}.pdf`;
}

async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function EditorContent({ templateId, initialDocId }) {
  const router = useRouter();
  const { schema, pages } = templateRegistry[templateId];
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [mode, setMode] = useState("edit"); // edit | review | email | success
  const [pdfBase64, setPdfBase64] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [activeDocId, setActiveDocId] = useState(initialDocId || null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const { readOnly, setReadOnly, values } = useDocumentFields();

  const fileName = fileNameFor(schema.name.replace(/\s+/g, ""));
  const status = getCompletionStatus(values, templateId);

  // ปุ่ม บันทึกเอกสาร (Save Document) - บันทึกลง "เอกสารของฉัน" เฉพาะเมื่อคลิกปุ่มนี้เท่านั้น
  const handleSaveDocument = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(activeDocId ? { id: activeDocId } : {}),
          name: fileName,
          templateId,
          templateName: schema.fullName,
          values,
          status: "draft",
        }),
      });

      if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
      const record = await res.json();
      if (record?.id) {
        setActiveDocId(record.id);
      }
      const timeStr = new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.";
      setSavedAt(timeStr);
      setShowToast("บันทึกเอกสารลง 'เอกสารของฉัน' เรียบร้อยแล้ว");
      setTimeout(() => setShowToast(null), 3000);
    } catch (err) {
      console.error("Save document error:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกเอกสาร");
    } finally {
      setIsSaving(false);
    }
  };

  const generatePdf = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, values, fileName }),
      });
      if (!res.ok) throw new Error("สร้าง PDF ไม่สำเร็จ");
      const blob = await res.blob();
      const base64 = await blobToBase64(blob);
      setPdfBase64(base64);
      return { blob, base64 };
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    const { blob } = pdfBase64
      ? { blob: await (await fetch(`data:application/pdf;base64,${pdfBase64}`)).blob() }
      : await generatePdf();

    // 1. ลองใช้ File System Access API (เปิดหน้าต่าง "Save As...")
    if ("showSaveFilePicker" in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: "PDF Document",
              accept: { "application/pdf": [".pdf"] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    // 2. Fallback
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGoToEmail = async () => {
    if (!pdfBase64) await generatePdf();
    setMode("email");
  };

  if (mode === "success") {
    return <SuccessScreen fileName={fileName} sentTo={sentTo} onCreateNew={() => router.push("/create")} />;
  }

  if (mode === "email") {
    return (
      <EmailScreen
        defaultSubject={schema.fullName}
        fileName={fileName}
        attachmentBase64={pdfBase64}
        templateId={templateId}
        templateName={schema.fullName}
        values={values}
        onBack={() => setMode("review")}
        onSent={({ to }) => {
          setSentTo(to);
          setMode("success");
        }}
      />
    );
  }

  if (readOnly) {
    return (
      <ReviewScreen
        template={schema}
        pages={pages}
        status={status}
        onExport={handleDownload}
        onSendEmail={handleGoToEmail}
        exporting={generating}
      />
    );
  }

  const PageContent = pages[currentPage - 1];

  return (
    <div className="flex flex-col h-screen relative">
      {/* Toast แจ้งเตือนเมื่อกดบันทึกสำเร็จ */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 size={16} className="text-success-600" />
          <span>{showToast}</span>
        </div>
      )}

      <EditorToolbar
        template={schema}
        status={status}
        onPreview={() => setReadOnly(true)}
        onExport={handleDownload}
        exporting={generating}
        onSave={handleSaveDocument}
        isSaving={isSaving}
        savedAt={savedAt}
      />
      <div className="flex-1 min-h-0 flex">
        <DocumentCanvas
          logo={schema.logo}
          footerTitle={schema.fullName}
          currentPage={currentPage}
          totalPages={schema.pageCount}
          zoom={zoom}
        >
          <PageContent />
        </DocumentCanvas>
      </div>
      <PageControls
        currentPage={currentPage}
        totalPages={schema.pageCount}
        zoom={zoom}
        onPrevPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNextPage={() => setCurrentPage((p) => Math.min(schema.pageCount, p + 1))}
        onZoomOut={() => setZoom((z) => Math.max(50, z - 10))}
        onZoomIn={() => setZoom((z) => Math.min(150, z + 10))}
        onFullscreen={() => {}}
      />
    </div>
  );
}

export default function DocumentEditor({ templateId, profileId, docId }) {
  const [initialValues, setInitialValues] = useState(null); // null = กำลังโหลด
  const [loadedDocId, setLoadedDocId] = useState(docId || null);

  useEffect(() => {
    const { schema } = templateRegistry[templateId];

    async function load() {
      // 1. หากเป็นการเปิดแก้ไขเอกสารเดิมที่เคยบันทึกไว้ (มี docId)
      if (docId) {
        try {
          const res = await fetch(`/api/documents?id=${docId}`);
          if (res.ok) {
            const doc = await res.json();
            setInitialValues(doc.values || {});
            setLoadedDocId(doc.id);
            return;
          }
        } catch (err) {
          console.error("Load document error:", err);
        }
      }

      // 2. หากเป็นการเลือกใช้ Profile Data
      if (profileId) {
        const profile = await getFieldProfile(profileId);
        const prefilled = {};
        if (profile?.values) {
          for (const field of schema.fields) {
            if (field.sharedKey && profile.values[field.sharedKey]) {
              prefilled[field.id] = profile.values[field.sharedKey];
            }
          }
        }
        setInitialValues(prefilled);
        return;
      }

      // 3. เริ่มจากเอกสารเปล่า
      setInitialValues({});
    }

    load();
  }, [templateId, profileId, docId]);

  if (initialValues === null) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400 font-medium text-sm">
        กำลังโหลดเอกสาร...
      </div>
    );
  }

  return (
    <DocumentFieldsProvider initialValues={initialValues}>
      <EditorContent templateId={templateId} initialDocId={loadedDocId} />
    </DocumentFieldsProvider>
  );
}