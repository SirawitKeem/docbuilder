"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, MoreVertical, Edit3, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { templateRegistry } from "@/lib/templates/registry";
import { getFieldProfile } from "@/lib/data/fieldProfile";
import { DocumentFieldsProvider } from "@/context/DocumentFieldsContext";
import DocumentHeader from "@/components/document/DocumentHeader";
import DocumentFooter from "@/components/document/DocumentFooter";

const statusStyles = {
  sent: "bg-success-100 text-success-600",
  draft: "bg-primary-100 text-primary-600",
  cancelled: "bg-gray-100 text-gray-500",
};

const statusLabel = {
  sent: "ส่งแล้ว",
  draft: "ร่าง",
  cancelled: "ยกเลิก",
};

export default function DocumentsTable({
  documents = [],
  showSentTo = false,
  emptyMessage = "ยังไม่มีเอกสารในระบบ",
  onRefresh,
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const menuRef = useRef(null);

  // ปิด Dropdown เมนูเมื่อคลิกนอกเมนู
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("คุณต้องการลบเอกสารฉบับนี้ออกจากระบบใช่หรือไม่?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/documents?id=${id}`, { method: "DELETE" });
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

  return (
    <>
      {/* ใช้ overflow-visible เพื่อไม่ให้ Dropdown Menu ถูกขอบตารางบังขอบล่าง */}
      <div className="bg-white border border-gray-200 rounded-card shadow-card overflow-visible">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs text-gray-500 bg-gray-50/50">
              <th className="px-5 py-3.5 font-medium rounded-tl-card">ชื่อเอกสาร</th>
              <th className="px-5 py-3.5 font-medium">เทมเพลต</th>
              {showSentTo ? (
                <th className="px-5 py-3.5 font-medium">ส่งไปยัง</th>
              ) : (
                <th className="px-5 py-3.5 font-medium">ผู้สร้าง</th>
              )}
              <th className="px-5 py-3.5 font-medium">วันที่</th>
              <th className="px-5 py-3.5 font-medium">สถานะ</th>
              <th className="px-5 py-3.5 font-medium text-right rounded-tr-card">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-900">{doc.name}</td>
                  <td className="px-5 py-4 text-gray-500">{doc.templateName}</td>
                  {showSentTo ? (
                    <td className="px-5 py-4 text-gray-700">{doc.sentTo || "-"}</td>
                  ) : (
                    <td className="px-5 py-4 text-gray-500">{doc.createdBy || "Admin"}</td>
                  )}
                  <td className="px-5 py-4 text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString("th-TH")}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[doc.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {statusLabel[doc.status] || doc.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 relative">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* ปุ่ม Eye -> เปิด Pop-Up Preview แบบอ่านอย่างเดียว */}
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                        title="ดูตัวอย่างเอกสาร (Preview)"
                      >
                        <Eye size={16} />
                      </button>

                      {/* ปุ่ม จุด 3 จุด -> เปิด Action Menu (แก้ไข / ลบ) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === doc.id ? null : doc.id);
                        }}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                        title="การดำเนินการเพิ่มเติม"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Menu - ลอยอยู่อย่างอิสระไม่โดนขอบบัง */}
                      {openMenuId === doc.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-5 top-11 w-36 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                        >
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              router.push(`/create/${doc.templateId || "nda"}`);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                          >
                            <Edit3 size={14} className="text-gray-500" />
                            แก้ไขเอกสาร
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              handleDelete(doc.id);
                            }}
                            disabled={deletingId === doc.id}
                            className="w-full text-left px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors disabled:opacity-40"
                          >
                            <Trash2 size={14} className="text-red-500" />
                            ลบเอกสาร
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pop-Up Modal Preview (อ่านอย่างเดียว แสดงข้อมูลครบถ้วน) */}
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

    // ดึงค่าตั้งค่ากลางเพิ่มเติมมาเติม fallback หากใน doc.values ยังไม่มี
    getFieldProfile().then((profile) => {
      const merged = { ...doc.values };
      for (const field of schema.fields) {
        if (!merged[field.id] && field.sharedKey && profile[field.sharedKey]) {
          merged[field.id] = profile[field.sharedKey];
        }
      }
      setModalValues(merged);
    });
  }, [doc, entry]);

  if (!entry) return null;
  const { schema, pages } = entry;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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
        <div className="flex-1 overflow-auto bg-gray-100 p-6 flex flex-col items-center gap-6">
          <DocumentFieldsProvider initialValues={modalValues} defaultReadOnly>
            {pages.map((PageContent, i) => (
              <div
                key={i}
                className="bg-white shadow-document w-[700px] min-h-[990px] p-12 flex flex-col justify-between font-noto-looped text-gray-900 rounded-sm"
              >
                <DocumentHeader logo={schema.logo} />
                <div className="flex-1 my-4">
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
