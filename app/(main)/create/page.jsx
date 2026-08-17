"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Lock } from "lucide-react";
import { getTemplates } from "@/lib/data/templates";

const colorMap = {
  primary: "bg-primary-100 text-primary-600",
  success: "bg-success-100 text-success-600",
  purple: "bg-purple-100 text-purple-600",
  warning: "bg-warning-100 text-warning-600",
};

export default function CreateDocumentPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTemplates().then((data) => {
      setTemplates(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">สร้างเอกสาร</h1>
      <p className="text-sm text-gray-500 mb-8">เลือกเทมเพลตที่ต้องการเริ่มสร้างเอกสาร</p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-card bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {templates.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function TemplateCard({ template }) {
  const iconClasses = colorMap[template.color] || colorMap.primary;

  const cardInner = (
    <div className="bg-white border border-gray-200 rounded-card shadow-card p-5 h-full flex flex-col">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${iconClasses}`}>
        <FileText size={20} />
      </div>
      <p className="font-semibold text-gray-900 text-[15px]">{template.name}</p>
      <p className="text-xs text-gray-500 mb-4">{template.description}</p>
      <div className="mt-auto pt-2">
        {template.available ? (
          <span className="text-sm font-medium text-primary-600">สร้างเอกสาร →</span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
            <Lock size={12} />
            เร็วๆ นี้
          </span>
        )}
      </div>
    </div>
  );

  if (!template.available) {
    return <div className="opacity-60 cursor-not-allowed">{cardInner}</div>;
  }

  return (
    <Link href={template.href} className="block hover:-translate-y-0.5 transition-transform">
      {cardInner}
    </Link>
  );
}
