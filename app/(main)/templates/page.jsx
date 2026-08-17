"use client";

import { useEffect, useState } from "react";
import TemplateCard from "@/components/templates/TemplateCard";
import { getTemplates } from "@/lib/data/templates";

export default function TemplatesPage() {
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
      <h1 className="text-2xl font-bold text-gray-900 mb-1">เทมเพลตเอกสาร</h1>
      <p className="text-sm text-gray-500 mb-8">
        เทมเพลตทั้งหมดที่รองรับในระบบ Document Generator
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-card bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((t) => (
            <TemplateCard key={t.id} template={t} variant="full" />
          ))}
        </div>
      )}
    </div>
  );
}
