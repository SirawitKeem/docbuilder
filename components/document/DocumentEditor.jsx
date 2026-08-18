"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentFieldsProvider, useDocumentFields } from "@/context/DocumentFieldsContext";
import { templateRegistry, getCompletionStatus } from "@/lib/templates/registry";
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

function EditorContent({ templateId }) {
  const router = useRouter();
  const { schema, pages } = templateRegistry[templateId];
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [mode, setMode] = useState("edit"); // edit | review | email | success
  const [pdfBase64, setPdfBase64] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const { readOnly, setReadOnly, values } = useDocumentFields();

  const fileName = fileNameFor(schema.name.replace(/\s+/g, ""));
  const status = getCompletionStatus(values, templateId);

  const generatePdf = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, values }),
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
    <div className="flex flex-col h-screen">
      <EditorToolbar
        template={schema}
        status={status}
        onPreview={() => setReadOnly(true)}
        onExport={handleDownload}
        exporting={generating}
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

export default function DocumentEditor({ templateId }) {
  return (
    <DocumentFieldsProvider>
      <EditorContent templateId={templateId} />
    </DocumentFieldsProvider>
  );
}