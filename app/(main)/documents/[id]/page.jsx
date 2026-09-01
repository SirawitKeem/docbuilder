"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Building2,
  Calendar,
  User,
  ShieldCheck,
  Send,
  Printer,
  Edit3,
  MessageSquare,
  History,
  Stamp,
  FileSignature,
  QrCode,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import CorporateSeal from "@/components/document/CorporateSeal";
import SignaturePadModal from "@/components/document/SignaturePadModal";
import EmailScreen from "@/components/document/EmailScreen";

function DocumentInspectorContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [documentData, setDocumentData] = useState(null);
  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("timeline"); // 'timeline' | 'fields' | 'approvals'

  // Action Modals State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const fetchDocument = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/documents/${id}`);
      if (!res.ok) throw new Error("ไม่พบเอกสารนี้ในระบบ");
      const doc = await res.json();
      setDocumentData(doc);

      // Fetch template schema if templateId exists
      if (doc.templateId && doc.templateId !== "quotation") {
        const tmplRes = await fetch(`/api/templates/${doc.templateId}`);
        if (tmplRes.ok) {
          const tmpl = await tmplRes.json();
          setTemplateData(tmpl);
        }
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  // Action Handlers
  const handleAction = async (action, payload = {}) => {
    setIsSubmittingAction(true);
    try {
      const res = await fetch(`/api/documents/${id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ดำเนินการไม่สำเร็จ");
      setDocumentData(data);
      setIsSignModalOpen(false);
      setIsRejectModalOpen(false);
      setCommentText("");
      setRejectionReason("");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Interpolated Body Text for Canvas
  const renderedContent = useMemo(() => {
    if (!documentData) return "";
    const values = documentData.values || {};
    let body = templateData?.contentLayout?.bodyMarkdown || "";

    if (!body) {
      if (documentData.templateId === "quotation") {
        return `ใบเสนอราคาเลขที่: ${values.quotationNo || documentData.id}\nวันที่: ${values.quotationDate || ""}\nเรียน: ${values.billTo?.companyName || ""}`;
      }
      return JSON.stringify(values, null, 2);
    }

    // Replace system vars
    body = body.replace(/\{\{company_name\}\}/g, "บริษัท เครสท์ เซนโด จำกัด");
    body = body.replace(
      /\{\{current_date\}\}/g,
      new Date(documentData.createdAt).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
    body = body.replace(/\{\{document_id\}\}/g, documentData.id);

    // Replace dynamic field vars
    (templateData?.fields || []).forEach((f) => {
      const val = values[f.id];
      const displayVal = val !== undefined && val !== "" ? val : `[${f.label}]`;
      const regex = new RegExp(`\\{\\{${f.id}\\}\\}`, "g");
      body = body.replace(
        regex,
        `<span class="font-bold text-gray-900 border-b border-gray-300 px-1">${displayVal}</span>`
      );
    });

    return body;
  }, [documentData, templateData]);

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#5542F6] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-500 font-medium">กำลังโหลดข้อมูลเอกสาร...</p>
      </div>
    );
  }

  if (errorMsg || !documentData) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
          ⚠️ {errorMsg || "ไม่พบเอกสารนี้"}
        </div>
        <Link
          href="/documents"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5542F6] text-white text-xs font-bold shadow-xs hover:bg-[#4332D6]"
        >
          <ArrowLeft size={15} />
          <span>กลับไปยังรายการเอกสาร</span>
        </Link>
      </div>
    );
  }

  const status = documentData.status || "draft";
  const values = documentData.values || {};
  const watermark = values.watermark || "none";
  const showSeal = values.showSeal !== undefined ? values.showSeal : true;
  const signatures = values.signatures || {};

  return (
    <div className="space-y-5 text-left pb-24">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-gray-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/documents"
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-2xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">
                เอกสาร / {documentData.templateName || "เอกสารทั่วไป"}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  status === "completed"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : status === "pending_approval"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : status === "rejected"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : status === "sent"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {status === "completed"
                  ? "✅ เสร็จสมบูรณ์ & ประทับตรา"
                  : status === "pending_approval"
                  ? "⏳ รอการอนุมัติ"
                  : status === "rejected"
                  ? "❌ ตีกลับแก้ไข"
                  : status === "sent"
                  ? "📧 ส่งอีเมลแล้ว"
                  : "📝 ฉบับร่าง"}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
              {documentData.name}
            </h1>
          </div>
        </div>

        {/* Workflow & Export Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Action: Submit for approval */}
          {(status === "draft" || status === "rejected") && (
            <button
              type="button"
              onClick={() =>
                handleAction("submit_approval", {
                  performedBy: documentData.createdBy || "นายสมชาย ใจดี (ผู้จัดทำ)",
                })
              }
              disabled={isSubmittingAction}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5542F6] hover:bg-[#4332D6] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Send size={14} />
              <span>ส่งขออนุมัติ (Submit)</span>
            </button>
          )}

          {/* Action: Approve & Sign (for pending_approval) */}
          {status === "pending_approval" && (
            <>
              <button
                type="button"
                onClick={() => setIsSignModalOpen(true)}
                disabled={isSubmittingAction}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 size={14} />
                <span>อนุมัติและลงนาม (Approve)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRejectModalOpen(true)}
                disabled={isSubmittingAction}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                <XCircle size={14} />
                <span>ตีกลับแก้ไข</span>
              </button>
            </>
          )}

          {/* Edit Document */}
          {status !== "completed" && (
            <Link
              href={
                documentData.templateId === "quotation"
                  ? `/create/quotation?id=${documentData.id}`
                  : `/create/custom?templateId=${documentData.templateId}&documentId=${documentData.id}`
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors cursor-pointer shadow-2xs"
            >
              <Edit3 size={14} className="text-gray-400" />
              <span>แก้ไขเนื้อหา</span>
            </Link>
          )}

          {/* Print / PDF */}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors cursor-pointer shadow-2xs"
          >
            <Printer size={14} className="text-gray-500" />
            <span>พิมพ์ / PDF</span>
          </button>

          {/* Send Email */}
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

      {/* Rejection Alert if rejected */}
      {status === "rejected" && documentData.rejectionReason && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <XCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-left">
            <h4 className="text-xs font-bold text-rose-800">เอกสารถูกตีกลับเพื่อแก้ไข</h4>
            <p className="text-xs text-rose-700 leading-relaxed">{documentData.rejectionReason}</p>
          </div>
        </div>
      )}

      {/* 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual A4 Document Canvas */}
        <div className="lg:col-span-7 sticky top-6">
          <div className="bg-gray-100/90 rounded-2xl p-4 sm:p-6 border border-gray-200/80 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <FileText size={14} className="text-[#5542F6]" />
                <span>หน้าเอกสาร A4 (Visual Document)</span>
              </span>
              <span className="text-[10px] font-semibold text-gray-400">ขนาด 210 x 297 mm</span>
            </div>

            {/* A4 Paper Output Container */}
            <div
              id="printable-document"
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 sm:p-12 text-left min-h-[720px] flex flex-col justify-between relative overflow-hidden select-none"
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
                    เอกสารทางการ
                  </span>
                </div>
              </div>

              {/* Document Title & Body */}
              <div className="space-y-5 flex-1">
                <h1 className="text-lg font-black text-center text-gray-900 border-b border-gray-200 pb-3">
                  {templateData?.contentLayout?.documentHeaderTitle || documentData.name}
                </h1>

                <div
                  className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap space-y-3"
                  dangerouslySetInnerHTML={{ __html: renderedContent }}
                />
              </div>

              {/* Footer: Seal, Signatures & Verification QR */}
              <div className="pt-8 mt-8 border-t border-gray-200 relative">
                {showSeal && (
                  <div className="absolute right-8 bottom-6 pointer-events-none opacity-90 z-20">
                    <CorporateSeal className="w-24 h-24" />
                  </div>
                )}

                {/* Signature Blocks */}
                <div className="grid grid-cols-2 gap-8 pt-4 pb-4">
                  {(templateData?.contentLayout?.signatureSlots || [
                    { id: "applicant", label: documentData.createdBy || "ผู้จัดทำ", role: "ผู้ยื่นคำขอ" },
                    { id: "approver", label: documentData.approvedBy || "นายศรายุทธ โกสิยารักษ์", role: "กรรมการผู้จัดการ" },
                  ]).map((slot) => {
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
                              [ {status === "completed" ? "ลงนามดิจิทัลแล้ว" : "รอดำเนินการลงนาม"} ]
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-gray-900">{slot.label}</p>
                        <p className="text-[11px] text-gray-500">{slot.role}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Tamper-Proof Verification Token Banner */}
                {documentData.verificationToken && (
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-emerald-600" />
                      <span>Verification Token:</span>
                      <span className="font-mono font-bold text-gray-700">{documentData.verificationToken}</span>
                    </div>
                    <Link
                      href={`/verify/${documentData.verificationToken}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[#5542F6] hover:underline font-bold"
                    >
                      <span>ตรวจสอบความถูกต้อง</span>
                      <ExternalLink size={10} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inspector Panel (Timeline, Approvals, Fields) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
            {/* Inspector Tab Selector */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-gray-100/90 text-xs font-bold select-none">
              <button
                type="button"
                onClick={() => setActiveTab("timeline")}
                className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer truncate ${
                  activeTab === "timeline"
                    ? "bg-white text-[#5542F6] shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                บันทึกเวลา (Timeline)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("approvals")}
                className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer truncate ${
                  activeTab === "approvals"
                    ? "bg-white text-[#5542F6] shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                สายอนุมัติ (Chain)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("fields")}
                className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer truncate ${
                  activeTab === "fields"
                    ? "bg-white text-[#5542F6] shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                ข้อมูลฟิลด์ (Data)
              </button>
            </div>

            {/* Tab 1: Audit Timeline */}
            {activeTab === "timeline" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <History size={14} className="text-[#5542F6]" />
                    <span>ประวัติและกิจกรรม (Audit Trail)</span>
                  </h3>
                  <span className="text-[10px] text-gray-400">บันทึกอัตโนมัติ</span>
                </div>

                {/* Timeline List */}
                <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
                  {(documentData.activityLogs || []).map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{log.performedBy}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString("th-TH", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium">{log.details}</p>
                      {log.comment && (
                        <p className="text-purple-700 bg-purple-50/80 p-2 rounded-lg border border-purple-100 text-[11px] mt-1">
                          💬 "{log.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Internal Comment Box */}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                    <MessageSquare size={13} className="text-[#5542F6]" />
                    <span>เพิ่มบันทึกความเห็นภายใน (Internal Note)</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="พิมพ์บันทึกภายใน..."
                      className="flex-1 h-8 px-2.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-[#5542F6]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleAction("add_log", {
                          performedBy: "ผู้ตรวจทาน (Reviewer)",
                          details: "เพิ่มบันทึกความเห็น",
                          comment: commentText,
                        })
                      }
                      disabled={!commentText.trim() || isSubmittingAction}
                      className="px-3 py-1.5 rounded-lg bg-[#5542F6] text-white text-xs font-bold hover:bg-[#4332D6] disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Approval Chain */}
            {activeTab === "approvals" && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <FileSignature size={14} className="text-[#5542F6]" />
                    <span>ลำดับสายอนุมัติ (Approval Chain)</span>
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {(documentData.approvalChain || []).map((step, idx) => (
                    <div
                      key={step.id || idx}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                        step.status === "approved"
                          ? "bg-emerald-50/60 border-emerald-200"
                          : step.status === "rejected"
                          ? "bg-rose-50/60 border-rose-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          ขั้นตอนที่ {idx + 1}: {step.stepName}
                        </span>
                        <p className="font-bold text-gray-900">{step.assignedUser || step.assignedRole}</p>
                        <p className="text-[11px] text-gray-500">{step.assignedRole}</p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          step.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : step.status === "rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {step.status === "approved"
                          ? "อนุมัติแล้ว"
                          : step.status === "rejected"
                          ? "ตีกลับ"
                          : "รอพิจารณา"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Field Data */}
            {activeTab === "fields" && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#5542F6]" />
                    <span>ค่าข้อมูลและตัวแปรที่กรอก (Variables)</span>
                  </h3>
                </div>

                <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
                  {Object.entries(values).map(([k, v]) => {
                    if (k === "signatures" || k === "watermark" || k === "showSeal") return null;
                    return (
                      <div
                        key={k}
                        className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-0.5 text-xs"
                      >
                        <span className="font-mono text-[10px] text-purple-700 font-bold block">
                          {`{{${k}}}`}
                        </span>
                        <p className="text-gray-800 font-medium break-all">
                          {typeof v === "object" ? JSON.stringify(v) : String(v || "-")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signature Modal for Approver */}
      {isSignModalOpen && (
        <SignaturePadModal
          title="อนุมัติและลงนามเอกสาร"
          partyName="นายศรายุทธ โกสิยารักษ์ (กรรมการผู้จัดการ)"
          onSave={(sigData) =>
            handleAction("approve", {
              performedBy: "นายศรายุทธ โกสิยารักษ์ (กรรมการผู้จัดการ)",
              signatureImg: sigData,
              comment: "อนุมัติเอกสารและลงนามเรียบร้อย",
            })
          }
          onClose={() => setIsSignModalOpen(false)}
        />
      )}

      {/* Rejection Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-md p-6 space-y-4 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <XCircle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">ตีกลับเอกสารเพื่อแก้ไข</h3>
                <p className="text-xs text-gray-500">ระบุเหตุผลและสิ่งที่ต้องการให้ผู้จัดทำแก้ไข</p>
              </div>
            </div>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="ระบุสิ่งที่ต้องแก้ไข เช่น ขอให้ปรับแก้จำนวนงบประมาณในข้อ 2..."
              rows={4}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAction("reject", {
                    performedBy: "นายศรายุทธ โกสิยารักษ์",
                    reason: rejectionReason,
                  })
                }
                disabled={!rejectionReason.trim() || isSubmittingAction}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                ยืนยันการตีกลับ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {isEmailModalOpen && (
        <EmailScreen
          documentId={documentData.id}
          templateId={documentData.templateId}
          templateName={documentData.templateName}
          onClose={() => setIsEmailModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function DocumentInspectorPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#5542F6] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-medium">กำลังเปิดสตูดิโอตรวจทานเอกสาร...</p>
        </div>
      }
    >
      <DocumentInspectorContent />
    </Suspense>
  );
}
