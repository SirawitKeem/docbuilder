"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import DocumentsTable from "@/components/documents/DocumentsTable";
import { getRecentDocuments } from "@/lib/data/documents";

export default function RecentDocumentsTable() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    getRecentDocuments(5).then(setDocuments);
  }, []);

  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F5F1FF] text-[#5542F6] flex items-center justify-center">
            <Clock size={17} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-tight">เอกสารล่าสุด</h2>
            <p className="text-[11px] text-gray-500">เอกสารที่สร้างและส่งออกล่าสุดในระบบ</p>
          </div>
        </div>

        <Link
          href="/documents"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#5542F6] hover:text-[#4332D6] transition-colors"
        >
          <span>ดูเอกสารทั้งหมด</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <DocumentsTable documents={documents} />
    </section>
  );
}