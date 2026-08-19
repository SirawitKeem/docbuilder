"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TemplateCard from "@/components/templates/TemplateCard";
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
        <Link href="/templates" className="text-sm text-primary-600 font-medium hover:text-primary-700">
          ดูเทมเพลตทั้งหมด →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {templates.slice(0, 4).map((t) => (
          <TemplateCard key={t.id} template={t} />
        ))}
      </div>
    </section>
  );
}