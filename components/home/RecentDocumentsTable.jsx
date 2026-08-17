"use client";

import { useEffect, useState } from "react";
import { Eye, MoreVertical } from "lucide-react";
import { getRecentDocuments } from "@/lib/data/documents";

const statusStyles = {
  sent: "bg-success-100 text-success-600",
  draft: "bg-primary-100 text-primary-600",
  cancelled: "bg-gray-100 text-gray-500",
};
const statusLabel = { sent: "ส่งแล้ว", draft: "ร่าง", cancelled: "ยกเลิก" };

export default function RecentDocumentsTable() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    getRecentDocuments(5).then(setDocuments);
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">เอกสารล่าสุด</h2>
        <a href="/documents" className="text-sm text-primary-600 font-medium">
          ดูทั้งหมด →
        </a>
      </div>

      <div className="bg-white border border-gray-200 rounded-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
              <th className="px-5 py-3 font-medium">ชื่อเอกสาร</th>
              <th className="px-5 py-3 font-medium">เทมเพลต</th>
              <th className="px-5 py-3 font-medium">ผู้สร้าง</th>
              <th className="px-5 py-3 font-medium">วันที่สร้าง</th>
              <th className="px-5 py-3 font-medium">สถานะ</th>
              <th className="px-5 py-3 font-medium text-right">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                  ยังไม่มีเอกสาร
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-5 py-3 font-medium text-gray-900">{doc.name}</td>
                  <td className="px-5 py-3 text-gray-500">{doc.templateName}</td>
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
    </section>
  );
}