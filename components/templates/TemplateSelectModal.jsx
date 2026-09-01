"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Check,
  ArrowRight,
  FileText,
  Search,
  Filter,
  Info,
  CheckCircle2,
} from "lucide-react";
import { getTemplatesByCategory } from "@/lib/data/templates";
import { QuotationDataProvider } from "@/context/QuotationDataContext";
import QuotationDocument from "@/components/document/quotation/QuotationDocument";
import { DocumentFieldsProvider } from "@/context/DocumentFieldsContext";
import DocumentHeader from "@/components/document/DocumentHeader";
import DocumentFooter from "@/components/document/DocumentFooter";
import NdaPage1 from "@/components/document/nda/NdaPage1";
import DistributorPage1 from "@/components/document/distributor/DistributorPage1";
import PartnerPage1 from "@/components/document/partner/PartnerPage1";

const emptyQuotationPreviewData = {
  id: "preview",
  quotationNo: "CZ26080001",
  revision: "01",
  quotationDate: "",
  priceValidity: "",
  deliveryTerm: "",
  creditTerm: "",
  billTo: {
    companyName: "",
    attn: "",
    endUser: "",
    subject: "",
    am: "",
  },
  lineItems: [],
  vatRate: 7,
  specialDiscount: 0,
  remarks: "",
  remarksList: ["Payment: Annually"],
  senderName: "",
  senderPosition: "",
  senderEmail: "",
  senderPhone: "",
};

/**
 * Authentic Document Preview rendered directly from the real Document Component
 */
