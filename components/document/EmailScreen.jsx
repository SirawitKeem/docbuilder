"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Tag,
  MessageSquare,
  FileText,
  Eye,
  Maximize2,
  CheckCircle2,
  ShieldCheck,
  Info,
  Loader2,
  Send,
  X,
} from "lucide-react";
import { templateRegistry } from "@/lib/templates/registry";
import { DocumentFieldsProvider } from "@/context/DocumentFieldsContext";
import DocumentHeader from "./DocumentHeader";
import DocumentFooter from "./DocumentFooter";

export default function EmailScreen({
  defaultSubject,
  fileName,
  attachmentBase64,
  pdfBase64,
  templateId = "nda",
  templateName,
  values = {},
  onBack,
  onSent,
}) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(defaultSubject || "");
  const [message, setMessage] = useState(
    "เรียนผู้รับ\n\nกรุณาตรวจสอบเอกสารแนบท้ายอีเมลนี้\n\nขอบคุณครับ"
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [showFullPreview, setShowFullPreview] = useState(false);

  const activeAttachment = attachmentBase64 || pdfBase64;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to);

  const entry = templateRegistry[templateId] || templateRegistry["nda"];
  const { schema, pages } = entry;
  const pageCount = pages ? pages.length : 4;
  const Page1Component = pages ? pages[0] : null;

  const handleSend = async () => {
    setError("");
    if (!isValidEmail) {
      setError("กรุณากรอกอีเมลผู้รับให้ถูกต้อง");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject,
          message,
          attachmentBase64: activeAttachment,
          attachmentName: fileName,
          templateId,
          templateName: schema?.fullName || templateName,
          values,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ส่งไม่สำเร็จ");
      onSent?.({ to, fileName });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/70">
      {/* Top Bar Navigation */}
      <div className="h-16 border-b border-gray-200 bg-white flex items-center gap-4 px-8 shrink-0 shadow-2xs">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
          title="ย้อนกลับ"
        >
          <ArrowLeft size={20} />
        </button>
        <p className="text-base font-bold text-gray-900">ส่งเอกสารทางอีเมล</p>
      </div>

      {/* Main Content Layout - 2 Columns */}
      <div className="flex-1 overflow-auto max-w-7xl w-full mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Email Form Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-card space-y-6">
            
            {/* Step 1: Recipient Email */}
            <div>
              <div className="mb-2">
                <h3 className="text-sm font-bold text-gray-900">
                  1. ผู้รับ (Recipient Email) <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">กรอกอีเมลของผู้รับที่ต้องการส่งเอกสาร</p>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
            </div>

            {/* Step 2: Email Subject */}
            <div>
              <div className="mb-2">
                <h3 className="text-sm font-bold text-gray-900">
                  2. หัวข้อ (Subject) <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">กำหนดหัวข้อของอีเมลที่ผู้รับจะเห็น</p>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Tag size={18} />
                </div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all font-medium text-gray-800"
                />
              </div>
            </div>

            {/* Step 3: Email Message */}
            <div>
              <div className="mb-2">
                <h3 className="text-sm font-bold text-gray-900">3. ข้อความ (Message)</h3>
                <p className="text-xs text-gray-500 mt-0.5">เขียนข้อความเพิ่มเติมที่ต้องการส่งถึงผู้รับ</p>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-gray-400">
                  <MessageSquare size={18} />
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all leading-relaxed resize-none"
                />
                <div className="text-right text-[11px] text-gray-400 mt-1 font-mono">
                  {message.length}/1,000
                </div>
              </div>
            </div>

            {/* Step 4: Attachment Badge */}
            <div>
              <div className="mb-2">
                <h3 className="text-sm font-bold text-gray-900">4. ไฟล์แนบ (Attachment)</h3>
                <p className="text-xs text-gray-500 mt-0.5">ไฟล์เอกสารที่จะแนบไปกับอีเมล</p>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50/60">
                <div className="flex items-center gap-3 overflow-hidden pr-2">
                  <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-gray-900 truncate">{fileName}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">245 KB • PDF</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFullPreview(true)}
                  className="px-3.5 py-2 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
                >
                  <Eye size={14} />
                  ดูไฟล์
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                {error}
              </div>
            )}

            {/* Bottom Alert Banner & Send Button */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-50/80 text-primary-700 border border-primary-100 text-xs flex-1">
                <ShieldCheck size={18} className="shrink-0" />
                <span>โปรดตรวจสอบอีเมลผู้รับและรายละเอียดให้ถูกต้องก่อนส่ง</span>
              </div>
              <button
                onClick={handleSend}
                disabled={sending || !activeAttachment}
                className="w-full sm:w-auto px-7 h-11 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm shrink-0 transition-all"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {sending ? "กำลังส่ง..." : "ส่งอีเมล"}
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Live Document Preview Thumbnail Card & Note (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Document Thumbnail Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">ตัวอย่างไฟล์แนบ</h3>
                <p className="text-xs text-gray-500 mt-0.5">ตัวอย่างเอกสารที่จะถูกส่งไปยังผู้รับ</p>
              </div>

              {/* PDF Preview Frame Container */}
              <div className="bg-gray-100/80 border border-gray-200 rounded-xl p-4 flex flex-col items-center relative overflow-hidden">
                {/* PDF Header Tag */}
                <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-gray-200/80 px-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-800 truncate pr-2">
                    <FileText size={15} className="text-red-500 shrink-0" />
                    <span className="truncate">{fileName}</span>
                  </div>
                  <button
                    onClick={() => setShowFullPreview(true)}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                    title="ขยายขนาด"
                  >
                    <Maximize2 size={15} />
                  </button>
                </div>

                {/* Scaled Page Preview */}
                <div className="relative shadow-md rounded overflow-hidden bg-white w-full max-w-[280px] aspect-[1/1.4] flex flex-col justify-between p-4 font-noto-looped text-[8px] leading-tight select-none pointer-events-none">
                  <DocumentFieldsProvider initialValues={values} defaultReadOnly>
                    <DocumentHeader logo={schema?.logo} />
                    <div className="flex-1 my-2 overflow-hidden">
                      {Page1Component && <Page1Component />}
                    </div>
                    <DocumentFooter
                      title={schema?.fullName}
                      pageNumber={1}
                      totalPages={pageCount}
                    />
                  </DocumentFieldsProvider>

                  {/* Page Pill Counter Overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800/90 text-white text-[10px] font-medium px-3 py-1 rounded-full shadow-md backdrop-blur-2xs">
                    หน้า 1 / {pageCount}
                  </div>
                </div>

                {/* PDF Footer Status Bar */}
                <div className="w-full flex items-center justify-between pt-3 mt-3 border-t border-gray-200/80 px-1 text-xs">
                  <span className="text-gray-500 font-medium">
                    PDF • 245 KB • {pageCount} หน้า
                  </span>
                  <span className="flex items-center gap-1 text-success-600 font-bold text-[11px] bg-success-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={13} />
                    พร้อมส่ง
                  </span>
                </div>
              </div>
            </div>

            {/* Note Information Card */}
            <div className="bg-primary-50/80 border border-primary-100 rounded-xl p-4 flex gap-3 text-xs text-primary-900 shadow-2xs">
              <Info size={18} className="text-primary-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-0.5">หมายเหตุ</p>
                <p className="leading-relaxed text-primary-800">
                  เมื่อกดส่งอีเมล ระบบจะส่งเอกสาร PDF ไปยังอีเมลผู้รับที่ระบุไว้ทันที พร้อมบันทึกประวัติไว้ในหน้าประวัติการส่ง
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Full Document View Modal */}
      {showFullPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/90">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{fileName}</h3>
                <p className="text-xs text-gray-500 mt-0.5">ตัวอย่างเอกสารก่อนส่งอีเมล</p>
              </div>
              <button
                onClick={() => setShowFullPreview(false)}
                className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 p-6 flex flex-col items-center gap-6">
              <DocumentFieldsProvider initialValues={values} defaultReadOnly>
                {pages.map((PageContent, i) => (
                  <div
                    key={i}
                    className="bg-white shadow-document w-[700px] min-h-[990px] p-12 flex flex-col justify-between font-noto-looped text-gray-900 rounded-sm"
                  >
                    <DocumentHeader logo={schema?.logo} />
                    <div className="flex-1 my-4">
                      <PageContent />
                    </div>
                    <DocumentFooter
                      title={schema?.fullName}
                      pageNumber={i + 1}
                      totalPages={pages.length}
                    />
                  </div>
                ))}
              </DocumentFieldsProvider>
            </div>
            <div className="px-6 py-3.5 border-t border-gray-200 flex items-center justify-end bg-gray-50/90">
              <button
                onClick={() => setShowFullPreview(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}