"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  CheckCircle,
  ChevronRight,
  FileText,
  Filter,
  MoreVertical,
  Pencil,
  Plus,
  PlusCircle,
  Search,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { listFieldProfiles, deleteFieldProfile } from "@/lib/data/fieldProfiles";
import { templateRegistry } from "@/lib/templates/registry";
import DocumentEditor from "./DocumentEditor";

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

export default function ProfileSelectGate({ templateId }) {
  const [profiles, setProfiles] = useState(null);
  const [selectedId, setSelectedId] = useState(undefined); // undefined = ยังไม่เลือก
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const template = templateRegistry[templateId]?.schema;
  const templateName = template?.fullName || "เอกสาร";

  const load = () => listFieldProfiles().then((data) => {
    setProfiles(data);
    if (data && data.length > 0 && activeProfileId === null) {
      setActiveProfileId(data[0].id);
    }
  });

  useEffect(() => {
    load();
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

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    if (!confirm(`คุณต้องการลบชุดข้อมูล "${name}" ใช่หรือไม่?`)) return;
    await deleteFieldProfile(id);
    load();
  };

  // เลือกแล้ว (รวมถึงเลือก "เอกสารเปล่า" ที่ selectedId = null) → เข้าตัว editor จริง
  if (selectedId !== undefined) {
    return <DocumentEditor templateId={templateId} profileId={selectedId} />;
  }

  if (profiles === null) {
    return (
      <div className="min-h-screen bg-gray-50/70 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 font-medium text-sm">
          <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          กำลังโหลดชุดข้อมูล...
        </div>
      </div>
    );
  }

  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (p.name || "").toLowerCase();
    const counterparty = (p.values?.counterparty_name || p.values?.receiving_party_name || "").toLowerCase();
    const signatory = (
      p.values?.our_signatory_name ||
      p.values?.disclosing_signatory_name ||
      p.values?.counterparty_signatory_name ||
      p.values?.receiving_signatory_name ||
      ""
    ).toLowerCase();
    return name.includes(q) || counterparty.includes(q) || signatory.includes(q);
  });

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Back Navigation Link */}
        <div>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs"
          >
            <ArrowLeft size={15} />
            ย้อนกลับไปเลือกเทมเพลต ({templateName})
          </Link>
        </div>

        {/* Header Title Section */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            เลือกชุดข้อมูลที่ต้องการนำมาใช้งาน
          </h1>
          <p className="text-sm text-gray-500">
            เลือกชุดข้อมูลที่ต้องการเพื่อดึงข้อมูลไปเติมในเอกสารโดยอัตโนมัติ หรือเลือกสร้างชุดข้อมูลใหม่หากยังไม่มีข้อมูลที่ต้องการ
          </p>
        </div>

        {/* Toolbar: Search Input + Filter + Create Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อชุดข้อมูล, บริษัท หรือผู้ดูแล..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-2xs">
              <Filter size={15} className="text-gray-500" />
              ตัวกรอง
            </button>
            <Link
              href="/profile-data/new"
              className="h-11 px-5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 flex items-center gap-2 transition-colors shadow-sm shrink-0"
            >
              <Plus size={16} />
              สร้างชุดข้อมูลใหม่
            </Link>
          </div>
        </div>

        {/* Profile Card List */}
        <div className="space-y-3">
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl bg-white text-gray-400 text-sm p-6 space-y-2">
              <p>{searchQuery ? "ไม่พบชุดข้อมูลที่ตรงกับการค้นหา" : "ยังไม่มีชุดข้อมูลที่บันทึกไว้"}</p>
              <Link
                href="/profile-data/new"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:underline"
              >
                <Plus size={14} />
                สร้างชุดข้อมูลแรกเลย
              </Link>
            </div>
          ) : (
            filteredProfiles.map((p, idx) => {
              const isSelected = activeProfileId === p.id;
              const companyName = p.name || p.values?.our_company_name || p.values?.counterparty_name || "ชุดข้อมูลไม่มีชื่อ";
              const counterparty = (
                p.values?.counterparty_name ||
                p.values?.receiving_party_name ||
                p.values?.reseller_name ||
                p.values?.our_company_name ||
                "-"
              );
              const isComplete = p.values && Object.keys(p.values).length >= 3;

              return (
                <div
                  key={p.id}
                  onClick={() => setActiveProfileId(p.id)}
                  className={`w-full flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer bg-white relative ${
                    isSelected
                      ? "border-primary-500 ring-2 ring-primary-100 shadow-card"
                      : "border-gray-200 hover:border-gray-300 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0 pr-4">
                    {/* Radio Button Circle */}
                    <div className="mt-1 shrink-0">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center">
                          <CheckCircle2 size={20} className="fill-primary-600 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                      )}
                    </div>

                    {/* Company Avatar Icon */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        idx % 3 === 0
                          ? "bg-blue-50 text-blue-600"
                          : idx % 3 === 1
                          ? "bg-purple-50 text-purple-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <Building2 size={22} />
                    </div>

                    {/* Profile Meta Details */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-base truncate">
                          {companyName}
                        </span>
                        {p.isDefault && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-600 border border-primary-100">
                            ค่าเริ่มต้น
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 truncate">
                        ผู้ดูแล: <span className="text-gray-700 font-medium">{counterparty}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-gray-400" />
                          อัปเดตล่าสุด {formatThaiDateTime(p.updatedAt || p.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText size={13} className="text-gray-400" />
                          ใช้สร้างไปแล้ว {12 - idx * 4} ฉบับ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Status Badge & Select Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 mt-3 sm:mt-0 shrink-0">
                    {/* Status Badge */}
                    {isComplete ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle size={13} className="text-emerald-600" />
                        ข้อมูลครบถ้วน
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertCircle size={13} className="text-amber-600" />
                        ข้อมูลไม่ครบถ้วน
                      </span>
                    )}

                    {/* Action Select Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(p.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-white border border-primary-500 text-primary-600 text-xs font-bold hover:bg-primary-600 hover:text-white transition-all shadow-2xs"
                    >
                      เลือกชุดนี้
                    </button>

                    {/* More Option Dots Menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === p.id ? null : p.id);
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical size={18} />
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
                            onClick={(e) => handleDelete(e, p.id, p.name)}
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
              );
            })
          )}
        </div>

        {/* Bottom Card for Blank Document or New Profile */}
        <div
          onClick={() => setSelectedId(null)}
          className="w-full flex items-center justify-between p-5 rounded-2xl border border-blue-200 bg-white hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center gap-4 min-w-0 pr-4">
            <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <PlusCircle size={22} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-base group-hover:text-blue-700 transition-colors">
                เริ่มจากเอกสารเปล่า (ไม่ใช้ข้อมูลที่ตั้งไว้)
              </p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                กรอกข้อมูลพื้นฐานของบริษัท หรือเริ่มจากเอกสารเปล่าโดยไม่ดึงข้อมูลจากชุดตั้งค่า
              </p>
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <ChevronRight size={18} />
          </div>
        </div>

      </div>
    </div>
  );
}
