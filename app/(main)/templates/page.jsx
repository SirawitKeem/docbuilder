"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Folder,
  Search,
  Plus,
  Settings,
  Eye,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  Edit3,
  X,
  Check,
} from "lucide-react";
import CategoryManagerModal, { ICON_MAP, COLOR_MAP } from "@/components/templates/CategoryManagerModal";
import CreateCategoryModal, { EXTENDED_ICON_MAP } from "@/components/templates/CreateCategoryModal";
import TemplateDetailModal from "@/components/templates/TemplateDetailModal";
import NewTemplateTypeModal from "@/components/templates/NewTemplateTypeModal";
import UniversalTemplateRenderer from "@/components/document/UniversalTemplateRenderer";
import { QuotationDataProvider } from "@/context/QuotationDataContext";
import QuotationDocument from "@/components/document/quotation/QuotationDocument";
import { DocumentFieldsProvider } from "@/context/DocumentFieldsContext";
import DocumentHeader from "@/components/document/DocumentHeader";
import DocumentFooter from "@/components/document/DocumentFooter";
import NdaPage1 from "@/components/document/nda/NdaPage1";
import DistributorPage1 from "@/components/document/distributor/DistributorPage1";
import PartnerPage1 from "@/components/document/partner/PartnerPage1";
import NotificationRelocationDocument from "@/components/document/notification/NotificationRelocationDocument";

const emptyQuotationPreviewData = {
  id: "preview",
  quotationNo: "QT-YYYYMM-XXXX",
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
  remarksList: [],
  senderName: "",
  senderPosition: "",
  senderEmail: "",
  senderPhone: "",
};

function renderAuthenticDocumentContent(template) {
  const catId = (template.categoryId || "").toLowerCase();
  const tmplId = (template.id || "").toLowerCase();

  if (catId === "quotation" || tmplId.includes("quotation")) {
    return (
      <QuotationDataProvider initialQuotation={emptyQuotationPreviewData} defaultReadOnly={true}>
        <div style={{ width: 794, height: 1123 }} className="bg-white overflow-hidden text-left font-noto-looped">
          <QuotationDocument currentPage={1} />
        </div>
      </QuotationDataProvider>
    );
  }

  if (catId === "nda" || tmplId.includes("nda")) {
    return (
      <DocumentFieldsProvider initialValues={{}} defaultReadOnly={true}>
        <div style={{ width: 794, height: 1123 }} className="bg-white text-left font-noto-looped px-14 pt-10 pb-6 flex flex-col justify-between overflow-hidden">
          <DocumentHeader logo="/quotation.png" />
          <div className="flex-1 min-h-0 overflow-hidden text-gray-900 text-sm">
            <NdaPage1 />
          </div>
          <DocumentFooter currentPage={1} totalPages={4} />
        </div>
      </DocumentFieldsProvider>
    );
  }

  if (catId === "partner" || tmplId.includes("partner")) {
    return (
      <DocumentFieldsProvider initialValues={{}} defaultReadOnly={true}>
        <div style={{ width: 794, height: 1123 }} className="bg-white text-left font-noto-looped px-14 pt-10 pb-6 flex flex-col justify-between overflow-hidden">
          <DocumentHeader logo="/quotation.png" />
          <div className="flex-1 min-h-0 overflow-hidden text-gray-900 text-sm">
            <PartnerPage1 />
          </div>
          <DocumentFooter currentPage={1} totalPages={5} />
        </div>
      </DocumentFieldsProvider>
    );
  }

  if (catId === "distributor" || tmplId.includes("distributor")) {
    return (
      <DocumentFieldsProvider initialValues={{}} defaultReadOnly={true}>
        <div style={{ width: 794, height: 1123 }} className="bg-white text-left font-noto-looped px-14 pt-10 pb-6 flex flex-col justify-between overflow-hidden">
          <DocumentHeader logo="/quotation.png" />
          <div className="flex-1 min-h-0 overflow-hidden text-gray-900 text-sm">
            <DistributorPage1 />
          </div>
          <DocumentFooter currentPage={1} totalPages={5} />
        </div>
      </DocumentFieldsProvider>
    );
  }

  if (catId === "notification" || tmplId.includes("notification") || tmplId.includes("relocation")) {
    return (
      <div style={{ width: 794, height: 1123 }} className="bg-white overflow-hidden text-left font-noto-looped select-none">
        <NotificationRelocationDocument />
      </div>
    );
  }

  return <UniversalTemplateRenderer template={template} scale={1} />;
}

