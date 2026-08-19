"use client";

import { useEffect, useState } from "react";
import DocumentsTable from "@/components/documents/DocumentsTable";

export default function HistoryPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    setLoading(true);
    fetch("/api/sent-history")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setDocuments(data);
        setLoading(false);
      })
      .catch(() => {
        setDocuments([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">ประวัติการส่ง</h1>
      <p className="text-sm text-gray-500 mb-8">รายการเอกสารที่ถูกส่งออกไปแล้วทั้งหมด (ประวัตินี้คงอยู่ถาวร แม้เอกสารต้นทางจะถูกลบ)</p>

      {loading ? (
        <div className="h-64 rounded-card bg-gray-100 animate-pulse" />
      ) : (
        <DocumentsTable
          documents={documents}
          deleteApiUrl="/api/sent-history"
          showSentTo
          emptyMessage="ยังไม่มีประวัติการส่งเอกสาร"
          onRefresh={fetchHistory}
        />
      )}
    </div>
  );
}
