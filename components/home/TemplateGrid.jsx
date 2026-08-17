"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Lock, ArrowRight } from "lucide-react";
import { getTemplates } from "@/lib/data/templates";

export default function TemplateGrid() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    getTemplates().then(setTemplates);
  }, []);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">เริ่มต้นสร้างเอกสาร</h2>
        <Link href="/templates" className="text-sm text-primary-600 font-medium">
          ดูเทมเพลตทั้งหมด →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {templates.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-gray-200 rounded-card shadow-card p-5"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mb-3">
              <FileText size={20} className="text-primary-600" />
            </div>
            <p className="font-semibold text-gray-900 text-[15px]">{t.name}</p>
            <p className="text-xs text-gray-500 mb-4">{t.description}</p>
            {t.available ? (
              <Link
                href={t.href}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600"
              >
                สร้างเอกสาร <ArrowRight size={14} />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
                <Lock size={12} /> เร็วๆ นี้
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}