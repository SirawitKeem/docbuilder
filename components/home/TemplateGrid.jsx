"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import TemplateCard from "@/components/templates/TemplateCard";
import TemplateSelectModal from "@/components/templates/TemplateSelectModal";
import { getTemplates } from "@/lib/data/templates";

export default function TemplateGrid() {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    getTemplates().then(setTemplates);
  }, []);

  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F5F1FF] text-[#5542F6] flex items-center justify-center">
            <LayoutGrid size={17} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-tight">เริ่มต้นสร้างเอกสาร</h2>
            <p className="text-[11px] text-gray-500">เลือกเทมเพลตที่ต้องการสร้างได้ทันที</p>
          </div>
        </div>

        <Link
          href="/templates"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#5542F6] hover:text-[#4332D6] transition-colors"
        >
          <span>ดูเทมเพลตทั้งหมด</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {templates.slice(0, 4).map((t) => (
          <TemplateCard
            key={t.id}
            template={t}
            onSelect={(cat) => setSelectedCategory(cat)}
          />
        ))}
      </div>

      {/* Category Sub-templates Selection Modal */}
      {selectedCategory && (
        <TemplateSelectModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </section>
  );
}