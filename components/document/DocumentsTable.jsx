"use client";

import { useState, useMemo } from "react";
import { Eye, MoreVertical, Search } from "lucide-react";

const statusStyles = {
  sent: "bg-success-100 text-success-600",
  draft: "bg-primary-100 text-primary-600",
  cancelled: "bg-gray-100 text-gray-500",
};
const statusLabel = { sent: "ส่งแล้ว", draft: "ร่าง", cancelled: "ยกเลิก" };

export default function DocumentsTable({
  documents,
  showSentTo = false,
  emptyMessage = "ยังไม่มีเอกสาร",
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return documents;
    const q = query.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(q) ||
        doc.templateName.toLowerCase().includes(q) ||
        doc.sentTo?.toLowerCase().includes(q)
    );
  }, [documents, query]);

  return (
    <div>
      {/* Search — เกิดประโยชน์เฉพาะตอนรายการยาว ไม่ต้องมีใน Recent Documents บน Home */}
      <div className="relative mb-4 max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาเอกสาร..."
          className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
              <th className="px-5 py-3 font-medium">ชื่อเอกสาร</th>
              <th className="px-5 py-3 font-medium">เทมเพลต</th>
              {showSentTo && <th className="px-5 py-3 font-medium">ส่งถึง</th>}
              <th className="px-5 py-3 font-medium">ผู้สร้าง</th>
              <th className="px-5 py-3 font-medium">วันที่สร้าง</th>
              <th className="px-5 py-3 font-medium">สถานะ</th>
              <th className="px-5 py-3 font-medium text-right">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={showSentTo ? 7 : 6}
                  className="px-5 py-10 text-center text-gray-400"
                >
                  {query ? "ไม่พบเอกสารที่ค้นหา" : emptyMessage}
                </td>
              </tr>
            ) : (
              filtered.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-5 py-3 font-medium text-gray-900">{doc.name}</td>
                  <td className="px-5 py-3 text-gray-500">{doc.templateName}</td>
                  {showSentTo && (
                    <td className="px-5 py-3 text-gray-500">{doc.sentTo || "—"}</td>
                  )}
                  <td className="px-5 py-3 text-gray-500">{doc.createdBy}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString("th-TH")}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[doc.status]}`}
                    >
                      {statusLabel[doc.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}