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
        <div style={{ width: 794, height: 1123 }} className="bg-white overflow-hidden text-left font-sans">
          <QuotationDocument currentPage={1} />
        </div>
      </QuotationDataProvider>
    );
  }

  if (catId === "nda" || tmplId.includes("nda")) {
    return (
      <DocumentFieldsProvider initialValues={{}} defaultReadOnly={true}>
        <div style={{ width: 794, height: 1123 }} className="bg-white text-left font-sans px-14 pt-10 pb-6 flex flex-col justify-between overflow-hidden">
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
        <div style={{ width: 794, height: 1123 }} className="bg-white text-left font-sans px-14 pt-10 pb-6 flex flex-col justify-between overflow-hidden">
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
        <div style={{ width: 794, height: 1123 }} className="bg-white text-left font-sans px-14 pt-10 pb-6 flex flex-col justify-between overflow-hidden">
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
      <div style={{ width: 794, height: 1123 }} className="bg-white overflow-hidden text-left font-sans select-none">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
                Template Catalog
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Browse organization document types, agreements, and pre-built templates
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              {/* Button 1: Manage Categories List (Reorder, Edit, Delete) */}
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-surface hover:bg-muted text-xs font-semibold text-foreground shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                title="Manage, reorder, or edit template categories"
              >
                <Settings size={15} className="text-muted-foreground" />
                <span>Manage Categories</span>
              </button>

              {/* Button 2: Dedicated Create Document Type / Folder Modal */}
              <button
                type="button"
                onClick={() => setIsCreateCategoryModalOpen(true)}
                className="primary-button inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
                title="Create a new document category or template collection"
              >
                <Plus size={16} />
                <span>New Category</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-surface rounded-2xl border border-border p-3.5 shadow-2xs">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories or templates (e.g. Quotation, NDA, Partner Agreement...)"
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-muted/20 hover:bg-surface focus:bg-surface text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/70"
              />
            </div>
          </div>

          {/* Document Collections Grid */}
          {loading ? (
            <div className="p-16 text-center space-y-3 bg-surface rounded-2xl border border-border">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-muted-foreground font-medium">Loading template catalog...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-12 text-center bg-surface rounded-2xl border border-dashed border-border space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Folder size={24} />
              </div>
              <h3 className="text-sm font-bold text-foreground">No categories found matching your search</h3>
              <button
                type="button"
                onClick={() => setIsCreateCategoryModalOpen(true)}
                className="primary-button inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold cursor-pointer"
              >
                <Plus size={14} />
                <span>New Category</span>
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
                    className="bg-surface rounded-2xl border border-border p-6 shadow-2xs hover:shadow-lg hover:border-primary/60 transition-all duration-200 flex flex-col justify-between group text-left cursor-pointer relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${colorStyle.bg} ${colorStyle.text} border ${colorStyle.border} flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-2xs`}>
                          <IconComp size={22} />
                        </div>

                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${colorStyle.bg} ${colorStyle.text} ${colorStyle.border}`}>
                          {tmplCount} {tmplCount === 1 ? "template" : "templates"}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                        {cat.description || "Collection of document templates for this category"}
                      </p>
                    </div>

                    <div className="pt-4 mt-5 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                      <span className="flex items-center gap-1.5">
                        <FolderOpen size={15} />
                        <span>Browse Templates</span>
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
          <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="w-9 h-9 rounded-xl border border-border bg-surface hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-2xs cursor-pointer"
                title="Back to categories"
              >
                <ChevronLeft size={18} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Templates
                  </button>
                  <span className="text-muted-foreground/40 text-xs">/</span>
                  <span className="text-xs font-bold text-primary">{selectedCategory.name}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-tight mt-0.5">
                  {selectedCategory.name} Templates
                </h2>
              </div>
            </div>

            {/* Action: Create New Template in this Category */}
            <button
              type="button"
              onClick={() => setIsTypeModalOpen(true)}
              className="primary-button inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>New Template</span>
            </button>
          </div>

          {/* Search in this category */}
          <div className="bg-surface rounded-2xl border border-border p-3 shadow-2xs">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search within ${selectedCategory.name}...`}
                className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-muted/20 hover:bg-surface focus:bg-surface text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/70"
              />
            </div>
          </div>

          {/* Level 2 Templates Grid */}
          {currentCategoryTemplates.length === 0 ? (
            <div className="p-12 text-center bg-surface rounded-2xl border border-dashed border-border space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <FileText size={24} />
              </div>
              <h3 className="text-sm font-bold text-foreground">No templates found in this category</h3>
              <p className="text-xs text-muted-foreground">
                Create a new template for {selectedCategory.name} to get started.
              </p>
              <button
                type="button"
                onClick={() => setIsTypeModalOpen(true)}
                className="primary-button inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                <Plus size={14} />
                <span>Create Template</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentCategoryTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="bg-surface rounded-2xl border border-border p-5 shadow-2xs hover:shadow-lg hover:border-primary/50 transition-all duration-200 flex flex-col justify-between group text-left relative"
                >
                  <div>
                    {/* Live Document Preview Miniature */}
                    <CardMiniaturePreview template={tmpl} />

                    {/* Badge & Info Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {tmpl.badge || "Template"}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {tmpl.orientation === "landscape" ? "A4 Landscape" : "A4 Portrait"}
                      </span>
                    </div>

                    {/* Renaming inline or Title display */}
                    {renamingTemplate?.id === tmpl.id ? (
                      <div className="flex items-center gap-1.5 my-1">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="flex-1 text-sm font-bold text-foreground border border-primary bg-surface rounded-lg px-2 py-1 outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleSaveRename}
                          disabled={isRenamingLoading}
                          className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                          title="Save name"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRenamingTemplate(null)}
                          className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {tmpl.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleStartRename(tmpl)}
                          className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                          title="Rename template"
                        >
                          <Edit3 size={13} />
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {tmpl.description || "Pre-configured document structure ready for use"}
                    </p>
                  </div>

                  {/* Card Actions Bar */}
                  <div className="pt-3.5 mt-4 border-t border-border/60 flex items-center justify-between gap-2 text-xs">
                    {/* View Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(tmpl)}
                      className="inline-flex items-center gap-1 text-primary font-semibold hover:underline cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Duplicate Template */}
                      <button
                        type="button"
                        onClick={() => handleDuplicateTemplate(tmpl)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        title="Duplicate template"
                      >
                        <Copy size={13} />
                      </button>

                      {/* Delete Custom Template */}
                      {tmpl.badge !== "มาตรฐาน" && (
                        <button
                          type="button"
                          onClick={() => handleDeleteTemplate(tmpl.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                          title="Delete template"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}

                      {/* Edit in Studio */}
                      <Link
                        href={`/templates/new?edit=${tmpl.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-foreground font-semibold transition-all cursor-pointer shadow-2xs"
                      >
                        <Edit3 size={12} />
                        <span>Edit</span>
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
