"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DocumentsTable from "@/components/documents/DocumentsTable";
import { getRecentDocuments } from "@/lib/data/documents";

export default function RecentDocumentsTable() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    getRecentDocuments(5).then(setDocuments);
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">เอกสารล่าสุด</h2>
        <Link href="/documents" className="text-sm text-primary-600 font-medium">
          ดูทั้งหมด →
        </Link>
      </div>
      <DocumentsTable documents={documents} />
    </section>
  );
}