"use client";

import { useState, useMemo, useEffect } from "react";
import { Eye, Search, X } from "lucide-react";
import { templateRegistry } from "@/lib/templates/registry";
import { getFieldProfile } from "@/lib/data/fieldProfile";
import { DocumentFieldsProvider } from "@/context/DocumentFieldsContext";
import { paginateQuotationLineItems } from "@/lib/quotationHelpers";
import QuotationDocument from "@/components/document/quotation/QuotationDocument";
import DocumentHeader from "@/components/document/DocumentHeader";
import DocumentFooter from "@/components/document/DocumentFooter";

const statusStyles = {
  sent: "bg-success-100 text-success-600",
  draft: "bg-primary-100 text-primary-600",
  cancelled: "bg-gray-100 text-gray-500",
};
const statusLabel = { sent: "ส่งแล้ว", draft: "ร่าง", cancelled: "ยกเลิก" };

function PdfIcon({ className = "w-8 h-9" }) {
  return (
    <svg className={className} viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 0C1.79086 0 0 1.79086 0 4V34C0 36.2091 1.79086 38 4 38H28C30.2091 38 32 36.2091 32 34V10L22 0H4Z" fill="#E53935"/>
      <path d="M22 0L32 10H24C22.8954 10 22 9.10457 22 8V0Z" fill="#C62828"/>
      <text x="16" y="27" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">PDF</text>
    </svg>
  );
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
  documents,
  showSentTo = false,
  emptyMessage = "ยังไม่มีเอกสาร",
}) {
  const [query, setQuery] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return documents;
    const q = query.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.name?.toLowerCase().includes(q) ||
        doc.templateName?.toLowerCase().includes(q) ||
        doc.sentTo?.toLowerCase().includes(q)
    );
  }, [documents, query]);

  return (
    <div>
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อเอกสาร, เทมเพลต, ผู้รับ..."
            className="w-full h-9 pl-9 pr-8 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 shrink-0">
          ทั้งหมด <strong className="text-gray-900">{filtered.length}</strong> รายการ
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/75 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-3">ชื่อเอกสาร</th>
              <th className="px-5 py-3">เทมเพลต</th>
              {showSentTo ? <th className="px-5 py-3">ส่งถึง</th> : <th className="px-5 py-3">สร้างโดย</th>}
              <th className="px-5 py-3">วันที่ / เวลา</th>
              <th className="px-4 py-3 text-center">สถานะ</th>
              <th className="px-5 py-3 text-right">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filtered.map((doc) => {
                const { dateStr, timeStr } = formatDateTime(doc.createdAt);
                return (
                  <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <PdfIcon />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{doc.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">PDF Document</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      <span className="line-clamp-1 text-xs leading-relaxed" title={doc.templateName}>
                        {doc.templateName}
                      </span>
                    </td>
                    {showSentTo ? (
                      <td className="px-5 py-3.5 text-gray-700 font-normal truncate" title={doc.sentTo || "—"}>
                        {doc.sentTo || "—"}
                      </td>
                    ) : (
                      <td className="px-5 py-3.5 text-gray-500">{doc.createdBy || "Admin"}</td>
                    )}
                    <td className="px-5 py-3.5">
                      <p className="text-gray-900 text-sm font-semibold">{dateStr}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{timeStr}</p>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[doc.status]}`}
                      >
                        {statusLabel[doc.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
                          title="ดูตัวอย่างเอกสาร (Preview)"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pop-Up Modal Preview */}
      {previewDoc && (
        <PreviewModal
          doc={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/90">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-base">{doc.name}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[doc.status] || "bg-gray-100"}`}>
                {statusLabel[doc.status] || doc.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              เทมเพลต: {doc.templateName} • สร้างเมื่อ {new Date(doc.createdAt).toLocaleDateString("th-TH")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
            title="ปิดหน้าต่าง"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Readonly Preview Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8 flex flex-col items-center gap-8">
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
                  className="bg-white shadow-document w-[794px] min-h-[1123px] px-14 pt-10 pb-6 flex flex-col justify-between font-noto-looped text-gray-900 rounded-sm shrink-0"
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
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-gray-200 flex items-center justify-between bg-gray-50/90">
          <p className="text-xs text-gray-500">โหมดแสดงตัวอย่างเอกสาร (อ่านอย่างเดียว)</p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}