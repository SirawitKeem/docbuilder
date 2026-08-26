"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, MoreHorizontal, Edit3, Trash2, X, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { templateRegistry } from "@/lib/templates/registry";
import { getFieldProfile } from "@/lib/data/fieldProfile";
import { DocumentFieldsProvider } from "@/context/DocumentFieldsContext";
import DocumentHeader from "@/components/document/DocumentHeader";
import DocumentFooter from "@/components/document/DocumentFooter";

const statusStyles = {
  sent: "bg-[#DDEEE2] text-[#17682F]",
  issued: "bg-[#E1F0FF] text-[#0066CC]",
  draft: "bg-[#FFF2CE] text-[#725000]",
  cancelled: "bg-[#F9DFD5] text-[#A73300]",
};

const statusLabel = {
  sent: "ส่งแล้ว",
  issued: "ออกเอกสารแล้ว",
  draft: "ร่าง",
  cancelled: "ยกเลิก",
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
  const [previewDoc, setPreviewDoc] = useState(null);
  
  // Custom Delete Confirmation Modal State (null | { type: 'single', id, docName } | { type: 'bulk', count })
  const [deleteModalState, setDeleteModalState] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
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
              className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              ยกเลิกการเลือก
            </button>
            <button
              onClick={requestBulkDelete}
              disabled={isBulkDeleting}
              className="px-4 py-1.5 rounded-xl bg-[#FF3B30] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1.5 shadow-2xs"
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
              <th className={`${showSentTo ? "w-[26%]" : "w-[30%]"} px-4 py-3.5`}>ชื่อเอกสาร</th>
              <th className={`${showSentTo ? "w-[19%]" : "w-[23%]"} px-4 py-3.5`}>เทมเพลต</th>
              {showSentTo ? (
                <th className="w-[19%] px-4 py-3.5">ส่งไปยัง</th>
              ) : (
                <th className="w-[13%] px-4 py-3.5">ผู้สร้าง</th>
              )}
              <th className="w-[14%] px-4 py-3.5">วันที่สร้าง</th>
              <th className="w-[10%] px-2 py-3.5 text-center">สถานะ</th>
              <th className="w-[10%] px-4 py-3.5 text-right whitespace-nowrap">การดำเนินการ</th>
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
              documents.map((doc) => {
                const { dateStr, timeStr } = formatDateTime(doc.createdAt);
                const isSelected = selectedIds.includes(doc.id);

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
                          <p className="font-semibold text-foreground text-sm leading-snug truncate" title={doc.name}>
                            {doc.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {getContractFullName(doc)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      <span className="line-clamp-1 text-xs leading-relaxed" title={doc.templateName}>
                        {doc.templateName}
                      </span>
                    </td>
                    {showSentTo ? (
                      <td className="px-4 py-3.5 text-foreground font-normal truncate" title={doc.sentTo || "-"}>
                        {doc.sentTo || "-"}
                      </td>
                    ) : (
                      <td className="px-4 py-3.5 text-muted-foreground">{doc.createdBy || "Admin"}</td>
                    )}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="text-foreground text-sm font-medium">{dateStr}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{timeStr}</p>
                    </td>
                    <td className="px-2 py-3.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyles[doc.status] || "bg-muted text-muted-foreground"}`}
                      >
                        {statusLabel[doc.status] || doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 relative whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="ดูตัวอย่างเอกสาร (Preview)"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === doc.id ? null : doc.id);
                          }}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="การดำเนินการเพิ่มเติม"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {openMenuId === doc.id && (
                          <div
                            ref={menuRef}
                            className="absolute right-5 top-11 w-40 bg-surface text-foreground rounded-xl shadow-xl border border-border py-1 z-50 animate-in fade-in zoom-in-95 duration-100 opacity-100"
                          >
                            {allowEdit && (
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  router.push(`/create/${doc.templateId || "nda"}?id=${doc.id}`);
                                }}
                                className="w-full text-left px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                              >
                                <Edit3 size={14} className="text-muted-foreground" />
                                แก้ไขเอกสาร
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                handlePrintOrExport(doc);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                            >
                              <Download size={14} className="text-muted-foreground" />
                              Export PDF / พิมพ์
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                requestSingleDelete(doc);
                              }}
                              disabled={deletingId === doc.id}
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors disabled:opacity-40"
                            >
                              <Trash2 size={14} className="text-destructive" />
                              ลบเอกสาร
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
    </>
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
  const { schema, pages } = entry;

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
          <DocumentFieldsProvider key={JSON.stringify(modalValues)} initialValues={modalValues} defaultReadOnly>
            {pages.map((PageContent, i) => (
              <div
                key={i}
                className="bg-[#FFFFFF] shadow-document w-[794px] min-h-[1123px] px-14 pt-10 pb-6 flex flex-col justify-between font-noto-looped text-gray-900 rounded-sm shrink-0"
              >
                <DocumentHeader logo={schema.logo} />
                <div className="flex-1 min-h-0 overflow-hidden text-left">
                  <PageContent />
                </div>
                <DocumentFooter
                  title={schema.fullName}
                  pageNumber={i + 1}
                  totalPages={pages.length}
                />
              </div>
            ))}
          </DocumentFieldsProvider>
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
