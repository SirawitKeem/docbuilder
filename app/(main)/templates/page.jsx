"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  FileSignature,
  Receipt,
  Building2,
  Handshake,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2,
  Lock,
  Sparkles,
  X,
  FileText,
} from "lucide-react";
import { CATEGORIES, SUB_TEMPLATES } from "@/lib/data/templates";

const CATEGORY_TABS = [
  { id: "all", label: "ทั้งหมด" },
  { id: "contracts", label: "สัญญาธุรกิจ & NDA" },
  { id: "partnerships", label: "สัญญาตัวแทนจำหน่าย" },
  { id: "finance", label: "เอกสารการเงิน & ใบเสนอราคา" },
];

function getCategoryGroup(templateId) {
  if (templateId === "nda") return "contracts";
  if (templateId === "distributor" || templateId === "partner") return "partnerships";
  if (templateId === "quotation" || templateId === "receipt") return "finance";
  return "contracts";
}

function getTemplateIcon(templateId) {
  switch (templateId) {
    case "nda":
      return { Icon: FileSignature, colorClass: "bg-[#F5F1FF] text-[#5542F6] border-[#EBE3FF]" };
    case "quotation":
      return { Icon: Receipt, colorClass: "bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]" };
    case "distributor":
      return { Icon: Building2, colorClass: "bg-[#FDF2F8] text-[#DB2777] border-[#FCE7F3]" };
    case "partner":
      return { Icon: Handshake, colorClass: "bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]" };
    default:
      return { Icon: FileText, colorClass: "bg-[#F5F1FF] text-[#5542F6] border-[#EBE3FF]" };
  }
}

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const filteredTemplates = useMemo(() => {
    return CATEGORIES.filter((t) => {
      const matchTab = activeTab === "all" || getCategoryGroup(t.id) === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.fullName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      return matchTab && matchQuery;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-6 text-left">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F5F1FF] text-[#5542F6] flex items-center justify-center">
            <Layers size={18} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">คลังเทมเพลตเอกสาร</h1>
        </div>
        <p className="text-sm text-gray-500">
          เลือกเทมเพลตสัญญาและเอกสารธุรกิจมาตรฐานของ Crest Zendo เพื่อเริ่มสร้างเอกสารใหม่ได้ในทันที
        </p>
      </div>

      {/* Toolbar: Search Input + Category Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาเทมเพลต..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 outline-none focus:border-[#5542F6] focus:ring-2 focus:ring-[#F5F1FF] transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100/80 overflow-x-auto select-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
        {filteredTemplates.map((t) => {
          const { Icon, colorClass } = getTemplateIcon(t.id);
          const subInfo = SUB_TEMPLATES[t.id]?.[0];

          return (
            <div
              key={t.id}
              className="bg-white border border-[#EAEAEF] rounded-[22px] shadow-2xs p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-[#5542F6]/40 hover:shadow-md relative overflow-hidden group select-none text-left"
            >
              <div>
                {/* Top Row: Icon + Badges */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border ${colorClass} transition-transform group-hover:scale-105 duration-200`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {subInfo?.pageCount && (
                      <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold">
                        {subInfo.pageCount}
                      </span>
                    )}

                    {t.available ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F5F1FF] text-[#5542F6] text-[10px] font-bold border border-[#EBE3FF]">
                        พร้อมใช้งาน
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold">
                        <Lock size={10} /> เร็วๆ นี้
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <p className="font-bold text-gray-900 text-base group-hover:text-[#5542F6] transition-colors line-clamp-1">
                  {t.name}
                </p>
                <p className="text-xs font-medium text-gray-500 mt-0.5 mb-2 line-clamp-1">
                  {t.fullName}
                </p>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                  {t.description}
                </p>

                {/* Features List */}
                {subInfo?.features && (
                  <div className="space-y-1.5 pb-4 border-b border-gray-100">
                    {subInfo.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate({ category: t, subInfo })}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer py-1"
                >
                  <Eye size={13} />
                  <span>ดูรายละเอียด</span>
                </button>

                {t.available ? (
                  <Link
                    href={t.href}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5542F6] hover:bg-[#4332D6] text-white text-xs font-bold transition-all shadow-xs group-hover:shadow-sm"
                  >
                    <span>เริ่มสร้าง</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <span className="text-xs font-medium text-gray-400 py-1">เร็วๆ นี้</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Structure Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          data={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
}

function TemplatePreviewModal({ data, onClose }) {
  const { category, subInfo } = data;
  const { Icon, colorClass } = getTemplateIcon(category.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E4E4E8] rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClass}`}>
              <Icon size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-snug">{category.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{category.fullName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-gray-800">คำอธิบายและวัตถุประสงค์</h4>
            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
              {category.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-0.5">
              <span className="text-[11px] text-gray-500 font-medium">ความยาวเอกสาร</span>
              <p className="text-xs font-bold text-gray-900">{subInfo?.pageCount || "มาตรฐาน A4"}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-0.5">
              <span className="text-[11px] text-gray-500 font-medium">รูปแบบการสร้าง</span>
              <p className="text-xs font-bold text-gray-900">2-Column Workspace</p>
            </div>
          </div>

          {subInfo?.features && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-800">จุดเด่นและข้อกำหนดในสัญญา</h4>
              <div className="space-y-1.5">
                {subInfo.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-white text-xs font-semibold transition-colors cursor-pointer"
          >
            ปิด
          </button>

          {category.available ? (
            <Link
              href={category.href}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5542F6] hover:bg-[#4332D6] text-white text-xs font-bold transition-colors shadow-xs"
            >
              <span>เริ่มสร้างเอกสารนี้</span>
              <ArrowRight size={14} />
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-xl bg-gray-200 text-gray-500 text-xs font-medium">เร็วๆ นี้</span>
          )}
        </div>
      </div>
    </div>
  );
}
