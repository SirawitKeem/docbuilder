"use client";

import { useState } from "react";
import { DocumentFieldsProvider, useDocumentFields } from "@/context/DocumentFieldsContext";
import { ndaTemplate } from "@/lib/templates/nda/schema";
import EditorToolbar from "@/components/document/EditorToolbar";
import DocumentCanvas from "@/components/document/DocumentCanvas";
import PageControls from "@/components/document/PageControls";
import ReviewScreen from "@/components/document/ReviewScreen";
import EmailScreen from "@/components/document/EmailScreen";
import SuccessScreen from "@/components/document/SuccessScreen";
import NdaPage1 from "@/components/document/nda/NdaPage1";
import NdaPage2 from "@/components/document/nda/NdaPage2";
import NdaPage3 from "@/components/document/nda/NdaPage3";
import NdaPage4 from "@/components/document/nda/NdaPage4";

const pages = { 1: NdaPage1, 2: NdaPage2, 3: NdaPage3, 4: NdaPage4 };

function NdaEditorContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [mode, setMode] = useState("edit"); // "edit" | "review" | "email" | "success"
  const [pdfBase64, setPdfBase64] = useState("");
  const [exporting, setExporting] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const { values, readOnly, setReadOnly } = useDocumentFields();

  const fileName = `NDA_${new Date().toLocaleDateString("th-TH").replace(/\//g, "-")}.pdf`;

  const getOrGeneratePdf = async () => {
    if (pdfBase64) return { base64: pdfBase64 };
    setExporting(true);
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
      });
      if (!res.ok) {
        alert("สร้าง PDF ไม่สำเร็จ");
        return null;
      }
      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      setPdfBase64(base64);
      return { blob, base64 };
    } catch (err) {
      console.error("PDF Export error:", err);
      alert("เกิดข้อผิดพลาดในการสร้าง PDF");
      return null;
    } finally {
      setExporting(false);
    }
  };

  const handleExport = async () => {
    const pdfData = await getOrGeneratePdf();
    if (!pdfData) return;
    
    // Convert base64 to Blob for downloading
    const byteCharacters = atob(pdfData.base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmailClick = async () => {
    if (!pdfBase64) {
      const pdfData = await getOrGeneratePdf();
      if (!pdfData) return;
    }
    setMode("email");
  };

  const handleCreateNew = () => {
    setPdfBase64("");
    setSentTo("");
    setReadOnly(false);
    setMode("edit");
    setCurrentPage(1);
  };

  if (mode === "success") {
    return (
      <SuccessScreen
        fileName={fileName}
        sentTo={sentTo}
        onCreateNew={handleCreateNew}
      />
    );
  }

  if (mode === "email") {
    return (
      <EmailScreen
        defaultSubject="หนังสือสัญญาไม่เปิดเผยข้อมูล"
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
        exporting={exporting}
        onExport={handleExport}
        onSendEmail={handleSendEmailClick}
      />
    );
  }

  const PageContent = pages[currentPage];

  return (
    <div className="flex flex-col h-screen">
      <EditorToolbar
        exporting={exporting}
        onPreview={() => setReadOnly(true)}
        onExport={handleExport}
      />
      <div className="flex-1 min-h-0 flex">
        <DocumentCanvas
          logo={ndaTemplate.logo}
          footerTitle="NON-DISCLOSURE AGREEMENT"
          currentPage={currentPage}
          totalPages={ndaTemplate.pageCount}
          zoom={zoom}
        >
          <PageContent />
        </DocumentCanvas>
      </div>
      <PageControls
        currentPage={currentPage}
        totalPages={ndaTemplate.pageCount}
        zoom={zoom}
        onPrevPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNextPage={() => setCurrentPage((p) => Math.min(ndaTemplate.pageCount, p + 1))}
        onZoomOut={() => setZoom((z) => Math.max(50, z - 10))}
        onZoomIn={() => setZoom((z) => Math.min(150, z + 10))}
        onFullscreen={() => {}}
      />
    </div>
  );
}

export default function NdaEditorPage() {
  return (
    <DocumentFieldsProvider>
      <NdaEditorContent />
    </DocumentFieldsProvider>
  );
}