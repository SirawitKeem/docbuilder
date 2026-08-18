"use client";

import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

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

  const handleView = (doc) => {
    router.push(`/create/${doc.templateId || "nda"}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-card overflow-hidden shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs text-gray-500 bg-gray-50/50">
            <th className="px-5 py-3.5 font-medium">ชื่อเอกสาร</th>
            <th className="px-5 py-3.5 font-medium">เทมเพลต</th>
            {showSentTo ? (
              <th className="px-5 py-3.5 font-medium">ส่งไปยัง</th>
            ) : (
              <th className="px-5 py-3.5 font-medium">ผู้สร้าง</th>
            )}
            <th className="px-5 py-3.5 font-medium">วันที่</th>
            <th className="px-5 py-3.5 font-medium">สถานะ</th>
            <th className="px-5 py-3.5 font-medium text-right">การดำเนินการ</th>
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
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleView(doc)}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                      title="ดู / สร้างเอกสาร"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                      className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors disabled:opacity-40"
                      title="ลบเอกสาร"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