/**
 * Miniature Live Document Preview for Level 2 Cards
 * Dynamically renders each template based strictly on its own blocks, theme, and logo.
 */
function CardMiniaturePreview({ template }) {
  const isLandscape = template.orientation === "landscape";
  const targetScale = isLandscape ? 0.13 : 0.165;

  return (
    <div className="w-full h-44 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center p-2 mb-3.5 overflow-hidden shadow-2xs group-hover:border-purple-200 transition-colors">
      <div
        className="origin-top-left pointer-events-none select-none shadow-md rounded-xs border border-gray-200"
        style={{
          width: isLandscape ? 1123 : 794,
          height: isLandscape ? 794 : 1123,
          transform: `scale(${targetScale})`,
          marginBottom: `-${(isLandscape ? 794 : 1123) * (1 - targetScale)}px`,
          marginRight: `-${(isLandscape ? 1123 : 794) * (1 - targetScale)}px`,
        }}
      >
        {renderAuthenticDocumentContent(template)}
      </div>
    </div>
  );
}

export default function TemplatesHubPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected Category for Level 2 view (null = Level 1 All Collections)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  // Renaming Template State
  const [renamingTemplate, setRenamingTemplate] = useState(null);
  const [newName, setNewName] = useState("");
  const [isRenamingLoading, setIsRenamingLoading] = useState(false);

  const handleSelectType = (editorType) => {
    setIsTypeModalOpen(false);
    const catId = selectedCategory?.id || "forms";
    if (editorType === "sheet") {
      router.push(`/templates/new?categoryId=${catId}&editorType=sheet`);
    } else {
      const preset = editorType === "slide" ? "slide-16-9" : "a4-portrait";
      router.push(`/templates/new?categoryId=${catId}&editorType=${editorType}&canvasPreset=${preset}`);
    }
  };

  // Load Categories & Templates from API dynamically
  const loadData = async () => {
    try {
      setLoading(true);
      const [catRes, tmplRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/templates"),
      ]);

      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData || []);
      }

      if (tmplRes.ok) {
        const tmplData = await tmplRes.json();
        setTemplates(tmplData || []);
      }
    } catch (err) {
      console.error("Error loading templates hub:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Categories in Level 1
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.fullName || "").toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q) ||
        (c.id || "").toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  // Filter Templates in Level 2
  const currentCategoryTemplates = useMemo(() => {
    if (!selectedCategory) return [];
    const catTemplates = templates.filter((t) => t.categoryId === selectedCategory.id);
    if (!searchQuery.trim()) return catTemplates;
    const q = searchQuery.toLowerCase();
    return catTemplates.filter(
      (t) =>
        (t.name || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        (t.badge || "").toLowerCase().includes(q)
    );
  }, [templates, selectedCategory, searchQuery]);

  // Duplicate a Template
  const handleDuplicateTemplate = async (tmpl) => {
    try {
      const copyPayload = {
        ...tmpl,
        id: undefined,
        name: `${tmpl.name} (คัดลอก)`,
        badge: "ฉบับคัดลอก",
        status: "published",
      };

      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(copyPayload),
      });

      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error("Error duplicating template:", err);
    }
  };

  // Delete a Custom Template
  const handleDeleteTemplate = async (tmplId) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบเทมเพลตนี้ออกจากคลัง?")) return;

    try {
      const res = await fetch(`/api/templates/${tmplId}`, { method: "DELETE" });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error("Error deleting template:", err);
    }
  };

  // Start Renaming
  const handleStartRename = (tmpl) => {
    setRenamingTemplate(tmpl);
    setNewName(tmpl.name);
  };

  // Save Renamed Template
  const handleSaveRename = async () => {
    if (!renamingTemplate || !newName.trim()) return;
    setIsRenamingLoading(true);
    try {
      const res = await fetch(`/api/templates/${renamingTemplate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        await loadData();
        setRenamingTemplate(null);
      }
    } catch (err) {
      console.error("Error renaming template:", err);
    } finally {
      setIsRenamingLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-20">
      {/* LEVEL 1: All Document Types / Collections View */}
      {!selectedCategory ? (
        <>
          {/* Header & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5542F6] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#5542F6]">
                  Enterprise Template Hub
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mt-1">
                คลังเทมเพลตและประเภทเอกสาร
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                รวบรวมประเภทเอกสารองค์กรและรูปแบบเทมเพลตสำเร็จรูป
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              {/* Button 1: Manage Categories List (Reorder, Edit, Delete) */}
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                title="จัดการ ลบ หรือแก้ไขข้อมูลหมวดหมู่ทั้งหมด"
              >
                <Settings size={15} className="text-gray-400" />
                <span>จัดการหมวดหมู่</span>
              </button>

              {/* Button 2: Dedicated Create Document Type / Folder Modal */}
              <button
                type="button"
                onClick={() => setIsCreateCategoryModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5542F6] hover:bg-[#4332D6] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                title="สร้างประเภทเอกสารหรือโฟลเดอร์เอกสารใหม่"
              >
                <Plus size={16} />
                <span>เพิ่มประเภทเอกสารใหม่</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-3.5 shadow-2xs">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาประเภทเอกสาร (เช่น Quotation, NDA, Partner Agreement...)"
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white text-xs text-gray-800 outline-none focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] transition-all"
              />
            </div>
          </div>

          {/* Document Collections Grid */}
          {loading ? (
            <div className="p-16 text-center space-y-3 bg-white rounded-2xl border border-gray-200">
              <div className="w-8 h-8 border-3 border-[#5542F6] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-gray-500 font-medium">กำลังโหลดคลังประเภทเอกสาร...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5542F6] flex items-center justify-center mx-auto">
                <Folder size={24} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">ไม่พบประเภทเอกสารที่ค้นหา</h3>
              <button
                type="button"
                onClick={() => setIsCreateCategoryModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5542F6] text-white text-xs font-bold cursor-pointer"
              >
                <Plus size={14} />
                <span>เพิ่มประเภทเอกสารใหม่</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCategories.map((cat) => {
                const IconData = EXTENDED_ICON_MAP[cat.icon];
                const IconComp = IconData ? IconData.icon : (ICON_MAP[cat.icon] || FileText);
                const colorStyle = COLOR_MAP[cat.color] || COLOR_MAP.purple;
                const tmplCount = (templates || []).filter((t) => t.categoryId === cat.id).length;

                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSearchQuery("");
                    }}
                    className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs hover:shadow-lg hover:border-[#5542F6]/60 transition-all duration-200 flex flex-col justify-between group text-left cursor-pointer relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${colorStyle.bg} ${colorStyle.text} border ${colorStyle.border} flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-2xs`}>
                          <IconComp size={22} />
                        </div>

                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${colorStyle.bg} ${colorStyle.text} ${colorStyle.border}`}>
                          {tmplCount} รูปแบบเทมเพลต
                        </span>
                      </div>

                      <h3 className="text-base font-black text-gray-900 group-hover:text-[#5542F6] transition-colors leading-snug">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {cat.description || "คลังรวบรวมเทมเพลตสำหรับเอกสารประเภทนี้"}
                      </p>
                    </div>

                    <div className="pt-4 mt-5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#5542F6] group-hover:translate-x-0.5 transition-transform">
                      <span className="flex items-center gap-1.5">
                        <FolderOpen size={15} />
                        <span>เปิดดูคลังเทมเพลต</span>
                      </span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* LEVEL 2: Selected Category's Template Variants View */
        <>
          {/* Breadcrumb Navigation & Back Button */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-200/80 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-2xs cursor-pointer"
                title="ย้อนกลับไปรวมหมวดหมู่"
              >
                <ChevronLeft size={18} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    คลังเทมเพลต
                  </button>
                  <span className="text-gray-300 text-xs">/</span>
                  <span className="text-xs font-bold text-[#5542F6]">{selectedCategory.name}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mt-0.5">
                  เทมเพลตหมวด {selectedCategory.name}
                </h2>
              </div>
            </div>

            {/* Action: Create New Template in this Category */}
            <button
              type="button"
              onClick={() => setIsTypeModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5542F6] hover:bg-[#4332D6] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>สร้างเทมเพลตใหม่ในหมวดนี้</span>
            </button>
          </div>

          {/* Search in this category */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-3 shadow-2xs">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`ค้นหาในหมวด ${selectedCategory.name}...`}
                className="w-full h-9 pl-9 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white text-xs text-gray-800 outline-none focus:border-[#5542F6] transition-all"
              />
            </div>
          </div>

          {/* Level 2 Templates Grid */}
          {currentCategoryTemplates.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5542F6] flex items-center justify-center mx-auto">
                <FileText size={24} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">ยังไม่มีรูปแบบเทมเพลตในหมวดหมู่นี้</h3>
              <p className="text-xs text-gray-500">
                คุณสามารถสร้างแม่แบบเทมเพลตใหม่สำหรับหมวด {selectedCategory.name} ได้ทันที
              </p>
              <button
                type="button"
                onClick={() => setIsTypeModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5542F6] hover:bg-[#4332D6] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                <Plus size={14} />
                <span>สร้างเทมเพลตใหม่</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentCategoryTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs hover:shadow-lg hover:border-[#5542F6]/50 transition-all duration-200 flex flex-col justify-between group text-left relative"
                >
                  <div>
                    {/* Live Document Preview Miniature */}
                    <CardMiniaturePreview template={tmpl} />

                    {/* Badge & Info Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5542F6] border border-purple-100">
                        {tmpl.badge || "เทมเพลต"}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400">
                        {tmpl.orientation === "landscape" ? "A4 แนวนอน" : "A4 แนวตั้ง"}
                      </span>
                    </div>

                    {/* Renaming inline or Title display */}
                    {renamingTemplate?.id === tmpl.id ? (
                      <div className="flex items-center gap-1.5 my-1">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="flex-1 text-sm font-bold text-gray-900 border border-[#5542F6] rounded-lg px-2 py-1 outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleSaveRename}
                          disabled={isRenamingLoading}
                          className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                          title="บันทึกชื่อ"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRenamingTemplate(null)}
                          className="p-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                          title="ยกเลิก"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#5542F6] transition-colors leading-snug line-clamp-2">
                          {tmpl.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleStartRename(tmpl)}
                          className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors cursor-pointer"
                          title="แก้ไขชื่อเทมเพลต"
                        >
                          <Edit3 size={13} />
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {tmpl.description || "โครงสร้างเทมเพลตสำหรับใช้งานในระบบ"}
                    </p>
                  </div>

                  {/* Card Actions Bar */}
                  <div className="pt-3.5 mt-4 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                    {/* View Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(tmpl)}
                      className="inline-flex items-center gap-1 text-[#5542F6] font-bold hover:underline cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>ดูตัวอย่าง</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Duplicate Template */}
                      <button
                        type="button"
                        onClick={() => handleDuplicateTemplate(tmpl)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                        title="คัดลอกเป็นเทมเพลตใหม่"
                      >
                        <Copy size={13} />
                      </button>

                      {/* Delete Custom Template */}
                      {tmpl.badge !== "มาตรฐาน" && (
                        <button
                          type="button"
                          onClick={() => handleDeleteTemplate(tmpl.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="ลบเทมเพลตนี้"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}

                      {/* Edit in Studio */}
                      <Link
                        href={`/templates/new?edit=${tmpl.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#5542F6] text-gray-700 hover:text-white font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        <Edit3 size={12} />
                        <span>แก้ไข</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Category Manager Modal (List, Edit, Delete) */}
      {isCategoryModalOpen && (
        <CategoryManagerModal
          isOpen={isCategoryModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false);
            loadData();
          }}
          categories={categories}
          onCategoriesUpdated={loadData}
          onOpenCreateModal={() => {
            setIsCategoryModalOpen(false);
            setIsCreateCategoryModalOpen(true);
          }}
        />
      )}

      {/* Dedicated Create Category Modal */}
      {isCreateCategoryModalOpen && (
        <CreateCategoryModal
          isOpen={isCreateCategoryModalOpen}
          onClose={() => setIsCreateCategoryModalOpen(false)}
          onCreated={loadData}
        />
      )}

      {/* Template Detail / Preview Modal */}
      {previewTemplate && (
        <TemplateDetailModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}

      {/* New Template Type Picker Modal (Docs / Slides / Sheets) */}
      <NewTemplateTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSelect={handleSelectType}
        categoryName={selectedCategory?.name}
      />
    </div>
  );
}
