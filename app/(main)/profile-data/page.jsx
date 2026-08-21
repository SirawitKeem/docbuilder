"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Building2,
  MoreVertical,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
} from "lucide-react";
import { listFieldProfiles, deleteFieldProfile } from "@/lib/data/fieldProfiles";
import { getRelevantTemplates } from "@/lib/profiles/compatibility";
import { getTemplates } from "@/lib/data/templates";

const badgeColorMap = {
  quotation: "bg-gray-100 text-gray-700 border-gray-200",
  nda: "bg-blue-50 text-blue-700 border-blue-200/80",
  distributor: "bg-teal-50 text-teal-700 border-teal-200/80",
  partner: "bg-purple-50 text-purple-700 border-purple-200/80",
};

function formatThaiDateTime(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const monthNamesTh = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];
  const day = date.getDate();
  const month = monthNamesTh[date.getMonth()];
  const year = date.getFullYear() + 543;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year}, ${hours}:${minutes} น.`;
}

export default function ProfileDataListPage() {
  const [profiles, setProfiles] = useState(null);
  const [allTemplatesList, setAllTemplatesList] = useState([]);
  
  // UI & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

  // Selection & Detail Panel State (Starts NULL by default!)
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const load = () =>
    listFieldProfiles().then((data) => {
      setProfiles(data);
    });

  useEffect(() => {
    load();
    getTemplates().then((data) => {
      // Filter ONLY available/active templates
      setAllTemplatesList((data || []).filter((t) => t.available !== false));
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`คุณต้องการลบชุดข้อมูล "${name}" ใช่หรือไม่?`)) return;
    await deleteFieldProfile(id);
    if (selectedProfileId === id) {
      setSelectedProfileId(null);
    }
    load();
  };

  if (profiles === null) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">ตั้งค่าข้อมูลกลาง</h1>
        <p className="text-sm text-gray-500 mb-8">
          จัดการข้อมูลที่ใช้ร่วมกันสำหรับเทมเพลตต่าง ๆ เพื่อดึงไปเติมในเอกสารโดยอัตโนมัติ (เป็นข้อมูลอ้างอิง ไม่ใช่ข้อมูลในเอกสาร)
        </p>
        <div className="h-64 rounded-card bg-gray-100 animate-pulse" />
      </div>
    );
  }

  // Filter Profiles
  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const values = p.values || {};
    
    // Search Query Filter
    const companyName = (p.name || values.counterparty_name || values.bill_to_company || values.our_company_name || "").toLowerCase();
    const address = (values.counterparty_address || values.our_company_address || "").toLowerCase();
    const contact = (values.counterparty_signatory_name || values.attn_name || values.our_signatory_name || "").toLowerCase();

    const matchesSearch = !q || companyName.includes(q) || address.includes(q) || contact.includes(q);

    // Template Filter
    const relevantTemplates = getRelevantTemplates(values);
    const matchesTemplate =
      selectedTemplateFilter === "all" ||
      relevantTemplates.some((r) => r.templateId === selectedTemplateFilter);

    // Status Filter
    const isComplete = relevantTemplates.length > 0 && relevantTemplates.some((r) => r.isComplete);
    const matchesStatus =
      selectedStatusFilter === "all" ||
      (selectedStatusFilter === "complete" && isComplete) ||
      (selectedStatusFilter === "incomplete" && !isComplete);

    return matchesSearch && matchesTemplate && matchesStatus;
  });

  // Dynamic Pagination Calculations based on REAL filtered data count
  const totalItems = filteredProfiles.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedProfiles = filteredProfiles.slice(startIndex, startIndex + pageSize);

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);

  // Selected Profile Real Dynamic Values
  const selectedValues = selectedProfile?.values || {};
  const selectedCompanyName = selectedProfile?.name || selectedValues.counterparty_name || selectedValues.bill_to_company || selectedValues.our_company_name || "บริษัท ไม่ระบุชื่อ";
  const selectedTaxId = selectedValues.counterparty_registration_number || selectedValues.tax_id || "-";
  const selectedBusinessType = selectedValues.business_type || "-";
  const selectedAddress = selectedValues.counterparty_address || selectedValues.our_company_address || "-";
  const selectedPhone = selectedValues.am_phone || selectedValues.phone || "-";
  const selectedEmail = selectedValues.email || "-";
  const selectedWebsite = selectedValues.website || "-";
  const selectedContactName = selectedValues.counterparty_signatory_name || selectedValues.attn_name || selectedValues.our_signatory_name || "-";
  const selectedPosition = selectedValues.counterparty_signatory_position || selectedValues.our_signatory_position || "-";
  const selectedRelevantTemplates = selectedProfile ? getRelevantTemplates(selectedValues) : [];
  const selectedIsComplete = selectedRelevantTemplates.length > 0 && selectedRelevantTemplates.some((r) => r.isComplete);

  return (
    <div>
      {/* 1. Page Header (Exact layout parity with /documents) */}
      <h1 className="text-2xl font-bold text-gray-900 mb-1">ตั้งค่าข้อมูลกลาง</h1>
      <p className="text-sm text-gray-500 mb-8">
        จัดการข้อมูลที่ใช้ร่วมกันสำหรับเทมเพลตต่าง ๆ เพื่อดึงไปเติมในเอกสารโดยอัตโนมัติ (เป็นข้อมูลอ้างอิง ไม่ใช่ข้อมูลในเอกสาร)
      </p>

      {/* 2. Main Section: Wrapped in Unified White Container */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left Column Container */}
        <div className="flex-1 w-full bg-white border border-gray-200 rounded-card shadow-card p-6 space-y-5 overflow-visible">
          
          {/* Toolbar inside white container */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pb-2 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 sm:max-w-md">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="ค้นหาชุดข้อมูล, บริษัท, ผู้ติดต่อ..."
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 text-xs text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Filter Template Dropdown */}
              <div className="relative">
                <select
                  value={selectedTemplateFilter}
                  onChange={(e) => {
                    setSelectedTemplateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 pl-3 pr-8 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 outline-none focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="all">ทุกเทมเพลต</option>
                  {allTemplatesList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <Filter size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter Status Dropdown */}
              <div className="relative">
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => {
                    setSelectedStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 pl-3 pr-8 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 outline-none focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="all">สถานะ: ทั้งหมด</option>
                  <option value="complete">ข้อมูลครบถ้วน</option>
                  <option value="incomplete">ข้อมูลไม่ครบ</option>
                </select>
              </div>
            </div>

            {/* Create Button */}
            <Link
              href="/profile-data/new"
              className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-[10px] bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white text-xs font-bold hover:opacity-95 transition-opacity shrink-0"
            >
              <Plus size={16} />
              สร้างชุดข้อมูลใหม่
            </Link>
          </div>

          {/* Data Row Cards List */}
          <div className="space-y-3">
            {paginatedProfiles.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-gray-400 text-xs">
                {searchQuery ? "ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา" : "ยังไม่มีชุดข้อมูล — กดปุ่มสร้างชุดข้อมูลใหม่ด้านบน"}
              </div>
            ) : (
              paginatedProfiles.map((p) => {
                const isSelected = selectedProfileId === p.id;
                const values = p.values || {};
                const companyName = p.name || values.counterparty_name || values.our_company_name || "บริษัท ไม่ระบุชื่อ";
                const address = values.counterparty_address || values.our_company_address || "ไม่ได้ระบุที่อยู่";
                const formattedDate = formatThaiDateTime(p.updatedAt || p.createdAt);

                const relevant = getRelevantTemplates(values);
                const isComplete = relevant.length > 0 && relevant.some((r) => r.isComplete);

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProfileId(p.id)}
                    className={`p-4 rounded-[16px] border transition-all cursor-pointer bg-white relative ${
                      isSelected
                        ? "border-[#7C4DFF] bg-[#F5F1FF]/20 shadow-xs ring-1 ring-[#E1D3FF]"
                        : "border-[#E4E4E8] hover:border-gray-300 hover:bg-gray-50/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Checkbox & Building Icon & Profile Info */}
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        {/* Checkbox Circle */}
                        <div className="pt-1 shrink-0">
                          <input
                            type="radio"
                            name="profile-select"
                            checked={isSelected}
                            onChange={() => setSelectedProfileId(p.id)}
                            className="w-4 h-4 text-[#7C4DFF] border-gray-300 focus:ring-[#7C4DFF] cursor-pointer"
                          />
                        </div>

                        {/* Icon Box */}
                        <div className="w-10 h-10 rounded-[10px] bg-[#F5F1FF] border border-[#E1D3FF] text-[#7C4DFF] flex items-center justify-center shrink-0">
                          <Building2 size={20} />
                        </div>

                        {/* Company Name & Status & Tags */}
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="font-bold text-[#22162B] text-sm leading-snug">{companyName}</h3>
                            
                            {/* Status Badge */}
                            {isComplete ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DDEEE2] text-[#17682F] text-[11px] font-semibold">
                                ข้อมูลครบถ้วน
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF2CE] text-[#725000] text-[11px] font-semibold">
                                ข้อมูลไม่ครบ
                              </span>
                            )}
                          </div>

                          {/* Template Tags with distinct colors per template */}
                          <div className="flex items-center gap-1.5 flex-wrap text-xs text-[#646469]">
                            <span className="text-gray-400 font-medium">ใช้กับ {relevant.length} เทมเพลต</span>
                            {relevant.slice(0, 3).map((r, idx) => {
                              const badgeStyle = badgeColorMap[r.templateId] || "bg-gray-100 text-gray-700 border-gray-200";
                              return (
                                <span
                                  key={idx}
                                  className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${badgeStyle}`}
                                >
                                  {r.schema.name}
                                </span>
                              );
                            })}
                            {relevant.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold">
                                +{relevant.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Address with MapPin Icon */}
                          <div className="flex items-center gap-1.5 text-xs text-[#646469] truncate max-w-2xl">
                            <MapPin size={14} className="text-gray-400 shrink-0" />
                            <span className="truncate">{address}</span>
                          </div>

                          {/* Metadata Footer with Calendar Icon */}
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 pt-0.5">
                            <Calendar size={13} className="text-gray-400 shrink-0" />
                            <span>อัปเดตล่าสุด: <strong className="font-mono text-gray-500">{formattedDate}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Right Row Actions */}
                      <div className="flex items-center gap-2 shrink-0 pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProfileId(p.id);
                          }}
                          className="px-3.5 py-1.5 rounded-[10px] border border-[#E4E4E8] bg-white hover:bg-[#F6F6FA] text-[#7C4DFF] font-semibold text-xs transition-colors"
                        >
                          ดูรายละเอียด
                        </button>

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === p.id ? null : p.id);
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {openMenuId === p.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 top-9 w-36 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                            >
                              <Link
                                href={`/profile-data/${p.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                              >
                                <Pencil size={14} className="text-gray-500" />
                                แก้ไขข้อมูล
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  handleDelete(p.id, p.name);
                                }}
                                className="w-full text-left px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                              >
                                <Trash2 size={14} className="text-red-500" />
                                ลบชุดข้อมูล
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* DYNAMIC Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-gray-500 border-t border-gray-100">
            <div>
              แสดง <strong className="font-semibold text-gray-800">{totalItems > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + pageSize, totalItems)}</strong> จาก <strong className="font-semibold text-gray-800">{totalItems}</strong> รายการ
            </div>

            <div className="flex items-center gap-4">
              {/* Dynamic Page Controls */}
              <div className="flex items-center gap-1">
                <button
                  disabled={validCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-[10px] text-xs font-semibold transition-colors ${
                      validCurrentPage === pageNum
                        ? "bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white shadow-2xs"
                        : "border border-[#E4E4E8] hover:bg-[#F6F6FA] text-[#646469]"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  disabled={validCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 rounded-[10px] border border-[#E4E4E8] flex items-center justify-center hover:bg-[#F6F6FA] disabled:opacity-40"
                >
                  <ChevronRight size={15} />
                </button>
              </div>

              {/* Page Size Select */}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 px-2 rounded-[10px] border border-[#E4E4E8] bg-white text-xs text-[#646469] outline-none"
              >
                <option value={5}>5 / หน้า</option>
                <option value={10}>10 / หน้า</option>
                <option value={20}>20 / หน้า</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Detail Panel Drawer */}
        {selectedProfile && (
          <div className="w-full lg:w-[420px] bg-white border border-[#E4E4E8] rounded-[16px] shadow-card p-5 space-y-5 shrink-0 animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Panel Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#E4E4E8]">
              <div>
                <h2 className="text-base font-bold text-[#22162B]">รายละเอียดชุดข้อมูล</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-sm text-[#22162B]">{selectedCompanyName}</span>
                  {selectedIsComplete ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#DDEEE2] text-[#17682F] text-[10px] font-semibold">
                      ข้อมูลครบถ้วน
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFF2CE] text-[#725000] text-[10px] font-semibold">
                      ข้อมูลไม่ครบ
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#646469] mt-0.5">
                  ใช้กับ {selectedRelevantTemplates.length} เทมเพลต
                </p>
              </div>
              <button
                onClick={() => setSelectedProfileId(null)}
                className="p-1 rounded-[10px] hover:bg-[#F6F6FA] text-gray-400 hover:text-gray-600 transition-colors"
                title="ปิดหน้าต่าง"
              >
                <X size={18} />
              </button>
            </div>

            {/* Section 1: ข้อมูลพื้นฐาน */}
            <div className="space-y-2.5 text-xs border-b border-[#E4E4E8] pb-4">
              <h3 className="font-bold text-xs tracking-wide text-[#646469]">ข้อมูลพื้นฐาน</h3>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-[#646469]">ชื่อบริษัท</span>
                <span className="font-semibold text-[#22162B]">{selectedCompanyName}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-[#646469]">เลขประจำตัวผู้เสียภาษี</span>
                <span className="font-mono text-[#22162B]">{selectedTaxId}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-[#646469]">ประเภทธุรกิจ</span>
                <span className="text-[#22162B]">{selectedBusinessType}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-[#646469]">ที่อยู่</span>
                <span className="text-[#22162B] leading-relaxed">{selectedAddress}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-[#646469]">เบอร์โทรศัพท์</span>
                <span className="text-[#22162B]">{selectedPhone}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-[#646469]">อีเมล</span>
                <span className="text-[#7C4DFF]">{selectedEmail}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-[#646469]">เว็บไซต์</span>
                <span className="text-[#7C4DFF]">{selectedWebsite}</span>
              </div>
            </div>

            {/* Section 2: ข้อมูลผู้ติดต่อหลัก */}
            <div className="space-y-2.5 text-xs border-b border-[#E4E4E8] pb-4">
              <h3 className="font-bold text-xs tracking-wide text-[#646469]">ข้อมูลผู้ติดต่อหลัก</h3>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-[#646469]">ชื่อ-สกุล</span>
                <span className="font-semibold text-[#22162B]">{selectedContactName}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-[#646469]">ตำแหน่ง</span>
                <span className="text-[#22162B]">{selectedPosition}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-[#646469]">เบอร์โทรศัพท์</span>
                <span className="text-[#22162B]">{selectedPhone}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-[#646469]">อีเมล</span>
                <span className="text-[#7C4DFF]">{selectedEmail}</span>
              </div>
            </div>

            {/* Section 3: ประวัติการใช้งาน */}
            <div className="space-y-2.5 text-xs pb-2">
              <h3 className="font-bold text-xs tracking-wide text-[#646469]">ประวัติการใช้งาน</h3>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-[#646469]">สร้างเมื่อ</span>
                <span className="font-mono text-[#646469]">{formatThaiDateTime(selectedProfile.createdAt)}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-[#646469]">อัปเดตล่าสุด</span>
                <span className="font-mono text-[#646469]">{formatThaiDateTime(selectedProfile.updatedAt || selectedProfile.createdAt)}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-[#646469]">อัปเดตโดย</span>
                <span className="text-[#22162B]">
                  {selectedProfile.values?.our_signatory_name || "นายศรายุทธ โกสิยารักษ์"}
                </span>
              </div>
            </div>

            {/* Panel Fixed Footer Buttons */}
            <div className="pt-3 border-t border-[#E4E4E8] flex items-center justify-between gap-3">
              <button
                onClick={() => handleDelete(selectedProfile.id, selectedProfile.name)}
                className="px-4 py-2 rounded-[10px] border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs transition-colors"
              >
                ลบชุดข้อมูล
              </button>
              <Link
                href={`/profile-data/${selectedProfile.id}`}
                className="px-5 py-2 rounded-[10px] bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white font-semibold text-xs hover:opacity-95 transition-opacity inline-flex items-center gap-1.5"
              >
                <Pencil size={14} />
                แก้ไขข้อมูล
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
