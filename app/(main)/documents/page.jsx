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
import { extractDocumentMeta } from "@/lib/data/documentMeta";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allTemplatesList, setAllTemplatesList] = useState([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'exported'
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDocuments();
    getTemplates().then((data) => {
      setAllTemplatesList((data || []).filter((t) => t.available !== false));
    });
  }, []);

  // Filter Documents dynamically
  const filteredDocuments = documents.filter((doc) => {
    const meta = extractDocumentMeta(doc);
    const q = searchQuery.toLowerCase().trim();
    const docName = (meta?.name || doc.name || "").toLowerCase();
    const docNo = (meta?.docNumber || "").toLowerCase();
    const counterparty = (meta?.counterpartyName || "").toLowerCase();
    const templateName = (meta?.templateName || doc.templateName || "").toLowerCase();

    const matchesSearch = !q || docName.includes(q) || docNo.includes(q) || counterparty.includes(q) || templateName.includes(q);

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "exported" && meta?.hasExported);

    const matchesTemplate =
      templateFilter === "all" || doc.templateId === templateFilter;

    return matchesSearch && matchesTab && matchesTemplate;
  });

  // Calculate tab counts
  const allCount = documents.length;
  const exportedCount = documents.filter((d) => extractDocumentMeta(d)?.hasExported).length;

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
            My Documents
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage and organize all business contracts, agreements, and export logs
          </p>
        </div>

        <Link
          href="/create"
          className="primary-button inline-flex items-center gap-2 h-9 px-4 rounded-[6px] text-white font-medium text-xs shadow-xs hover:opacity-95 transition-all cursor-pointer select-none"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>New Document</span>
        </Link>
      </div>

      {/* Toolbar & Filter Bar Container */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Tabs: All Documents vs Export & Sent Logs */}
          <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/70 self-start sm:self-auto overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab("all");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === "all"
                  ? "bg-surface text-foreground shadow-2xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>All Documents</span>
              <span className="px-1.5 py-0.2 rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                {allCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("exported");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === "exported"
                  ? "bg-surface text-foreground shadow-2xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Export History</span>
              <span className="px-1.5 py-0.2 rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                {exportedCount}
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
                placeholder="Search documents by name, number, counterparty, template..."
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-border bg-muted/20 text-xs text-foreground outline-none focus:border-primary focus:bg-surface transition-all placeholder:text-muted-foreground/70"
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
              <option value="all">All Templates</option>
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
            showSentTo={activeTab === "exported"}
            emptyMessage={activeTab === "exported" ? "No export or email history found" : "No documents found matching your search"}
            onRefresh={loadDocuments}
          />

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs text-muted-foreground">
            <div>
              Showing <strong className="font-semibold text-foreground">{totalItems > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + pageSize, totalItems)}</strong> of <strong className="font-semibold text-foreground">{totalItems}</strong> documents
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
                        ? "bg-primary text-primary-foreground shadow-2xs font-bold"
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
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
