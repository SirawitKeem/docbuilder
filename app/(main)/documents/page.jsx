"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getDocumentHistory } from "@/lib/data/documents";
import DocumentsTable from "@/components/documents/DocumentsTable";
import { getTemplates } from "@/lib/data/templates";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allTemplatesList, setAllTemplatesList] = useState([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'draft' | 'sent'
  const [templateFilter, setTemplateFilter] = useState("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadDocuments = () => {
    setLoading(true);
    getDocumentHistory().then((data) => {
      setDocuments(data || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadDocuments();
    getTemplates().then((data) => {
      setAllTemplatesList((data || []).filter((t) => t.available !== false));
    });
  }, []);

  // Filter Documents dynamically
  const filteredDocuments = documents.filter((doc) => {
    const q = searchQuery.toLowerCase().trim();
    const docName = (doc.name || "").toLowerCase();
    const templateName = (doc.templateName || "").toLowerCase();
    const createdBy = (doc.createdBy || "").toLowerCase();

    const matchesSearch = !q || docName.includes(q) || templateName.includes(q) || createdBy.includes(q);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "draft" && doc.status === "draft") ||
      (statusFilter === "sent" && doc.status === "sent");

    const matchesTemplate =
      templateFilter === "all" || doc.templateId === templateFilter;

    return matchesSearch && matchesStatus && matchesTemplate;
  });

  // Calculate status counts
  const totalCount = documents.length;
  const draftCount = documents.filter((d) => d.status === "draft").length;
  const sentCount = documents.filter((d) => d.status === "sent").length;

  // Pagination Calculations
  const totalItems = filteredDocuments.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      {/* Page Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
            เอกสารของฉัน
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            เอกสารทั้งหมดที่คุณสร้างและบันทึกไว้ ทั้งฉบับร่างและที่จัดส่งแล้ว
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white text-xs font-semibold hover:opacity-95 transition-opacity shrink-0 shadow-sm"
        >
          <Plus size={16} strokeWidth={2.5} />
          สร้างเอกสารใหม่
        </Link>
      </div>

      {/* Toolbar & Filter Bar Container */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Status Segmented Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl border border-border/60 self-start sm:self-auto overflow-x-auto">
            <button
              onClick={() => {
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === "all"
                  ? "bg-surface text-foreground shadow-2xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>ทั้งหมด</span>
              <span className="px-1.5 py-0.2 rounded-full bg-muted text-[10px] font-bold">
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => {
                setStatusFilter("draft");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === "draft"
                  ? "bg-surface text-foreground shadow-2xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>ฉบับร่าง</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#FFF2CE] text-[#725000] text-[10px] font-bold">
                {draftCount}
              </span>
            </button>

            <button
              onClick={() => {
                setStatusFilter("sent");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === "sent"
                  ? "bg-surface text-foreground shadow-2xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>ส่งแล้ว</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#DDEEE2] text-[#17682F] text-[10px] font-bold">
                {sentCount}
              </span>
            </button>
          </div>

          {/* Search Input & Template Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="ค้นหาชื่อเอกสาร, ผู้สร้าง, เทมเพลต..."
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-border bg-muted/20 text-xs text-foreground outline-none focus:border-primary focus:bg-surface transition-all"
              />
            </div>

            {/* Template Filter Select */}
            <select
              value={templateFilter}
              onChange={(e) => {
                setTemplateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-3 rounded-xl border border-border bg-surface text-xs font-medium text-foreground outline-none cursor-pointer shrink-0"
            >
              <option value="all">ทุกเทมเพลต</option>
              {allTemplatesList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Documents Table */}
      {loading ? (
        <div className="h-64 rounded-2xl bg-muted animate-pulse" />
      ) : (
        <div className="space-y-4">
          <DocumentsTable
            documents={paginatedDocuments}
            emptyMessage="ไม่พบเอกสารที่ตรงกับเงื่อนไขการค้นหา"
            onRefresh={loadDocuments}
          />

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs text-muted-foreground">
            <div>
              แสดง <strong className="font-semibold text-foreground">{totalItems > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + pageSize, totalItems)}</strong> จาก <strong className="font-semibold text-foreground">{totalItems}</strong> รายการ
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  disabled={validCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                      validCurrentPage === pageNum
                        ? "bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white shadow-2xs"
                        : "border border-border hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  disabled={validCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 px-2 rounded-lg border border-border bg-surface text-xs text-muted-foreground outline-none cursor-pointer"
              >
                <option value={5}>5 / หน้า</option>
                <option value={10}>10 / หน้า</option>
                <option value={20}>20 / หน้า</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