function RealTemplatePreview({ categoryId, scale = 0.151 }) {
  const width = 794 * scale;
  const height = 1123 * scale;

  const content = useMemo(() => {
    if (categoryId === "quotation") {
      return (
        <QuotationDataProvider initialQuotation={emptyQuotationPreviewData}>
          <div style={{ width: 794, height: 1123 }} className="bg-white overflow-hidden text-left font-noto-looped select-none">
            <QuotationDocument currentPage={1} />
          </div>
        </QuotationDataProvider>
      );
    }

    if (categoryId === "nda") {
      return (
        <DocumentFieldsProvider initialValues={{}} defaultReadOnly={true}>
          <div style={{ width: 794, height: 1123 }} className="bg-white text-left font-noto-looped px-14 pt-10 pb-6 flex flex-col justify-between overflow-hidden select-none">
            <DocumentHeader logo="/quotation.png" />
            <div className="flex-1 min-h-0 overflow-hidden text-gray-900 text-sm">
              <NdaPage1 />
            </div>
            <DocumentFooter currentPage={1} totalPages={4} />
          </div>
        </DocumentFieldsProvider>
      );
    }

    if (categoryId === "partner") {
      return (
        <DocumentFieldsProvider initialValues={{}} defaultReadOnly={true}>
          <div style={{ width: 794, height: 1123 }} className="bg-white text-left font-noto-looped px-14 pt-10 pb-6 flex flex-col justify-between overflow-hidden select-none">
            <DocumentHeader logo="/quotation.png" />
            <div className="flex-1 min-h-0 overflow-hidden text-gray-900 text-sm">
              <PartnerPage1 />
            </div>
            <DocumentFooter currentPage={1} totalPages={5} />
          </div>
        </DocumentFieldsProvider>
      );
    }

    if (categoryId === "distributor") {
      return (
        <DocumentFieldsProvider initialValues={{}} defaultReadOnly={true}>
          <div style={{ width: 794, height: 1123 }} className="bg-white text-left font-noto-looped px-14 pt-10 pb-6 flex flex-col justify-between overflow-hidden select-none">
            <DocumentHeader logo="/quotation.png" />
            <div className="flex-1 min-h-0 overflow-hidden text-gray-900 text-sm">
              <DistributorPage1 />
            </div>
            <DocumentFooter currentPage={1} totalPages={5} />
          </div>
        </DocumentFieldsProvider>
      );
    }

    return (
      <div style={{ width: 794, height: 1123 }} className="bg-white text-left font-noto-looped p-10 flex flex-col justify-between overflow-hidden select-none">
        <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#5542F6] flex items-center justify-center text-white font-bold text-xs">
              CZ
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs">บริษัท เครสท์ เซนโด จำกัด</p>
              <p className="text-[10px] text-gray-500">CREST ZENDO CO., LTD.</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-[#5542F6] font-bold border border-purple-100">
            เอกสารทางการ
          </span>
        </div>
        <div className="flex-1 py-6 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          <div className="h-2.5 bg-gray-100 rounded w-full" />
          <div className="h-2.5 bg-gray-100 rounded w-5/6" />
          <div className="h-2.5 bg-gray-100 rounded w-4/6" />
        </div>
        <div className="border-t border-gray-100 pt-4 flex justify-between">
          <div className="h-8 border-b border-gray-300 w-28" />
          <div className="h-8 border-b border-gray-300 w-28" />
        </div>
      </div>
    );
  }, [categoryId]);

  return (
    <div
      className="overflow-hidden rounded-md shadow-xs border border-gray-200 bg-white relative shrink-0"
      style={{ width, height }}
    >
      <div
        className="origin-top-left pointer-events-none select-none"
        style={{
          width: 794,
          height: 1123,
          transform: `scale(${scale})`,
        }}
      >
        {content}
      </div>
    </div>
  );
}

export default function TemplateSelectModal({ category, onClose }) {
  const router = useRouter();

  const [subTemplates, setSubTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Load sub-templates asynchronously from single API/JSON source
  useEffect(() => {
    if (!category?.id) {
      setSubTemplates([]);
      setLoadingTemplates(false);
      return;
    }
    setLoadingTemplates(true);
    Promise.resolve(getTemplatesByCategory(category.id)).then((data) => {
      const list = Array.isArray(data) ? data : [];
      setSubTemplates(list);
      if (list.length > 0) {
        setSelectedTemplate(list[0]);
      }
      setLoadingTemplates(false);
    });
  }, [category]);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Filtered sub-templates based on Search
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return subTemplates;
    const q = searchQuery.toLowerCase();
    return subTemplates.filter((item) => {
      const matchName = item.name?.toLowerCase().includes(q);
      const matchEng = item.englishName?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      return matchName || matchEng || matchDesc;
    });
  }, [subTemplates, searchQuery]);

  // Handle navigate to create document with selected template
  const handleUseTemplate = () => {
    if (!selectedTemplate || !category?.id) return;
    onClose?.();
    const standardCategories = ["quotation", "nda", "partner", "distributor"];
    if (standardCategories.includes(category.id.toLowerCase())) {
      router.push(`/create/${category.id}`);
    } else {
      router.push(`/create/custom?templateId=${selectedTemplate.id}&categoryId=${category.id}`);
    }
  };

  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[580px] max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150 overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="h-18 px-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5542F6] flex items-center justify-center shrink-0 border border-purple-100/60 shadow-2xs">
              <FileText size={20} className="text-[#5542F6]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                เลือกเทมเพลต {category.name}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                เลือกเทมเพลตที่ต้องการใช้ในการสร้างเอกสาร {category.fullName || category.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center cursor-pointer"
            title="ปิดหน้าต่าง (ESC)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-gray-50 flex items-center justify-between gap-4 shrink-0 bg-gray-50/40">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาเทมเพลต..."
              className="w-full pl-8.5 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#7C4DFF]/20 focus:border-[#7C4DFF] transition-all"
            />
          </div>
          <div className="text-xs text-gray-500 font-medium">
            ทั้งหมด {filteredTemplates.length} รูปแบบ
          </div>
        </div>

        {/* Main Body: Left Cards Grid + Right Detail Preview Panel */}
        <div className="px-6 py-4 flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-5 overflow-hidden">
          {/* Left Grid: Sub-template Cards (7 cols on md) */}
          <div className="md:col-span-7 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredTemplates.map((item) => {
                const isSelected = selectedTemplate?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedTemplate(item)}
                    className={`rounded-xl p-3 border transition-all duration-150 cursor-pointer flex flex-col justify-between relative group ${
                      isSelected
                        ? "border-[#7C4DFF] bg-[#FAF8FF] ring-1.5 ring-[#7C4DFF] shadow-xs"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-2xs"
                    }`}
                  >
                    {/* Top Right Checkmark Badge when active */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4.5 h-4.5 rounded-full bg-[#7C4DFF] text-white flex items-center justify-center shadow-xs z-10 animate-in zoom-in-50 duration-150">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}

                    {/* Miniature Real Document Container */}
                    <div className="w-full h-40 rounded-lg bg-[#F8F9FB] flex items-center justify-center p-2 mb-2.5 overflow-hidden">
                      <RealTemplatePreview
                        categoryId={category.id}
                        scale={0.132}
                      />
                    </div>

                    {/* Title & Tag */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-xs text-gray-900 group-hover:text-[#7C4DFF] transition-colors truncate">
                          {item.name}
                        </h3>
                        {item.tag && (
                          <span
                            className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                              item.tagColor || "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {item.tag}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="py-16 text-center text-gray-400 font-medium text-xs">
                ไม่พบรูปแบบเทมเพลตที่ตรงกับการค้นหา
              </div>
            )}
          </div>

          {/* Right Sidebar: Dynamic Template Detail Preview (5 cols on md) */}
          {selectedTemplate && (
            <div className="md:col-span-5 bg-[#FAF9FD] rounded-xl border border-purple-100/70 p-4 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-3.5">
                {/* Floating Real Document Preview Container */}
                <div className="w-full h-44 rounded-lg bg-gradient-to-b from-purple-100/50 to-purple-50/30 flex items-center justify-center p-2 shadow-2xs border border-purple-100/40 overflow-hidden">
                  <div className="transform hover:scale-105 transition-transform duration-200">
                    <RealTemplatePreview
                      categoryId={category.id}
                      scale={0.145}
                    />
                  </div>
                </div>

                {/* Template Name & Details */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-gray-900">
                      {selectedTemplate.name}
                    </h3>
                    {selectedTemplate.tag && (
                      <span
                        className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                          selectedTemplate.tagColor || "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {selectedTemplate.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-normal leading-relaxed">
                    {selectedTemplate.description}
                  </p>
                </div>

                {/* Info Block (ข้อมูลเทมเพลต) */}
                <div className="space-y-1.5 pt-2.5 border-t border-gray-200/60 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-gray-800 mb-1">
                    <Info size={13} className="text-gray-400" />
                    <span>ข้อมูลเทมเพลต</span>
                  </div>

                  {selectedTemplate.pageCount && (
                    <div className="flex items-center justify-between text-gray-600 py-0.5">
                      <span className="text-gray-500">จำนวนหน้า</span>
                      <span className="font-semibold text-gray-900">
                        {selectedTemplate.pageCount}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-gray-600 py-0.5">
                    <span className="text-gray-500">รูปแบบไฟล์</span>
                    <span className="font-semibold text-gray-900">PDF</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600 py-0.5">
                    <span className="text-gray-500">รองรับการส่งอีเมล</span>
                    <CheckCircle2 size={15} className="text-emerald-500 fill-emerald-50" />
                  </div>
                </div>

                {/* Highlights Block (จุดเด่น) */}
                {selectedTemplate.features && selectedTemplate.features.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-gray-200/60 text-xs">
                    <div className="font-bold text-gray-800">จุดเด่น</div>
                    <div className="space-y-1">
                      {selectedTemplate.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-gray-600 font-normal text-[11.5px]">
                          <Check size={13} className="text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="h-16 px-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-2.5 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            ยกเลิก
          </button>

          <button
            onClick={handleUseTemplate}
            className="px-5 py-2 rounded-xl bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white text-xs font-semibold hover:opacity-95 transition-opacity shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <FileText size={14} />
            <span>ใช้เทมเพลตนี้</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}