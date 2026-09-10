"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import DocumentsTable from "@/components/documents/DocumentsTable";
import { getTemplates } from "@/lib/data/templates";
import { useLanguage } from "@/context/LanguageContext";

export default function HistoryPage() {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allTemplatesList, setAllTemplatesList] = useState([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [templateFilter, setTemplateFilter] = useState("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchHistory = () => {
    setLoading(true);
    fetch("/api/sent-history")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setDocuments(data || []);
        setLoading(false);
      })
      .catch(() => {
        setDocuments([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHistory();
    getTemplates().then((data) => {
      setAllTemplatesList((data || []).filter((t) => t.available !== false));
    });
  }, []);

  // Filter Sent Documents dynamically
  const filteredDocuments = documents.filter((doc) => {
    const q = searchQuery.toLowerCase().trim();
    const docName = (doc.name || "").toLowerCase();
    const templateName = (doc.templateName || "").toLowerCase();
    const sentTo = (doc.sentTo || "").toLowerCase();

    const matchesSearch = !q || docName.includes(q) || templateName.includes(q) || sentTo.includes(q);
    const matchesTemplate = templateFilter === "all" || doc.templateId === templateFilter;

    return matchesSearch && matchesTemplate;
  });

  // Pagination Calculations
  const totalItems = filteredDocuments.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
          {t('history.title') || "Sent History"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t('history.description') || "ตรวจสอบและติดตามเอกสารทั้งหมด..."}
        </p>
      </div>

      {/* Clean Toolbar Container: Search Input & Template Filter */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t('history.searchPlaceholder') || "ค้นหาตามชื่อเอกสาร หรือ ผู้รับ..."}
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
            <option value="all">{t('documents.allTemplates') || "ทุกเทมเพลต"}</option>
            {allTemplatesList.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Sent History Documents Table */}
      {loading ? (
        <div className="h-64 rounded-2xl bg-muted animate-pulse" />
      ) : (
        <div className="space-y-4">
          <DocumentsTable
            documents={paginatedDocuments}
            deleteApiUrl="/api/sent-history"
            showSentTo
            allowEdit={false}
            emptyMessage={t('history.noResults') || "ไม่พบประวัติการส่งเอกสารที่ตรงกับการค้นหา"}
            onRefresh={fetchHistory}
          />

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs text-muted-foreground">
            <div>
              {t('pagination.showing', { start: totalItems > 0 ? startIndex + 1 : 0, end: Math.min(startIndex + pageSize, totalItems), total: totalItems })}
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
                    className={`w-8 h-8 rounded-[8px] text-xs font-semibold transition-all ${
                      validCurrentPage === pageNum
                        ? "primary-button text-white shadow-2xs"
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
                <option value={5}>{t('pagination.perPage', { count: 5 })}</option>
                <option value={10}>{t('pagination.perPage', { count: 10 })}</option>
                <option value={20}>{t('pagination.perPage', { count: 20 })}</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
