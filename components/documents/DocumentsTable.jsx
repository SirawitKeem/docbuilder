"use client";

import { useState, useEffect, useRef } from "react";
import {
  Eye,
  MoreHorizontal,
  Edit3,
  Trash2,
  X,
  Download,
  CopyPlus,
  Send,
  Pencil,
  Check,
  Copy,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { templateRegistry } from "@/lib/templates/registry";
import { getFieldProfile } from "@/lib/data/fieldProfile";
import { DocumentFieldsProvider } from "@/context/DocumentFieldsContext";
import { paginateQuotationLineItems } from "@/lib/quotationHelpers";
import QuotationDocument from "@/components/document/quotation/QuotationDocument";
import DocumentHeader from "@/components/document/DocumentHeader";
import DocumentFooter from "@/components/document/DocumentFooter";
import EmailScreen from "@/components/document/EmailScreen";

const statusStyles = {
  draft: "bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100/80",
  pending_approval: "bg-purple-50 text-[#5542F6] border border-purple-200/80 hover:bg-purple-100/80",
  signed: "bg-purple-50 text-[#5542F6] border border-purple-200/80 hover:bg-purple-100/80",
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100/80",
  issued: "bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100/80",
  sent: "bg-blue-50 text-blue-700 border border-blue-200/80 hover:bg-blue-100/80",
  rejected: "bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100/80",
  cancelled: "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200/80",
};

const statusLabel = {
  draft: "ฉบับร่าง",
  pending_approval: "รอการอนุมัติ",
  signed: "ลงนามแล้ว",
  completed: "เสร็จสมบูรณ์",
  issued: "เสร็จสมบูรณ์",
  sent: "ส่งแล้ว",
  rejected: "ตีกลับแก้ไข",
  cancelled: "ยกเลิก",
};

const statusList = [
  { id: "draft", label: "ฉบับร่าง (Draft)", dot: "bg-amber-500" },
  { id: "pending_approval", label: "รอการอนุมัติ (Pending)", dot: "bg-[#5542F6]" },
  { id: "completed", label: "เสร็จสมบูรณ์ (Completed)", dot: "bg-emerald-500" },
  { id: "rejected", label: "ตีกลับแก้ไข (Rejected)", dot: "bg-rose-500" },
  { id: "sent", label: "ส่งแล้ว (Sent)", dot: "bg-blue-500" },
  { id: "cancelled", label: "ยกเลิก (Cancelled)", dot: "bg-gray-400" },
];

const getCounterpartyName = (doc) => {
  if (doc?.values) {
    if (doc.values.counterparty_name) return doc.values.counterparty_name;
    if (doc.values.reseller_company_name) return doc.values.reseller_company_name;
    if (doc.values.distributor_company_name && doc.values.distributor_company_name !== "บริษัท เครสท์ เซนโด จำกัด") {
      return doc.values.distributor_company_name;
    }
  }
  if (doc?.billTo && (doc.billTo.companyName || doc.billTo.name)) {
    return doc.billTo.companyName || doc.billTo.name;
  }
  return "-";
};

function PdfIcon({ className = "w-8 h-9" }) {
  return (
    <svg className={className} viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 0C1.79086 0 0 1.79086 0 4V34C0 36.2091 1.79086 38 4 38H28C30.2091 38 32 36.2091 32 34V10L22 0H4Z" fill="#E53935"/>
      <path d="M22 0L32 10H24C22.8954 10 22 9.10457 22 8V0Z" fill="#C62828"/>
      <text x="16" y="27" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">PDF</text>
    </svg>
  );
}

function getContractFullName(doc) {
  if (doc.templateId === "nda" || doc.name?.startsWith("NDA")) {
    return "หนังสือสัญญาไม่เปิดเผยข้อมูล";
  }
  if (doc.templateId === "distributor" || doc.name?.includes("Distributor")) {
    return "สัญญาแต่งตั้งและจัดจำหน่ายซอฟต์แวร์";
  }
  if (doc.templateId === "partner" || doc.name?.includes("Partner")) {
    return "สัญญาแต่งตั้งพันธมิตรตัวแทนจำหน่าย";
  }
  return doc.templateName || "หนังสือสัญญา";
}

function formatDateTime(dateString) {
  if (!dateString) return { dateStr: "-", timeStr: "" };
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return { dateStr: dateString, timeStr: "" };

  const dateStr = d.toLocaleDateString("th-TH");
  const timeStr = d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.";
  return { dateStr, timeStr };
}

export default function DocumentsTable({
  documents = [],
  showSentTo = false,
  emptyMessage = "ยังไม่มีเอกสารในระบบ",
  deleteApiUrl = "/api/documents",
  allowEdit = true,
  onRefresh,
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openStatusMenuId, setOpenStatusMenuId] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [emailDoc, setEmailDoc] = useState(null);
  const [renameDoc, setRenameDoc] = useState(null);
  const [duplicatingId, setDuplicatingId] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Custom Delete Confirmation Modal State (null | { type: 'single', id, docName } | { type: 'bulk', count })
  const [deleteModalState, setDeleteModalState] = useState(null);

  const menuRef = useRef(null);
  const statusMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target)) {
        setOpenStatusMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIds((prev) => prev.filter((id) => documents.some((d) => d.id === id)));
  }, [documents]);

  const allVisibleIds = documents.map((d) => d.id);
  const isAllSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.includes(id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allVisibleIds);
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 1-Click Duplicate Document
  const handleDuplicate = async (doc) => {
    setDuplicatingId(doc.id);
    try {
      const duplicateName = `[สำเนา] ${doc.name || "เอกสาร"}`;
      let newDoc;

      if (doc.templateId === "quotation") {
        const payload = {
          ...doc,
          name: duplicateName,
          status: "draft",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        delete payload.id;
        delete payload._id;

        const res = await fetch("/api/quotations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("คัดลอกใบเสนอราคาไม่สำเร็จ");
        newDoc = await res.json();
      } else {
        const payload = {
          ...doc,
          name: duplicateName,
          status: "draft",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        delete payload.id;
        delete payload._id;

        const res = await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("คัดลอกเอกสารไม่สำเร็จ");
        newDoc = await res.json();
      }

      setToast({
        message: `คัดลอกเอกสาร "${duplicateName}" เรียบร้อยแล้ว`,
        action: {
          label: "เปิดแก้ไขทันที",
          onClick: () => {
            const targetPath = doc.templateId === "quotation"
              ? `/create/quotation?id=${newDoc.id}`
              : `/create/${doc.templateId || "nda"}?id=${newDoc.id}`;
            router.push(targetPath);
          },
        },
      });

      if (onRefresh) {
        onRefresh();
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Duplicate error:", err);
      alert("เกิดข้อผิดพลาดในการคัดลอกเอกสาร");
    } finally {
      setDuplicatingId(null);
    }
  };

  // 1-Click Convert Quotation to Receipt
  const handleCreateReceiptFromQuotation = async (doc) => {
    setOpenMenuId(null);
    try {
      const receiptNo = `REC-${new Date().getFullYear() + 543}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 900) + 100)}`;
      const receiptName = `ใบเสร็จรับเงิน ${receiptNo} (${doc.quotationNo || doc.name})`;
      const payload = {
        ...doc,
        name: receiptName,
        quotationNo: receiptNo,
        originalQuotationNo: doc.quotationNo,
        status: "completed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      delete payload.id;
      delete payload._id;

      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("ออกใบเสร็จไม่สำเร็จ");
      const newReceipt = await res.json();

      setToast({
        message: `ออกใบเสร็จรับเงิน "${receiptName}" สำเร็จแล้ว`,
        action: {
          label: "เปิดดูใบเสร็จ",
          onClick: () => {
            router.push(`/create/quotation?id=${newReceipt.id}`);
          },
        },
      });

      if (onRefresh) {
        onRefresh();
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Create receipt error:", err);
      alert("เกิดข้อผิดพลาดในการออกใบเสร็จรับเงิน");
    }
  };

  // Instant Status Change
  const handleUpdateStatus = async (doc, newStatus) => {
    setOpenStatusMenuId(null);
    setOpenMenuId(null);
    try {
      if (doc.templateId === "quotation") {
        await fetch(`/api/quotations/${doc.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...doc, status: newStatus }),
        });
      } else {
        await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...doc, status: newStatus }),
        });
      }

      setToast({
        message: `เปลี่ยนสถานะเป็น "${statusLabel[newStatus] || newStatus}" เรียบร้อยแล้ว`,
      });

      if (onRefresh) {
        onRefresh();
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะเอกสาร");
    }
  };

  // Trigger Confirmation Modal for Single Delete
  const requestSingleDelete = (doc) => {
    setDeleteModalState({
      type: "single",
      id: doc.id,
      docName: doc.name || "เอกสารนี้",
    });
  };

  // Trigger Confirmation Modal for Bulk Delete
  const requestBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteModalState({
      type: "bulk",
      count: selectedIds.length,
    });
  };

  // Execute Single Delete after Pop-up confirmation
  const confirmSingleDelete = async (id) => {
    setDeletingId(id);
    setDeleteModalState(null);
    try {
      await fetch(`${deleteApiUrl}?id=${id}`, { method: "DELETE" });
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      if (onRefresh) {
        onRefresh();
      } else {
        router.refresh();
        window.location.reload();
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Execute Bulk Delete after Pop-up confirmation
  const confirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkDeleting(true);
    setDeleteModalState(null);
    try {
      const idsParam = encodeURIComponent(selectedIds.join(","));
      const res = await fetch(`${deleteApiUrl}?ids=${idsParam}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!res.ok) throw new Error("ลบรายการไม่สำเร็จ");
      setSelectedIds([]);
      if (onRefresh) {
        onRefresh();
      } else {
        router.refresh();
        window.location.reload();
      }
    } catch (err) {
      console.error("Bulk delete error:", err);
      alert("เกิดข้อผิดพลาดในการลบรายการที่เลือก");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handlePrintOrExport = (doc) => {
    window.open(`/print/${doc.templateId || "nda"}?id=${doc.id}`, "_blank");
  };

  return (
    <>
      {/* Toast Notification with Quick Action */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-gray-900/95 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200 border border-gray-700/60 backdrop-blur-md">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span className="leading-snug">{toast.message}</span>
          {toast.action && (
            <button
              onClick={() => {
                toast.action.onClick();
                setToast(null);
              }}
              className="ml-1 px-2.5 py-1 rounded-lg bg-[#5542F6] hover:bg-[#4332D6] text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span>{toast.action.label}</span>
              <ArrowRight size={12} />
            </button>
          )}
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="mb-3 p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>เลือกอยู่ {selectedIds.length} รายการ</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              ยกเลิกการเลือก
            </button>
            <button
              onClick={requestBulkDelete}
              disabled={isBulkDeleting}
              className="px-4 py-1.5 rounded-xl bg-[#FF3B30] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Trash2 size={14} className="text-white" />
              <span className="text-white">{isBulkDeleting ? "กำลังลบ..." : `ลบรายการที่เลือก (${selectedIds.length})`}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-surface border border-border rounded-2xl shadow-xs overflow-hidden transition-colors">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground bg-muted/50">
              {/* Checkbox Column */}
              <th className="w-[5%] px-4 py-3.5 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                  title={isAllSelected ? "ยกเลิกเลือกทั้งหมด" : "เลือกทั้งหมด"}
                />
              </th>
              <th className="w-[28%] px-4 py-3.5">ชื่อเอกสาร</th>
              <th className="w-[20%] px-4 py-3.5">{showSentTo ? "ส่งไปยัง" : "คู่สัญญา / ลูกค้า"}</th>
              <th className="w-[18%] px-4 py-3.5">เทมเพลต</th>
              <th className="w-[15%] px-4 py-3.5">แก้ไขล่าสุด</th>
              <th className="w-[12%] px-2 py-3.5 text-center">สถานะ</th>
              <th className="w-[12%] px-4 py-3.5 text-right whitespace-nowrap">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              documents.map((doc, docIdx) => {
                const { dateStr, timeStr } = formatDateTime(doc.updatedAt || doc.createdAt);
                const isSelected = selectedIds.includes(doc.id);
                const isNearBottom = docIdx >= Math.max(0, documents.length - 2);
                const counterparty = getCounterpartyName(doc);

                return (
                  <tr
                    key={doc.id}
                    className={`transition-colors ${
                      isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/40"
                    }`}
                  >
                    {/* Checkbox Row Cell */}
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(doc.id)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                      />
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <PdfIcon className="w-8 h-9 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 group/name flex-wrap">
                            <Link
                              href={`/documents/${doc.id}`}
                              className="font-semibold text-foreground text-sm leading-snug truncate max-w-[200px] sm:max-w-xs hover:text-[#5542F6] hover:underline"
                              title={doc.name}
                            >
                              {doc.name}
                            </Link>
                            <button
                              onClick={() => setRenameDoc(doc)}
                              className="opacity-0 group-hover/name:opacity-100 p-0.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-all cursor-pointer"
                              title="เปลี่ยนชื่อเอกสาร"
                            >
                              <Pencil size={11} />
                            </button>
                            {(doc.lastSentAt || doc.sentTo) && (
                              <Link
                                href="/history"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200/80 hover:bg-blue-100 transition-colors"
                                title={`มีประวัติส่งออกแล้วเมื่อ ${doc.lastSentAt || ""} - คลิกเพื่อดูประวัติการส่ง`}
                              >
                                <span>✉️ เคยส่งแล้ว</span>
                              </Link>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {getContractFullName(doc)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-foreground font-medium">
                      {showSentTo ? (
                        <span className="truncate block" title={doc.sentTo || "-"}>
                          {doc.sentTo || "-"}
                        </span>
                      ) : (
                        <span className="truncate block text-xs" title={counterparty}>
                          {counterparty}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      <span className="line-clamp-1 text-xs leading-relaxed" title={doc.templateName}>
                        {doc.templateName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="text-foreground text-xs font-medium">{dateStr}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{timeStr}</p>
                    </td>

                    {/* Status Column with Interactive Status Changer */}
                    <td className="px-2 py-3.5 text-center whitespace-nowrap relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenStatusMenuId(openStatusMenuId === doc.id ? null : doc.id);
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                          statusStyles[doc.status] || "bg-muted text-muted-foreground"
                        }`}
                        title="คลิกเพื่อเปลี่ยนสถานะ"
                      >
                        <span>{statusLabel[doc.status] || doc.status}</span>
                      </button>

                      {/* Status Dropdown Menu */}
                      {openStatusMenuId === doc.id && (
                        <div
                          ref={statusMenuRef}
                          className={`absolute left-1/2 -translate-x-1/2 ${
                            isNearBottom ? "bottom-10" : "top-10"
                          } w-40 bg-surface border border-border rounded-xl shadow-xl py-1 z-50 text-left animate-in fade-in zoom-in-95 duration-100`}
                        >
                          <div className="px-3 py-1.5 border-b border-border text-[10px] font-bold text-muted-foreground uppercase">
                            เปลี่ยนสถานะ
                          </div>
                          {statusList.map((st) => (
                            <button
                              key={st.id}
                              onClick={() => handleUpdateStatus(doc, st.id)}
                              className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-muted flex items-center justify-between transition-colors cursor-pointer ${
                                doc.status === st.id ? "text-primary font-bold bg-primary/5" : "text-foreground"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                                <span>{st.label}</span>
                              </div>
                              {doc.status === st.id && <Check size={13} className="text-primary" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Action Column */}
                    <td className="px-4 py-3.5 relative whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title="ดูตัวอย่างเอกสาร (Preview)"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleDuplicate(doc)}
                          disabled={duplicatingId === doc.id}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer disabled:opacity-40"
                          title="คัดลอกสร้างซ้ำใน 1 คลิก (Duplicate)"
                        >
                          <Copy size={16} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === doc.id ? null : doc.id);
                          }}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title="การดำเนินการเพิ่มเติม"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {openMenuId === doc.id && (
                          <div
                            ref={menuRef}
                            className={`absolute right-4 ${isNearBottom ? "bottom-10" : "top-11"} w-52 bg-surface text-foreground rounded-xl shadow-xl border border-border py-1 z-50 animate-in fade-in zoom-in-95 duration-100 opacity-100 text-left`}
                          >
                            <Link
                              href={`/documents/${doc.id}`}
                              className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#5542F6] hover:bg-purple-50 flex items-center gap-2.5 transition-colors whitespace-nowrap"
                            >
                              <Eye size={14} className="text-[#5542F6]" />
                              <span>สตูดิโอตรวจทาน & สายอนุมัติ</span>
                            </Link>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                handleDuplicate(doc);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2.5 transition-colors whitespace-nowrap cursor-pointer"
                            >
                              <Copy size={14} className="text-primary" />
                              <span>คัดลอกเอกสารนี้</span>
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                setRenameDoc(doc);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2.5 transition-colors whitespace-nowrap cursor-pointer"
                            >
                              <Pencil size={14} className="text-muted-foreground" />
                              <span>เปลี่ยนชื่อเอกสาร</span>
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                setEmailDoc(doc);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2.5 transition-colors whitespace-nowrap cursor-pointer"
                            >
                              <Send size={14} className="text-muted-foreground" />
                              <span>ส่งอีเมล</span>
                            </button>
                            {allowEdit && (
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  const targetPath = doc.templateId === "quotation"
                                    ? `/create/quotation?id=${doc.id}`
                                    : `/create/${doc.templateId || "nda"}?id=${doc.id}`;
                                  router.push(targetPath);
                                }}
                                className="w-full text-left px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2.5 transition-colors whitespace-nowrap cursor-pointer"
                              >
                                <Edit3 size={14} className="text-muted-foreground" />
                                <span>แก้ไขเอกสาร</span>
                              </button>
                            )}
                            {doc.templateId === "quotation" && (
                              <>
                                <button
                                  onClick={() => handleCreateReceiptFromQuotation(doc)}
                                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 flex items-center gap-2.5 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                  <span className="text-sm leading-none">🧾</span>
                                  <span>ออกใบเสร็จรับเงิน (Receipt)</span>
                                </button>
                                <button
                                  onClick={async () => {
                                    setOpenMenuId(null);
                                    try {
                                      const res = await fetch(`/api/quotations/${doc.id}/revision`, { method: "POST" });
                                      if (!res.ok) throw new Error();
                                      const newRev = await res.json();
                                      router.push(`/create/quotation?id=${newRev.id}`);
                                    } catch {
                                      alert("ไม่สามารถสร้างฉบับปรับปรุงได้");
                                    }
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                  <CopyPlus size={14} className="text-emerald-600" />
                                  <span>สร้างฉบับปรับปรุง (New Rev)</span>
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                handlePrintOrExport(doc);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2.5 transition-colors whitespace-nowrap cursor-pointer"
                            >
                              <Download size={14} className="text-muted-foreground" />
                              <span>Export PDF / พิมพ์</span>
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                requestSingleDelete(doc);
                              }}
                              disabled={deletingId === doc.id}
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 flex items-center gap-2.5 transition-colors disabled:opacity-40 whitespace-nowrap cursor-pointer"
                            >
                              <Trash2 size={14} className="text-destructive" />
                              <span>ลบเอกสาร</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 1-to-1 Match Pop-Up Confirmation Delete Modal UI */}
      {deleteModalState && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-[24px] shadow-2xl w-full max-w-sm p-6 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-150 relative overflow-hidden">
            
            {/* Trash Can Illustration with Sparkles */}
            <div className="relative flex flex-col items-center justify-center pt-2">
              <div className="relative w-24 h-20 flex items-center justify-center">
                {/* Decorative Sparkles */}
                <span className="absolute top-0 left-1 text-[#FF3B30] text-sm font-bold animate-pulse">+</span>
                <span className="absolute top-3 right-2 text-[#FF3B30] text-xs font-bold">+</span>
                <span className="absolute bottom-5 left-0 text-[#FF3B30] text-xs font-bold">+</span>
                <span className="absolute top-8 right-0 w-2 h-2 rounded-full bg-[#FF3B30]/60" />
                <span className="absolute bottom-3 right-4 w-1.5 h-1.5 rounded-full bg-[#FF3B30]/70" />
                
                {/* Trash Icon Badge */}
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-[#FF3B30]">
                  <Trash2 size={36} className="text-[#FF3B30] stroke-[2.2]" />
                </div>
              </div>
              
              {/* Soft Oval Shadow Ground */}
              <div className="w-24 h-2 bg-red-500/20 rounded-full blur-[2px] mt-1" />
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                {deleteModalState.type === "bulk"
                  ? `ต้องการลบเอกสาร ${deleteModalState.count} รายการหรือไม่?`
                  : "ต้องการลบเอกสารหรือไม่?"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                {deleteModalState.type === "bulk"
                  ? `เอกสารที่เลือกทั้งหมด ${deleteModalState.count} รายการจะถูกลบออกจากระบบอย่างถาวร และไม่สามารถกู้คืนกลับมาได้`
                  : `เอกสาร "${deleteModalState.docName}" จะถูกลบออกจากระบบอย่างถาวร และไม่สามารถกู้คืนกลับมาได้`}
              </p>
            </div>

            {/* 2-Column Action Buttons matching reference image */}
            <div className="grid grid-cols-2 gap-3 pt-3 w-full">
              <button
                onClick={() => setDeleteModalState(null)}
                className="w-full h-11 rounded-2xl border border-[#FF3B30] text-[#FF3B30] bg-surface hover:bg-[#FF3B30]/10 text-sm font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteModalState.type === "bulk") {
                    confirmBulkDelete();
                  } else {
                    confirmSingleDelete(deleteModalState.id);
                  }
                }}
                className="w-full h-11 rounded-2xl bg-[#FF3B30] hover:bg-[#E03126] text-white text-sm font-bold transition-colors shadow-xs flex items-center justify-center cursor-pointer"
              >
                <span className="text-white font-bold">Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-Up Modal Preview */}
      {previewDoc && (
        <PreviewModal
          doc={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {/* Pop-Up Modal Send Email */}
      {emailDoc && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto animate-in fade-in duration-150">
          <EmailScreen
            documentId={emailDoc.id}
            defaultSubject={`เอกสาร ${emailDoc.templateName || emailDoc.name || "เอกสาร"}`}
            fileName={emailDoc.name || `${emailDoc.templateId || "document"}.pdf`}
            templateId={emailDoc.templateId || "nda"}
            templateName={emailDoc.templateName}
            values={emailDoc.values || {}}
            onBack={() => setEmailDoc(null)}
            onSent={() => {
              setEmailDoc(null);
              if (onRefresh) onRefresh();
            }}
          />
        </div>
      )}

      {/* Pop-Up Modal Rename Document */}
      {renameDoc && (
        <RenameModal
          doc={renameDoc}
          onClose={() => setRenameDoc(null)}
          onRenamed={() => {
            if (onRefresh) onRefresh();
            else router.refresh();
          }}
        />
      )}
    </>
  );
}

function RenameModal({ doc, onClose, onRenamed }) {
  const [name, setName] = useState(doc.name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const endpoint = doc.templateId === "quotation" ? "/api/quotations" : "/api/documents";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: doc.id, name: name.trim() }),
      });
      if (!res.ok) throw new Error("ไม่สามารถเปลี่ยนชื่อเอกสารได้");
      onRenamed();
      onClose();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเปลี่ยนชื่อเอกสาร");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E4E4E8] rounded-[24px] shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F5F1FF] text-[#5542F6] flex items-center justify-center">
              <Pencil size={16} />
            </div>
            <h3 className="text-base font-bold text-gray-900">เปลี่ยนชื่อเอกสาร</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">ชื่อเอกสารใหม่</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ระบุชื่อเอกสาร..."
              className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#5542F6] focus:ring-2 focus:ring-[#F5F1FF] transition-all"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="w-full h-10 rounded-xl bg-[#5542F6] hover:bg-[#4332D6] text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center disabled:opacity-50 cursor-pointer"
            >
              <span>{saving ? "กำลังบันทึก..." : "บันทึกชื่อใหม่"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PreviewModal({ doc, onClose }) {
  const entry = templateRegistry[doc.templateId || "nda"];
  const [modalValues, setModalValues] = useState(doc.values || {});

  useEffect(() => {
    const { schema } = entry || {};
    if (!schema) return;

    getFieldProfile(doc.profileId).then((profile) => {
      const merged = { ...doc.values };
      const profileValues = profile?.values || profile || {};

      if (Array.isArray(schema.fields)) {
        for (const field of schema.fields) {
          if (field.sharedKey && profileValues[field.sharedKey]) {
            merged[field.id] = merged[field.id] || profileValues[field.sharedKey];
          }
        }
      }
      setModalValues(merged);
    });
  }, [doc, entry]);

  if (!entry) return null;
  const { schema, pages, DocumentComponent } = entry;
  const isQuotation = doc.templateId === "quotation" || schema?.type === "quotation" || Boolean(DocumentComponent);
  const quotationPageCount = isQuotation ? (paginateQuotationLineItems(modalValues.lineItems || []).length || 1) : 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-border">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground text-base">{doc.name}</h3>
              <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${statusStyles[doc.status] || "bg-muted text-muted-foreground"}`}>
                {statusLabel[doc.status] || doc.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              เทมเพลต: {doc.templateName} • สร้างเมื่อ {new Date(doc.createdAt).toLocaleDateString("th-TH")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="ปิดหน้าต่าง"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Readonly Preview Canvas */}
        <div className="flex-1 overflow-auto bg-muted p-8 flex flex-col items-center gap-8">
          {isQuotation ? (
            Array.from({ length: quotationPageCount }, (_, i) => (
              <div key={i} className="shrink-0">
                <QuotationDocument quotation={modalValues} currentPage={i + 1} />
              </div>
            ))
          ) : (
            <DocumentFieldsProvider key={JSON.stringify(modalValues)} initialValues={modalValues} defaultReadOnly>
              {(pages || []).map((PageContent, i) => (
                <div
                  key={i}
                  className="bg-[#FFFFFF] shadow-document w-[794px] min-h-[1123px] px-14 pt-10 pb-6 flex flex-col justify-between font-noto-looped text-gray-900 rounded-sm shrink-0"
                >
                  <DocumentHeader logo={schema?.logo} />
                  <div className="flex-1 min-h-0 overflow-hidden text-left">
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
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-border flex items-center justify-between bg-muted/30">
          <p className="text-xs text-muted-foreground">โหมดแสดงตัวอย่างเอกสาร (อ่านอย่างเดียว)</p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
