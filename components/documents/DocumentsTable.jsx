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
  FileText,
  Globe,
  Image as ImageIcon,
  Loader2,
  Receipt,
  Mail,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { templateRegistry } from "@/lib/templates/registry";
import { getFieldProfile } from "@/lib/data/fieldProfiles";
import { DocumentFieldsProvider } from "@/context/DocumentFieldsContext";
import { paginateQuotationLineItems } from "@/lib/quotationHelpers";
import QuotationDocument from "@/components/document/quotation/QuotationDocument";
import DocumentHeader from "@/components/document/DocumentHeader";
import DocumentFooter from "@/components/document/DocumentFooter";
import EmailScreen from "@/components/document/EmailScreen";
import { extractDocumentMeta } from "@/lib/data/documentMeta";

const getCounterpartyName = (doc) => {
  if (doc?.values) {
    if (doc.values.counterparty_name) return doc.values.counterparty_name;
    if (doc.values.recipient) return doc.values.recipient;
    if (doc.values.reseller_company_name) return doc.values.reseller_company_name;
    if (doc.values.distributor_company_name && doc.values.distributor_company_name !== "บริษัท เครสท์ เซนโด จำกัด" && doc.values.distributor_company_name !== "Crest Zendo Co., Ltd.") {
      return doc.values.distributor_company_name;
    }
    if (doc.values.subject) return doc.values.subject;
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
    return "Non-Disclosure Agreement (NDA)";
  }
  if (doc.templateId === "distributor" || doc.name?.includes("Distributor")) {
    return "Software Distribution Agreement";
  }
  if (doc.templateId === "partner" || doc.name?.includes("Partner")) {
    return "Partner Distribution Agreement";
  }
  if (doc.templateId === "notification" || doc.name?.includes("Notification") || doc.name?.includes("หนังสือแจ้ง")) {
    return "Headquarters Relocation Notice";
  }
  return doc.templateName || "Agreement";
}

function formatDateTime(dateString) {
  if (!dateString) return { dateStr: "-", timeStr: "" };
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return { dateStr: dateString, timeStr: "" };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;
  return { dateStr, timeStr };
}

