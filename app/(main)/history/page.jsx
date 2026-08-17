"use client";

import { useEffect, useState } from "react";
import { getDocumentHistory } from "@/lib/data/documents";
import DocumentsTable from "@/components/documents/DocumentsTable";

export default function HistoryPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocumentHistory().then((data) => {
      // ประวัติการส่ง — โชว์เฉพาะเอกสารที่สถานะ "ส่งแล้ว" เท่านั้น
      setDocuments(data.filter((doc) => doc.status === "sent"));
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">ประวัติการส่ง</h1>
      <p className="text-sm text-gray-500 mb-8">รายการเอกสารที่ถูกส่งออกไปแล้วทั้งหมด</p>

      {loading ? (
        <div className="h-64 rounded-card bg-gray-100 animate-pulse" />
      ) : (
        <DocumentsTable
          documents={documents}
          showSentTo
          emptyMessage="ยังไม่มีประวัติการส่งเอกสาร"
        />
      )}
    </div>
  );
}
