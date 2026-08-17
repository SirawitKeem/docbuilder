"use client";

import { Eye, MoreVertical } from "lucide-react";

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
}) {
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
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="ดูเอกสาร">
                      <Eye size={16} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="เพิ่มเติม">
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
  );
}