export default function DocumentsTable({
  documents = [],
  showSentTo = false,
  emptyMessage = "No documents found",
  deleteApiUrl = "/api/documents",
  allowEdit = true,
  onRefresh,
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [emailDoc, setEmailDoc] = useState(null);
  const [renameDoc, setRenameDoc] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Custom Delete Confirmation Modal State (null | { type: 'single', id, docName } | { type: 'bulk', count })
  const [deleteModalState, setDeleteModalState] = useState(null);
  const [expandedExportDocId, setExpandedExportDocId] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
        setExpandedExportDocId(null);
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
    try {
      const duplicateName = `[Copy] ${doc.name || "Document"}`;
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
        if (!res.ok) throw new Error("Failed to duplicate quotation");
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
        if (!res.ok) throw new Error("Failed to duplicate document");
        newDoc = await res.json();
      }

      setToast({
        message: `Duplicated "${duplicateName}" successfully`,
        action: {
          label: "Edit Now",
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
      alert("Failed to duplicate document");
    }
  };

  // 1-Click Convert Quotation to Receipt
  const handleCreateReceiptFromQuotation = async (doc) => {
    setOpenMenuId(null);
    try {
      const receiptNo = `REC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 900) + 100)}`;
      const receiptName = `Receipt ${receiptNo} (${doc.quotationNo || doc.name})`;
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
      if (!res.ok) throw new Error("Failed to generate receipt");
      const newReceipt = await res.json();

      setToast({
        message: `Receipt "${receiptName}" generated successfully`,
        action: {
          label: "View Receipt",
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
      alert("Failed to generate receipt");
    }
  };

  // Trigger Confirmation Modal for Single Delete
  const requestSingleDelete = (doc) => {
    setDeleteModalState({
      type: "single",
      id: doc.id,
      docName: doc.name || "this document",
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
      if (!res.ok) throw new Error("Failed to delete items");
      setSelectedIds([]);
      if (onRefresh) {
        onRefresh();
      } else {
        router.refresh();
        window.location.reload();
      }
    } catch (err) {
      console.error("Bulk delete error:", err);
      alert("Failed to delete selected items");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const [downloadingDocId, setDownloadingDocId] = useState(null);

  const handlePrintOrExport = (doc) => {
    window.open(`/print/${doc.templateId || "nda"}?id=${doc.id}`, "_blank");
  };

  const handleDirectExport = async (doc, format = "pdf") => {
    setDownloadingDocId(`${doc.id}_${format}`);
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: doc.templateId || "nda",
          values: doc.values || {},
          quotationData: doc.values || {},
          fileName: doc.name || "document",
          format,
        }),
      });
      if (!res.ok) throw new Error("Failed to export document");
      const blob = await res.blob();
      const baseName = (doc.name || "document").replace(/\.(pdf|html|webp)$/i, "");
      const downloadFileName = `${baseName}.${format}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to download document");
    } finally {
      setDownloadingDocId(null);
    }
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
              className="ml-1 px-2.5 py-1 rounded-lg bg-[#7C3AED] hover:bg-[#4332D6] text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
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
            <span>{selectedIds.length} items selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={requestBulkDelete}
              disabled={isBulkDeleting}
              className="px-4 py-1.5 rounded-xl bg-[#FF3B30] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Trash2 size={14} className="text-white" />
              <span className="text-white">{isBulkDeleting ? "Deleting..." : `Delete selected (${selectedIds.length})`}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-surface border border-border rounded-[12px] shadow-2xs overflow-hidden transition-colors">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground bg-muted/40">
              {/* Checkbox Column */}
              <th className="w-[48px] px-4 py-3.5 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                  title={isAllSelected ? "Deselect all" : "Select all"}
                />
              </th>
              <th className="px-4 py-3.5">Document Name</th>
              <th className="w-[24%] px-4 py-3.5">{showSentTo ? "Sent To" : "Counterparty / Recipient"}</th>
              <th className="w-[18%] px-4 py-3.5">Template</th>
              <th className="w-[14%] px-4 py-3.5">Last Modified</th>
              <th className="w-[110px] px-4 py-3.5 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              documents.map((doc, docIdx) => {
                const meta = extractDocumentMeta(doc);
                const isSelected = selectedIds.includes(doc.id);
                const isNearBottom = docIdx >= Math.max(0, documents.length - 2);

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

                    {/* Document Title & Meta */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-[8px] bg-muted/80 flex items-center justify-center text-muted-foreground shrink-0 border border-border/60">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 group/name">
                            <Link
                              href={`/documents/${doc.id}`}
                              className="font-medium text-foreground text-sm leading-snug truncate max-w-[260px] sm:max-w-xs hover:text-primary transition-colors"
                              title={meta.name}
                            >
                              {meta.name}
                            </Link>
                            <button
                              onClick={() => setRenameDoc(doc)}
                              className="opacity-0 group-hover/name:opacity-100 p-0.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-all cursor-pointer"
                              title="Rename document"
                            >
                              <Pencil size={11} />
                            </button>
                          </div>
                          {meta.docNumber ? (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {meta.docNumber}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    {/* Client / Counterparty */}
                    <td className="px-4 py-3.5">
                      {showSentTo ? (
                        <span className="truncate block text-xs font-medium text-foreground" title={doc.sentTo || "-"}>
                          {doc.sentTo || "-"}
                        </span>
                      ) : (
                        <div>
                          <p className="text-xs font-medium text-foreground truncate max-w-[220px]" title={meta.counterpartyName}>
                            {meta.counterpartyName}
                          </p>
                          {meta.contactPerson && (
                            <p className="text-[11px] text-muted-foreground truncate max-w-[220px] mt-0.5" title={meta.contactPerson}>
                              {meta.contactPerson}
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Template */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-muted-foreground font-normal">
                        {meta.templateName}
                      </span>
                    </td>

                    {/* Last Modified */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="text-foreground text-xs font-medium" title={meta.fullDateTime}>
                        {meta.relativeTime}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatDateTime(meta.updatedAt).dateStr}
                      </p>
                    </td>

                    {/* Action Column */}
                    <td className="px-4 py-3.5 relative whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 rounded-[6px] hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title="Preview document"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => {
                            const targetPath = doc.templateId === "quotation"
                              ? `/create/quotation?id=${doc.id}`
                              : `/create/${doc.templateId || "nda"}?id=${doc.id}`;
                            router.push(targetPath);
                          }}
                          className="p-1.5 rounded-[6px] hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title="Edit document"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (openMenuId === doc.id) {
                              setOpenMenuId(null);
                              setExpandedExportDocId(null);
                            } else {
                              setOpenMenuId(doc.id);
                              setExpandedExportDocId(null);
                            }
                          }}
                          className="p-1.5 rounded-[6px] hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title="More actions"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {openMenuId === doc.id && (
                          <div
                            ref={menuRef}
                            className={`absolute right-4 ${isNearBottom ? "bottom-10" : "top-11"} w-56 bg-surface text-foreground rounded-xl shadow-xl border border-border py-1 z-50 animate-in fade-in zoom-in-95 duration-100 opacity-100 text-left`}
                          >
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                handleDuplicate(doc);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2.5 transition-colors whitespace-nowrap cursor-pointer"
                            >
                              <Copy size={14} className="text-muted-foreground" />
                              <span>Duplicate document</span>
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                setRenameDoc(doc);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2.5 transition-colors whitespace-nowrap cursor-pointer"
                            >
                              <Pencil size={14} className="text-muted-foreground" />
                              <span>Rename document</span>
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                setEmailDoc(doc);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2.5 transition-colors whitespace-nowrap cursor-pointer"
                            >
                              <Send size={14} className="text-muted-foreground" />
                              <span>Send email</span>
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
                                <span>Edit document</span>
                              </button>
                            )}
                            {doc.templateId === "quotation" && (
                              <>
                                <button
                                  onClick={() => handleCreateReceiptFromQuotation(doc)}
                                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2.5 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                  <Receipt size={14} className="text-muted-foreground" />
                                  <span>Generate receipt</span>
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
                                      alert("Failed to create revision");
                                    }
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2.5 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                  <CopyPlus size={14} className="text-muted-foreground" />
                                  <span>Create new revision</span>
                                </button>
                              </>
                            )}

                            {/* 📥 Unified Export Item (Click to expand 3 formats) */}
                            <div className="border-t border-border/50 my-1 pt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedExportDocId(expandedExportDocId === doc.id ? null : doc.id);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between transition-colors whitespace-nowrap cursor-pointer ${
                                  expandedExportDocId === doc.id
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-foreground hover:bg-muted"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <Download
                                    size={14}
                                    className={expandedExportDocId === doc.id ? "text-primary" : "text-muted-foreground"}
                                  />
                                  <span>Export document</span>
                                </div>
                                <ChevronRight
                                  size={13}
                                  className={`text-muted-foreground transition-transform duration-200 ${
                                    expandedExportDocId === doc.id ? "rotate-90 text-primary" : ""
                                  }`}
                                />
                              </button>

                              {expandedExportDocId === doc.id && (
                                <div className="mx-2 my-1 p-1 bg-muted/60 rounded-lg border border-border/60 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setExpandedExportDocId(null);
                                      handlePrintOrExport(doc);
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-background hover:shadow-xs rounded-md flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer"
                                  >
                                    <FileText size={13} className="text-red-500 shrink-0" />
                                    <span>Export PDF / Print</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setExpandedExportDocId(null);
                                      handleDirectExport(doc, "html");
                                    }}
                                    disabled={downloadingDocId === `${doc.id}_html`}
                                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-background hover:shadow-xs rounded-md flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer disabled:opacity-50"
                                  >
                                    {downloadingDocId === `${doc.id}_html` ? (
                                      <Loader2 size={13} className="animate-spin text-blue-500 shrink-0" />
                                    ) : (
                                      <Globe size={13} className="text-blue-500 shrink-0" />
                                    )}
                                    <span>Export HTML (.html)</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setExpandedExportDocId(null);
                                      handleDirectExport(doc, "webp");
                                    }}
                                    disabled={downloadingDocId === `${doc.id}_webp`}
                                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-background hover:shadow-xs rounded-md flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer disabled:opacity-50"
                                  >
                                    {downloadingDocId === `${doc.id}_webp` ? (
                                      <Loader2 size={13} className="animate-spin text-purple-500 shrink-0" />
                                    ) : (
                                      <ImageIcon size={13} className="text-purple-500 shrink-0" />
                                    )}
                                    <span>Export WebP (.webp)</span>
                                  </button>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                requestSingleDelete(doc);
                              }}
                              disabled={deletingId === doc.id}
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 flex items-center gap-2.5 transition-colors disabled:opacity-40 whitespace-nowrap cursor-pointer"
                            >
                              <Trash2 size={14} className="text-destructive" />
                              <span>Delete document</span>
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
                  ? `Delete ${deleteModalState.count} selected documents?`
                  : "Delete document?"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                {deleteModalState.type === "bulk"
                  ? `All ${deleteModalState.count} selected documents will be permanently removed from workspace. This action cannot be undone.`
                  : `Document "${deleteModalState.docName}" will be permanently removed from workspace. This action cannot be undone.`}
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
            defaultSubject={`Document: ${emailDoc.templateName || emailDoc.name || "Document"}`}
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
      if (!res.ok) throw new Error("Failed to rename document");
      onRenamed();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to rename document");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E5E5E5] rounded-[24px] shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center">
              <Pencil size={16} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Rename Document</h3>
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
            <label className="text-xs font-semibold text-gray-700">New Document Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter document name..."
              className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#F5F3FF] transition-all"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="w-full h-10 rounded-xl bg-[#7C3AED] hover:bg-[#4332D6] text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center disabled:opacity-50 cursor-pointer"
            >
              <span>{saving ? "Saving..." : "Save Changes"}</span>
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
  const isQuotation = doc.templateId === "quotation" || schema?.type === "quotation";
  const quotationPageCount = isQuotation ? (paginateQuotationLineItems(modalValues.lineItems || []).length || 1) : 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-border">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-base">{doc.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border/60">
                {doc.templateName || "Document"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Last modified {extractDocumentMeta(doc)?.relativeTime || "-"} • Created {formatDateTime(doc.createdAt).dateStr}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Close"
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
          ) : DocumentComponent ? (
            <div className="shrink-0 shadow-document">
              <DocumentComponent data={modalValues} values={modalValues} quotation={modalValues} />
            </div>
          ) : (
            <DocumentFieldsProvider key={JSON.stringify(modalValues)} initialValues={modalValues} defaultReadOnly>
              {(pages || []).map((PageContent, i) => (
                <div
                  key={i}
                  className="bg-[#FFFFFF] shadow-document w-[794px] min-h-[1123px] flex flex-col justify-between font-noto-looped text-gray-900 rounded-sm shrink-0 overflow-hidden"
                  style={{
                    padding: `${schema?.hasHeader !== false ? "28px" : "0px"} 48px ${schema?.hasFooter !== false ? "28px" : "0px"} 48px`,
                    boxSizing: "border-box",
                  }}
                >
                  {schema?.hasHeader !== false && <DocumentHeader logo={schema?.logo} />}
                  <div className="flex-1 min-h-0 overflow-hidden text-left">
                    <PageContent />
                  </div>
                  {schema?.hasFooter !== false && (
                    <DocumentFooter
                      title={schema?.fullName}
                      pageNumber={i + 1}
                      totalPages={pages.length}
                    />
                  )}
                </div>
              ))}
            </DocumentFieldsProvider>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-border flex items-center justify-between bg-muted/30">
          <p className="text-xs text-muted-foreground">Document Preview Mode (Read-only)</p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
