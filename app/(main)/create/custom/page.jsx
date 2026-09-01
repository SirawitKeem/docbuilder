"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Download,
  Send,
  Sparkles,
  Eye,
  CheckCircle2,
  FileText,
  Building2,
  Calendar,
  Layers,
  Stamp,
  FileSignature,
  Printer,
  X,
  Clock,
  RotateCcw,
} from "lucide-react";
import CorporateSeal from "@/components/document/CorporateSeal";
import SignaturePadModal from "@/components/document/SignaturePadModal";
import EmailScreen from "@/components/document/EmailScreen";

const WATERMARK_OPTIONS = [
  { id: "none", label: "ไม่มีลายน้ำ (ต้นฉบับ)", badge: "Original" },
  { id: "draft", label: "ฉบับร่าง (DRAFT)", badge: "Draft" },
  { id: "copy", label: "สำเนาถูกต้อง (COPY)", badge: "Copy" },
  { id: "confidential", label: "ลับเฉพาะ (CONFIDENTIAL)", badge: "Confidential" },
];

function UniversalDocumentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");
  const documentId = searchParams.get("documentId");

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [documentStatus, setDocumentStatus] = useState("draft");

  // Dynamic values state
  const [values, setValues] = useState({});
  const [watermark, setWatermark] = useState("none");
  const [showSeal, setShowSeal] = useState(false);
  const [signatures, setSignatures] = useState({});
  const [activeSigSlot, setActiveSigSlot] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState("");

  // Load Template Schema & Document
  useEffect(() => {
    async function loadData() {
      if (!templateId) {
        setErrorMsg("ไม่พบรหัสเทมเพลต (Template ID is missing)");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const tmplRes = await fetch(`/api/templates/${templateId}`);
        if (!tmplRes.ok) throw new Error("ไม่พบเทมเพลตนี้ในระบบ");
        const tmplData = await tmplRes.json();
        setTemplate(tmplData);

        // Initial default values
        const initialValues = {};
        (tmplData.fields || []).forEach((f) => {
          initialValues[f.id] = f.defaultValue || "";
        });

        // Set default security policies from template
        if (tmplData.contentLayout) {
          setShowSeal(tmplData.contentLayout.hasSeal || false);
          setWatermark(tmplData.contentLayout.defaultWatermark || "none");
        }

        // If editing existing document
        if (documentId) {
          const docRes = await fetch("/api/documents");
          if (docRes.ok) {
            const allDocs = await docRes.json();
            const existingDoc = (allDocs || []).find((d) => d.id === documentId);
            if (existingDoc) {
              setDocumentName(existingDoc.name || "");
              setDocumentStatus(existingDoc.status || "draft");
              if (existingDoc.values) {
                Object.assign(initialValues, existingDoc.values);
              }
              if (existingDoc.values?.signatures) {
                setSignatures(existingDoc.values.signatures);
              }
              if (existingDoc.values?.watermark) {
                setWatermark(existingDoc.values.watermark);
              }
              if (existingDoc.values?.showSeal !== undefined) {
                setShowSeal(existingDoc.values.showSeal);
              }
            }
          }
        } else {
          setDocumentName(`${tmplData.name} - ${new Date().toLocaleDateString("th-TH")}`);
        }

        setValues(initialValues);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [templateId, documentId]);

  const handleFieldChange = (fieldId, val) => {
    setValues((prev) => ({ ...prev, [fieldId]: val }));
  };

  // Interpolate body text for live rendering
  const interpolatedContent = useMemo(() => {
    if (!template?.contentLayout?.bodyMarkdown) return "";

    let text = template.contentLayout.bodyMarkdown;

    // System variables
    text = text.replace(/\{\{company_name\}\}/g, "บริษัท เครสท์ เซนโด จำกัด");
    text = text.replace(
      /\{\{current_date\}\}/g,
      new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
    text = text.replace(/\{\{document_id\}\}/g, documentId || `DOC-${Date.now().toString().slice(-6)}`);

    // Field variables
    (template.fields || []).forEach((f) => {
      const val = values[f.id];
      const displayVal = val !== undefined && val !== "" ? val : `[${f.label}]`;
      const regex = new RegExp(`\\{\\{${f.id}\\}\\}`, "g");
      text = text.replace(
        regex,
        `<span class="font-bold text-gray-900 border-b border-gray-300 px-1">${displayVal}</span>`
      );
    });

    return text;
  }, [template, values, documentId]);

  // Save Document
  const handleSaveDocument = async (status = "draft") => {
    setIsSaving(true);
    try {
      const docPayload = {
        name: documentName.trim() || template.name,
        templateId: template.id,
        templateName: template.name,
        templateVersion: template.version || 1,
        status,
        values: {
          ...values,
          signatures,
          watermark,
          showSeal,
        },
      };

      let res;
      if (documentId) {
        res = await fetch("/api/documents", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: documentId, ...docPayload }),
        });
      } else {
        res = await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(docPayload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "บันทึกเอกสารไม่สำเร็จ");

      setDocumentStatus(status);
      setSaveToast("✅ บันทึกเอกสารเรียบร้อยแล้ว");
      setTimeout(() => setSaveToast(""), 3500);

      if (!documentId && data.id) {
        router.replace(`/create/custom?templateId=${template.id}&documentId=${data.id}`);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#5542F6] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-500 font-medium">กำลังเตรียมพร้อมเครื่องมือสร้างเอกสาร...</p>
      </div>
    );
  }

  if (errorMsg || !template) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
          ⚠️ {errorMsg || "ไม่พบข้อมูลเทมเพลต"}
        </div>
        <Link
          href="/templates"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5542F6] text-white text-xs font-bold shadow-xs hover:bg-[#4332D6]"
        >
          <ArrowLeft size={15} />
          <span>กลับไปยังคลังเทมเพลต</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-left pb-20">
      {/* Top Header & Quick Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-gray-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-2xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">เทมเพลต / {template.name}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  documentStatus === "completed"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {documentStatus === "completed" ? "เสร็จสมบูรณ์" : "ฉบับร่าง"}
              </span>
            </div>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="ชื่อเอกสาร..."
              className="text-base sm:text-lg font-black text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#5542F6] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {saveToast && (
            <span className="text-xs font-bold text-emerald-600 animate-in fade-in duration-150">
              {saveToast}
            </span>
          )}

          <button
            type="button"
            onClick={() => handleSaveDocument("draft")}
            disabled={isSaving}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <Save size={14} className="text-gray-400" />
            <span>{isSaving ? "กำลังบันทึก..." : "บันทึกฉบับร่าง"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveDocument("completed")}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 size={14} />
            <span>เสร็จสมบูรณ์</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5542F6] hover:bg-[#4332D6] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Printer size={14} />
            <span>พิมพ์ / PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEmailModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-purple-200 bg-[#F5F1FF] hover:bg-[#ECE6FF] text-xs font-bold text-[#5542F6] transition-colors cursor-pointer"
          >
            <Send size={14} />
            <span>ส่งอีเมล</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dynamic Form Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F5F1FF] text-[#5542F6] flex items-center justify-center font-bold text-xs">
                  <FileText size={15} />
                </div>
                <h2 className="text-sm font-bold text-gray-900">กรอกข้อมูลเอกสาร</h2>
              </div>
              <span className="text-[11px] text-gray-400">{template.fields?.length || 0} ช่องกรอก</span>
            </div>

            {/* Generated Form Fields */}
            <div className="space-y-3.5">
              {(template.fields || []).map((f) => {
                const val = values[f.id] || "";

                if (f.type === "textarea") {
                  return (
                    <div key={f.id} className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                        <span>{f.label} {f.required && <span className="text-red-500">*</span>}</span>
                      </label>
                      <textarea
                        value={val}
                        onChange={(e) => handleFieldChange(f.id, e.target.value)}
                        placeholder={f.placeholder || `ระบุ ${f.label}...`}
                        rows={f.rows || 3}
                        className="w-full p-2.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 outline-none focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] transition-all"
                      />
                    </div>
                  );
                }

                if (f.type === "select") {
                  return (
                    <div key={f.id} className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">
                        {f.label} {f.required && <span className="text-red-500">*</span>}
                      </label>
                      <select
                        value={val}
                        onChange={(e) => handleFieldChange(f.id, e.target.value)}
                        className="w-full h-9 px-2.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 outline-none focus:border-[#5542F6]"
                      >
                        <option value="">-- เลือก{f.label} --</option>
                        {(f.options || []).map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                return (
                  <div key={f.id} className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                      <span>{f.label} {f.required && <span className="text-red-500">*</span>}</span>
                    </label>
                    <input
                      type={f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
                      value={val}
                      onChange={(e) => handleFieldChange(f.id, e.target.value)}
                      placeholder={f.placeholder || `ระบุ ${f.label}...`}
                      className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 outline-none focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] transition-all"
                    />
                  </div>
                );
              })}
            </div>

            {/* Document Controls (Watermark & Red Seal) */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                ตราประทับและลายน้ำบนเอกสาร
              </h3>

              {/* Watermark Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">ลายน้ำเอกสาร (PDF Watermark)</label>
                <select
                  value={watermark}
                  onChange={(e) => setWatermark(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 outline-none focus:border-[#5542F6]"
                >
                  {WATERMARK_OPTIONS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Corporate Seal Checkbox */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white cursor-pointer transition-all">
                <div className="flex items-center gap-2">
                  <Stamp size={16} className="text-red-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">ประทับตราสำคัญองค์กรสีแดง</p>
                    <p className="text-[10px] text-gray-400">บริษัท เครสท์ เซนโด จำกัด</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showSeal}
                  onChange={(e) => setShowSeal(e.target.checked)}
                  className="w-4 h-4 rounded text-[#5542F6] focus:ring-[#5542F6]"
                />
              </label>

              {/* Digital E-Sign Blocks */}
              {template.contentLayout?.hasSignature && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <FileSignature size={14} className="text-[#5542F6]" />
                    <span>ลายมือชื่อดิจิทัล (Digital E-Sign)</span>
                  </h4>

                  {(template.contentLayout.signatureSlots || []).map((slot) => {
                    const hasSig = !!signatures[slot.id];
                    return (
                      <div key={slot.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-800">{slot.label}</span>
                          <span className="text-[10px] text-gray-500">{slot.role}</span>
                        </div>
                        {hasSig ? (
                          <div className="p-2 rounded-lg bg-white border border-purple-100 flex items-center justify-between">
                            <img src={signatures[slot.id]} alt="ลายเซ็น" className="h-10 object-contain" />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveSigSlot(slot)}
                                className="text-xs text-[#5542F6] font-semibold hover:underline cursor-pointer"
                              >
                                แก้ไข
                              </button>
                              <button
                                type="button"
                                onClick={() => setSignatures((prev) => ({ ...prev, [slot.id]: null }))}
                                className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                              >
                                ลบ
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveSigSlot(slot)}
                            className="w-full py-2 px-3 rounded-lg border border-dashed border-purple-300 text-xs font-bold text-[#5542F6] bg-purple-50/50 hover:bg-purple-100/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <FileSignature size={14} />
                            <span>วาดหรืออัปโหลดลายมือชื่อ</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live A4 Document Canvas */}
        <div className="lg:col-span-7 sticky top-6">
          <div className="bg-gray-100/90 rounded-2xl p-4 sm:p-6 border border-gray-200/80 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Eye size={14} className="text-[#5542F6]" />
                <span>พรีวิวกระดาษ A4 เสมือนจริง (Print Preview)</span>
              </span>
              <span className="text-[10px] font-semibold text-gray-400">ขนาด 210 x 297 mm</span>
            </div>

            {/* A4 Paper Output Container */}
            <div
              id="printable-document"
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 sm:p-12 text-left min-h-[700px] flex flex-col justify-between relative overflow-hidden select-none"
            >
              {/* Diagonal Watermark Overlay */}
              {watermark !== "none" && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 select-none overflow-hidden">
                  <div
                    className={`transform -rotate-35 text-5xl sm:text-6xl font-black tracking-widest uppercase opacity-15 border-4 py-3 px-8 rounded-2xl ${
                      watermark === "draft"
                        ? "text-amber-500 border-amber-500"
                        : watermark === "confidential"
                        ? "text-red-500 border-red-500"
                        : "text-blue-500 border-blue-500"
                    }`}
                  >
                    {watermark === "draft"
                      ? "DRAFT"
                      : watermark === "confidential"
                      ? "CONFIDENTIAL"
                      : "COPY"}
                  </div>
                </div>
              )}

              {/* Company Header */}
              {template.contentLayout?.hasHeader && (
                <div className="border-b-2 border-gray-800 pb-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F03BC] to-[#9F1EF4] flex items-center justify-center text-white font-bold text-base shadow-xs">
                      CZ
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 leading-tight">บริษัท เครสท์ เซนโด จำกัด</p>
                      <p className="text-xs font-semibold text-gray-600">CREST ZENDO CO., LTD.</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        888 อาคารเอ็มไพร์ ทาวเวอร์ ชั้น 21 ถนนสาทรใต้ กรุงเทพฯ 10120 | เลขภาษี: 0105564088911
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5542F6] font-bold border border-purple-200">
                      เอกสารมาตรฐาน
                    </span>
                  </div>
                </div>
              )}

              {/* Document Title & Body */}
              <div className="space-y-5 flex-1">
                <h1 className="text-lg font-black text-center text-gray-900 border-b border-gray-200 pb-3">
                  {template.contentLayout?.documentHeaderTitle || template.name}
                </h1>

                <div
                  className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap space-y-3"
                  dangerouslySetInnerHTML={{ __html: interpolatedContent }}
                />
              </div>

              {/* Footer: Seal & Signatures */}
              <div className="pt-8 mt-8 border-t border-gray-200 relative">
                {showSeal && (
                  <div className="absolute right-8 bottom-6 pointer-events-none opacity-90 z-20">
                    <CorporateSeal className="w-24 h-24" />
                  </div>
                )}

                {template.contentLayout?.hasSignature && (
                  <div className="grid grid-cols-2 gap-8 pt-4">
                    {(template.contentLayout.signatureSlots || []).map((slot) => {
                      const sigImg = signatures[slot.id];
                      return (
                        <div key={slot.id} className="text-center space-y-1.5">
                          <div className="h-16 border-b border-gray-300 border-dashed flex items-end justify-center pb-1">
                            {sigImg ? (
                              <img
                                src={sigImg}
                                alt="ลายมือชื่อดิจิทัล"
                                className="max-h-14 object-contain"
                              />
                            ) : (
                              <span className="text-[11px] text-gray-300 italic">
                                [ ลายมือชื่อผู้มีอำนาจ ]
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-gray-900">{slot.label}</p>
                          <p className="text-[11px] text-gray-500">{slot.role}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {isEmailModalOpen && (
        <EmailScreen
          documentId={documentId}
          templateId={template.id}
          templateName={template.name}
          onClose={() => setIsEmailModalOpen(false)}
        />
      )}

      {/* Digital Signature Pad Modal */}
      {activeSigSlot && (
        <SignaturePadModal
          title={`ลงลายมือชื่อ: ${activeSigSlot.label}`}
          partyName={activeSigSlot.role || activeSigSlot.label}
          initialImage={signatures[activeSigSlot.id] || null}
          onSave={(imgBase64) => {
            setSignatures((prev) => ({ ...prev, [activeSigSlot.id]: imgBase64 }));
            setActiveSigSlot(null);
          }}
          onClose={() => setActiveSigSlot(null)}
        />
      )}
    </div>
  );
}

export default function UniversalDocumentPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#5542F6] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-medium">กำลังโหลดเอกสาร...</p>
        </div>
      }
    >
      <UniversalDocumentContent />
    </Suspense>
  );
}

