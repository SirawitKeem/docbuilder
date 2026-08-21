"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { QuotationDataProvider, useQuotationData } from "@/context/QuotationDataContext";
import { quotationTemplate } from "@/lib/templates/quotation/schema";
import { getQuotation, createQuotation, updateQuotation } from "@/lib/data/quotations";
import { getFieldProfile } from "@/lib/data/fieldProfiles";
import { paginateQuotationLineItems } from "@/lib/quotationHelpers";
import QuotationDocument from "./QuotationDocument";
import EditorToolbar from "../EditorToolbar";
import DocumentCanvas from "../DocumentCanvas";
import PageControls from "../PageControls";
import ReviewScreen from "../ReviewScreen";
import EmailScreen from "../EmailScreen";
import SuccessScreen from "../SuccessScreen";

function fileNameFor(quotationNo) {
  return `${quotationNo || "Quotation"}.pdf`;
}

async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function QuotationEditorContent({ docId }) {
  const router = useRouter();
  const { quotation, setQuotation, readOnly, setReadOnly } = useQuotationData();

  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [mode, setMode] = useState("edit"); // edit | review | email | success
  const [pdfBase64, setPdfBase64] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [activeDocId, setActiveDocId] = useState(docId || null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [showToast, setShowToast] = useState(null);

  const fileName = fileNameFor(quotation.quotationNo);
  const pageCount = paginateQuotationLineItems(quotation.lineItems).length;

  const handleSaveDocument = async () => {
    setIsSaving(true);
    try {
      let result;
      if (activeDocId) {
        result = await updateQuotation(activeDocId, quotation);
      } else {
        result = await createQuotation(quotation);
        if (result?.id) {
          setActiveDocId(result.id);
          setQuotation((prev) => ({ ...prev, id: result.id, quotationNo: result.quotationNo }));
        }
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
      let targetId = activeDocId;
      if (!targetId) {
        const created = await createQuotation(quotation);
        targetId = created.id;
        setActiveDocId(created.id);
        setQuotation((prev) => ({ ...prev, id: created.id, quotationNo: created.quotationNo }));
      } else {
        await updateQuotation(activeDocId, quotation);
      }

      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: "quotation",
          quotationData: { ...quotation, id: targetId },
          fileName,
        }),
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
        defaultSubject={`ใบเสนอราคา ${quotation.quotationNo || "Quotation"}`}
        fileName={fileName}
        attachmentBase64={pdfBase64}
        templateId="quotation"
        templateName="ใบเสนอราคา (Quotation)"
        values={quotation}
        onBack={() => setMode("edit")}
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
        template={{
          fullName: "ใบเสนอราคา (Quotation)",
          name: "Quotation",
          logo: quotationTemplate.logo,
          pageCount: pageCount,
          isCustomDoc: true,
        }}
        pages={Array.from({ length: pageCount }, (_, i) => () => <QuotationDocument currentPage={i + 1} />)}
        status={{ isComplete: true, filled: 1, total: 1 }}
        onExport={handleDownload}
        onSendEmail={handleGoToEmail}
        exporting={generating}
        onBackToEdit={() => setReadOnly(false)}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 size={16} className="text-success-600" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Editor Toolbar */}
      <EditorToolbar
        template={{
          fullName: `ใบเสนอราคา ${quotation.quotationNo || ""}`,
        }}
        status={{ isComplete: true, filled: 1, total: 1 }}
        onPreview={() => setReadOnly(true)}
        onExport={handleDownload}
        exporting={generating}
        onSave={handleSaveDocument}
        isSaving={isSaving}
        savedAt={savedAt}
      />

      {/* A4 Document Canvas Wrapper */}
      <div className="flex-1 min-h-0 flex bg-gray-100/90 overflow-y-auto justify-center pt-8 pb-36">
        <div
          style={{
            width: 794,
            height: 1123,
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          <QuotationDocument currentPage={currentPage} />
        </div>
      </div>

      {/* Page Controls Footer */}
      <PageControls
        currentPage={currentPage}
        totalPages={pageCount}
        zoom={zoom}
        onPrevPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNextPage={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
        onZoomOut={() => setZoom((z) => Math.max(50, z - 10))}
        onZoomIn={() => setZoom((z) => Math.min(150, z + 10))}
        onFullscreen={() => {}}
      />
    </div>
  );
}

export default function QuotationEditor({ docId, profileId }) {
  const [initialQuotation, setInitialQuotation] = useState(null);

  useEffect(() => {
    async function initData() {
      if (docId) {
        const existing = await getQuotation(docId);
        if (existing) {
          setInitialQuotation({
            ...existing,
            billTo: existing.billTo || {},
            lineItems: existing.lineItems || quotationTemplate.defaultLineItems,
          });
          return;
        }
      }

      let prefilledBillTo = {};
      let senderPhone = "02-123-4567";

      if (profileId) {
        const profile = await getFieldProfile(profileId);
        if (profile?.values) {
          const val = profile.values;
          prefilledBillTo = {
            companyName: val.bill_to_company || val.counterparty_name || "",
            attn: val.attn_name || val.counterparty_signatory_name || "",
            endUser: val.end_user || val.bill_to_company || "",
            subject: val.subject || "CDNetworks Annual Services (WAF+DDoS+BOT)",
            am: val.am_name || val.our_signatory_name || "",
          };
          senderPhone = val.am_phone || senderPhone;
        }
      }

      const todayStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      const validityStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      setInitialQuotation({
        id: "",
        quotationNo: "CZ2608063",
        quotationDate: todayStr,
        priceValidity: validityStr,
        deliveryTerm: "7 days",
        creditTerm: "30 days",
        billTo: prefilledBillTo,
        lineItems: quotationTemplate.defaultLineItems,
        vatRate: 7,
        remarks: "Payment: Annually",
        senderName: "Narin Rattanavajij (PoP)",
        senderPhone: senderPhone,
      });
    }

    initData();
  }, [docId, profileId]);

  if (!initialQuotation) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400 font-medium text-sm">
        กำลังโหลดใบเสนอราคา...
      </div>
    );
  }

  return (
    <QuotationDataProvider initialQuotation={initialQuotation}>
      <QuotationEditorContent docId={docId} />
    </QuotationDataProvider>
  );
}
