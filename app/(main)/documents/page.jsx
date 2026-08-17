"use client";

import { useEffect, useState } from "react";
import { getDocumentHistory } from "@/lib/data/documents";
import DocumentsTable from "@/components/documents/DocumentsTable";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocumentHistory().then((data) => {
      setDocuments(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">เอกสารของฉัน</h1>
      <p className="text-sm text-gray-500 mb-8">
        เอกสารทั้งหมดที่คุณสร้าง ทั้งฉบับร่างและที่ส่งแล้ว
      </p>

      {loading ? (
        <div className="h-64 rounded-card bg-gray-100 animate-pulse" />
      ) : (
        <DocumentsTable documents={documents} emptyMessage="ยังไม่มีเอกสารที่สร้างไว้" />
      )}
    </div>
  );
}
