"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ClockCounterClockwise } from "@phosphor-icons/react";
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
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-[6px] bg-violet-50 text-primary dark:bg-violet-950/40 dark:text-violet-300 flex items-center justify-center shrink-0">
            <ClockCounterClockwise size={16} weight="bold" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground leading-tight">Recently Updated Documents</h2>
            <p className="text-xs text-muted-foreground mt-0.5">เอกสารและสัญญาที่สร้างและอัปเดตล่าสุดในระบบ</p>
          </div>
        </div>

        <Link
          href="/documents"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-colors"
        >
          <span>ดูเอกสารทั้งหมด</span>
          <ArrowRight size={13} weight="bold" />
        </Link>
      </div>

      <DocumentsTable documents={documents} />
    </section>
  );
}