"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Save,
  Send,
  Printer,
  FileText,
  Building2,
  MapPin,
  CheckCircle2,
  Eye,
} from "lucide-react";
import UniversalTemplateRenderer from "@/components/document/UniversalTemplateRenderer";
import NotificationRelocationDocument from "@/components/document/notification/NotificationRelocationDocument";
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

        setDocumentName(tmplData.name || "เอกสารใหม่");

        // Extract initial values from blocks or fields
        const initialVals = {};

        if (Array.isArray(tmplData.blocks)) {
          tmplData.blocks.forEach((b) => {
            const s = b.settings || {};
            if (b.type === "header") {
              initialVals.company_name_th = s.companyName || "";
              initialVals.company_name_en = s.companyNameEn || "";
              initialVals.tax_id = s.taxId || "";
              initialVals.phone = s.phone || "";
              initialVals.logo_url = s.logoUrl || "";
            }
            if (b.type === "info_grid") {
              initialVals.doc_date = s.date || "";
              initialVals.recipient = s.recipient || s.billToCompany || "";
              initialVals.subject = s.subject || "";
            }
            if (b.type === "address_comparison") {
              initialVals.old_address_th = s.previousAddressTh || "";
              initialVals.old_address_en = s.previousAddressEn || "";
              initialVals.new_address_th = s.newAddressTh || "";
              initialVals.new_address_en = s.newAddressEn || "";
            }
            if (b.type === "signatures" && Array.isArray(s.slots) && s.slots[0]) {
              initialVals.signatory_name = s.slots[0].name || "";
              initialVals.signatory_position = s.slots[0].role || "";
            }
          });
        }

        // Default notification values fallback
        if (tmplData.id === "tmpl-notification-relocation" || tmplData.categoryId === "notification") {
          initialVals.company_name_th = initialVals.company_name_th || "บริษัท เดอะ รีโคฟเวอรี่ แอดไวเซอร์ จำกัด";
          initialVals.company_name_en = initialVals.company_name_en || "THE RECOVERY ADVISOR CO., LTD.";
          initialVals.tax_id = initialVals.tax_id || "0105554007189";
          initialVals.phone = initialVals.phone || "02-1019884";
          initialVals.logo_url = initialVals.logo_url || "/header_logo.png";
          initialVals.doc_date = initialVals.doc_date || "01 กันยายน 2569 / September 01, 2026";
          initialVals.recipient = initialVals.recipient || "ท่านคู่ค้าและลูกค้าผู้มีอุปการคุณ / Valued Business Partners";
          initialVals.subject = initialVals.subject || "แจ้งเปลี่ยนแปลงที่อยู่สำนักงานใหญ่ / Change of Head Office Address";
          initialVals.old_address_th = initialVals.old_address_th || "45 ซอยโกสุมรวมใจ 37 แขวงดอนเมือง เขตดอนเมือง กรุงเทพมหานคร 10210";
          initialVals.old_address_en = initialVals.old_address_en || "45 Soi Kosum Ruam Chai 37, Don Mueang, Don Mueang, Bangkok 10210, Thailand";
          initialVals.new_address_th = initialVals.new_address_th || "18 ซอยโกสุมรวมใจ 35 แยก 4 แขวงดอนเมือง เขตดอนเมือง กรุงเทพมหานคร 10210";
          initialVals.new_address_en = initialVals.new_address_en || "18 Soi Kosum Ruam Chai 35 Yaek 4, Don Mueang, Don Mueang, Bangkok 10210, Thailand";
          initialVals.signatory_name = initialVals.signatory_name || "นายศรายุทธ  โกสิยารักษ์";
          initialVals.signatory_position = initialVals.signatory_position || "กรรมการผู้จัดการ / CEO";
        }

        setValues(initialVals);

        // If editing existing document
        if (documentId) {
          const docRes = await fetch("/api/documents");
          if (docRes.ok) {
            const allDocs = await docRes.json();
            const existingDoc = (allDocs || []).find((d) => d.id === documentId);
            if (existingDoc) {
              setDocumentName(existingDoc.name || tmplData.name);
              setDocumentStatus(existingDoc.status || "draft");
              if (existingDoc.values) {
                setValues((prev) => ({ ...prev, ...existingDoc.values }));
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading template:", err);
        setErrorMsg(err.message || "เกิดข้อผิดพลาดในการโหลดเทมเพลต");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [templateId, documentId]);

  const handleFieldChange = (fieldId, val) => {
    setValues((prev) => ({ ...prev, [fieldId]: val }));
  };

  const isNotification =
    template?.id === "tmpl-notification-relocation" ||
    template?.categoryId === "notification" ||
    (template?.name || "").includes("เปลี่ยนแปลงที่ตั้ง");

  // Save Document to JSON API
  const handleSave = async (status = "draft") => {
    try {
      setIsSaving(true);
      const payload = {
        name: documentName || template?.name || "เอกสารไม่มีชื่อ",
        templateId: template?.id,
        categoryId: template?.categoryId,
        status: status,
        values: values,
        watermark: watermark,
      };

      const res = await fetch(documentId ? `/api/documents/${documentId}` : "/api/documents", {
        method: documentId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("ไม่สามารถบันทึกเอกสารได้");
      const savedDoc = await res.json();

      setDocumentStatus(status);
      setSaveToast("บันทึกเอกสารสำเร็จเรียบร้อย!");
      setTimeout(() => setSaveToast(""), 3000);

      if (!documentId && savedDoc?.id) {
        router.replace(`/create/custom?templateId=${templateId}&documentId=${savedDoc.id}`);
      }
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-3">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-gray-500">กำลังโหลดเทมเพลตเอกสาร...</p>
      </div>
    );
  }

  if (errorMsg || !template) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-2xl text-center space-y-3">
        <h2 className="text-sm font-bold text-red-700">ไม่สามารถเปิดเอกสารได้</h2>
        <p className="text-xs text-red-500">{errorMsg || "ไม่พบเทมเพลต"}</p>
        <Link
          href="/templates"
          className="inline-block px-4 py-2 bg-white text-gray-700 text-xs font-bold rounded-xl border border-gray-200 shadow-xs hover:bg-gray-50"
        >
          กลับไปคลังเทมเพลต
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-24">
      {/* Save Success Toast */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={16} />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-2xs cursor-pointer"
            title="ย้อนกลับ"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">เทมเพลต</span>
              <span className="text-gray-300 text-xs">/</span>
              <span className="text-xs font-bold text-[#5542F6]">{template.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {documentStatus === "published" ? "เสร็จสมบูรณ์" : "ฉบับร่าง"}
              </span>
            </div>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="text-lg sm:text-xl font-black text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#5542F6] outline-none transition-all py-0.5 mt-0.5 max-w-xl"
              placeholder="ระบุชื่อเอกสาร..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <Save size={14} className="text-gray-400" />
            <span>{isSaving ? "กำลังบันทึก..." : "บันทึกฉบับร่าง"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 size={14} />
            <span>เสร็จสมบูรณ์</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5542F6] hover:bg-[#4332D6] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Printer size={14} />
            <span>พิมพ์ / PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEmailModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-[#5542F6] text-xs font-bold shadow-2xs cursor-pointer"
          >
            <Send size={14} />
            <span>ส่งอีเมล</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editable Form Fields */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F5F1FF] text-[#5542F6] flex items-center justify-center font-bold text-xs">
                  <FileText size={15} />
                </div>
                <h2 className="text-sm font-bold text-gray-900">กรอกและปรับแต่งข้อมูลเอกสาร</h2>
              </div>
              <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                Live Sync ⚡
              </span>
            </div>

            {/* If Notification Document */}
            {isNotification ? (
              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">วันที่ออกเอกสาร (Date)</label>
                  <input
                    type="text"
                    value={values.doc_date || ""}
                    onChange={(e) => handleFieldChange("doc_date", e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-[#5542F6]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">เรียน / ผู้รับ (To / Recipient)</label>
                  <input
                    type="text"
                    value={values.recipient || ""}
                    onChange={(e) => handleFieldChange("recipient", e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-[#5542F6]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">เรื่อง (Subject)</label>
                  <input
                    type="text"
                    value={values.subject || ""}
                    onChange={(e) => handleFieldChange("subject", e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-[#5542F6]"
                  />
                </div>

                <div className="pt-2 border-t border-gray-100 space-y-1">
                  <label className="font-bold text-gray-700 flex items-center gap-1.5">
                    <Building2 size={13} className="text-gray-400" />
                    <span>ที่อยู่เดิม (Previous Address)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={values.old_address_th || ""}
                    onChange={(e) => handleFieldChange("old_address_th", e.target.value)}
                    placeholder="ที่อยู่เดิม (ภาษาไทย)..."
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-[#5542F6]"
                  />
                  <textarea
                    rows={2}
                    value={values.old_address_en || ""}
                    onChange={(e) => handleFieldChange("old_address_en", e.target.value)}
                    placeholder="Previous Address (English)..."
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-[#5542F6]"
                  />
                </div>

                <div className="pt-2 border-t border-gray-100 space-y-1">
                  <label className="font-bold text-[#af0e0e] flex items-center gap-1.5">
                    <MapPin size={13} />
                    <span>ที่อยู่ใหม่ (New Address - มีผล 16 ก.ย. 2569)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={values.new_address_th || ""}
                    onChange={(e) => handleFieldChange("new_address_th", e.target.value)}
                    placeholder="ที่อยู่ใหม่ (ภาษาไทย)..."
                    className="w-full p-2.5 rounded-lg border border-red-200 bg-red-50/20 text-xs outline-none focus:border-red-500"
                  />
                  <textarea
                    rows={2}
                    value={values.new_address_en || ""}
                    onChange={(e) => handleFieldChange("new_address_en", e.target.value)}
                    placeholder="New Address (English)..."
                    className="w-full p-2.5 rounded-lg border border-red-200 bg-red-50/20 text-xs outline-none focus:border-red-500"
                  />
                </div>

                <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">ชื่อผู้ลงนาม</label>
                    <input
                      type="text"
                      value={values.signatory_name || ""}
                      onChange={(e) => handleFieldChange("signatory_name", e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-[#5542F6]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">ตำแหน่ง</label>
                    <input
                      type="text"
                      value={values.signatory_position || ""}
                      onChange={(e) => handleFieldChange("signatory_position", e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-[#5542F6]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Generic Block Form */
              <div className="space-y-3">
                <p className="text-xs text-gray-500">
                  เทมเพลตนี้ประกอบด้วยโครงสร้างบล็อกอัตโนมัติ ข้อมูลจะถูกจัดระเบียบตาม Layout มาตรฐาน
                </p>
                {(template.blocks || []).map((b, idx) => (
                  <div key={b.id || idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 space-y-1">
                    <p className="text-xs font-bold text-gray-800">{b.title || b.type}</p>
                    {b.settings?.content && (
                      <textarea
                        rows={3}
                        defaultValue={b.settings.content}
                        onChange={(e) => {
                          b.settings.content = e.target.value;
                          setValues({ ...values, [`block_${b.id}`]: e.target.value });
                        }}
                        className="w-full p-2 bg-white rounded-lg border border-gray-200 text-xs"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Watermark Selector */}
            <div className="pt-4 border-t border-gray-100 space-y-1">
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
          </div>
        </div>

        {/* Right Column: Live A4 Document Output */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Eye size={15} className="text-[#5542F6]" />
              <span className="text-xs font-bold text-gray-700">พรีวิวกระดาษ A4 เสมือนจริง (Print Preview)</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-400">ขนาด 210 x 297 mm</span>
          </div>

          {/* A4 Paper Output Container */}
          <div className="bg-gray-100/70 p-4 sm:p-6 rounded-2xl border border-gray-200/80 flex justify-center overflow-x-auto shadow-inner">
            <div className="origin-top shadow-xl border border-gray-300 rounded-sm overflow-hidden bg-white">
              {isNotification ? (
                <NotificationRelocationDocument values={values} />
              ) : (
                <UniversalTemplateRenderer template={template} scale={1} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {isEmailModalOpen && (
        <EmailScreen
          document={{
            id: documentId || "preview",
            name: documentName,
            status: documentStatus,
          }}
          onClose={() => setIsEmailModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function UniversalDocumentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <UniversalDocumentContent />
    </Suspense>
  );
}
