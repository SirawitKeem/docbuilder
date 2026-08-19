"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  FileText,
  Plus,
  Search,
  Pencil,
  Trash2,
  MoreHorizontal,
  ChevronRight,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const template = templateRegistry[templateId]?.schema;
  const templateName = template?.fullName || "เอกสาร";

  const load = () =>
    listFieldProfiles().then((data) => {
      setProfiles(data);
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
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">เลือกชุดข้อมูลที่จะใช้</h1>
          <p className="text-sm text-gray-500">
            เทมเพลต: <span className="font-semibold text-gray-800">{templateName}</span>
          </p>
        </div>
        <div className="h-64 rounded-card bg-gray-100 animate-pulse" />
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
    <div>
      {/* Short & Clean Top Navigation Back Link */}
      <div className="mb-4">
        <Link
          href="/create"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={15} />
          ย้อนกลับ
        </Link>
      </div>

      {/* Header Title Section with Prominent Template Badge */}
      <div className="mb-8 space-y-1.5">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">เลือกชุดข้อมูลที่จะใช้</h1>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100">
            {templateName}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          เลือกชุดข้อมูลที่บันทึกไว้เพื่อดึงไปเติมในเอกสาร <strong className="text-gray-700 font-semibold">{templateName}</strong> โดยอัตโนมัติ
        </p>
      </div>

      {/* Main Container Card - Matches Profile Data UI 100% */}
      <div className="bg-white border border-gray-200 rounded-card p-6 shadow-card space-y-5">
        
        {/* Toolbar: Search Input + Create Profile Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 sm:max-w-md">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={17} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อชุดข้อมูล, บริษัท หรือผู้ลงนาม..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          <Link
            href="/profile-data/new"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-all shadow-sm shrink-0"
          >
            <Plus size={16} />
            สร้างข้อมูลใหม่
          </Link>
        </div>

        {/* Profiles Table / Card List */}
        <div className="border border-gray-200/90 rounded-xl overflow-visible bg-white">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200/90 text-xs font-semibold text-gray-500 bg-gray-50/70">
                <th className="px-5 py-3.5">ชื่อชุดข้อมูล</th>
                <th className="px-5 py-3.5">ผู้ลงนาม</th>
                <th className="px-5 py-3.5">ตำแหน่ง</th>
                <th className="px-5 py-3.5">อัปเดตล่าสุด</th>
                <th className="px-5 py-3.5 text-right w-36">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">
                    {searchQuery ? "ไม่พบข้อมูลที่ตรงกับการค้นหา" : "ยังไม่มีชุดข้อมูลที่บันทึกไว้ — เริ่มสร้างชุดแรกได้เลย"}
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((p) => {
                  const companyName = p.name || p.values?.our_company_name || p.values?.counterparty_name || "บริษัท ไม่ระบุชื่อ";
                  const address = (
                    p.values?.our_company_address ||
                    p.values?.counterparty_address ||
                    p.values?.receiving_party_address ||
                    "ไม่ได้ระบุที่อยู่"
                  );
                  const signatory = (
                    p.values?.our_signatory_name ||
                    p.values?.disclosing_signatory_name ||
                    p.values?.counterparty_signatory_name ||
                    p.values?.receiving_signatory_name ||
                    "-"
                  );
                  const position = (
                    p.values?.our_signatory_position ||
                    p.values?.disclosing_signatory_position ||
                    p.values?.counterparty_signatory_position ||
                    p.values?.receiving_signatory_position ||
                    "-"
                  );

                  return (
                    <tr
                      key={p.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Company Name & Address */}
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 mt-0.5">
                            <Building2 size={20} />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 text-sm block">{companyName}</span>
                            <p className="text-xs text-gray-400 mt-1 max-w-lg leading-relaxed line-clamp-2">
                              {address}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Signatory */}
                      <td className="px-5 py-4 text-gray-800 text-xs font-semibold">{signatory}</td>

                      {/* Position */}
                      <td className="px-5 py-4 text-gray-500 text-xs">{position}</td>

                      {/* Last Updated */}
                      <td className="px-5 py-4 text-gray-500 text-xs font-mono">
                        {formatThaiDateTime(p.updatedAt || p.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right relative">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedId(p.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-bold hover:bg-primary-500 transition-colors shadow-2xs shrink-0"
                          >
                            เลือกใช้งาน
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === p.id ? null : p.id);
                            }}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 transition-colors shadow-2xs"
                            title="ตัวเลือกเพิ่มเติม"
                          >
                            <MoreHorizontal size={15} />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === p.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-5 top-11 w-36 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                            >
                              <Link
                                href={`/profile-data/${p.id}`}
                                target="_blank"
                                onClick={() => setOpenMenuId(null)}
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
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Blank Document Choice Card */}
        <div
          onClick={() => setSelectedId(null)}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-100/70 hover:border-gray-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3.5 min-w-0 pr-4">
            <div className="w-10 h-10 rounded-xl bg-gray-200 text-gray-600 flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm group-hover:text-gray-800">
                เริ่มจากเอกสารเปล่า (ไม่ใช้ข้อมูลที่บันทึกไว้)
              </p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                กรอกข้อมูลสัญญาใหม่ทั้งหมดด้วยตัวเองตั้งแต่ต้น
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-semibold group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all shadow-2xs">
            <span>เลือกเอกสารเปล่า</span>
            <ChevronRight size={15} />
          </div>
        </div>

      </div>
    </div>
  );
}
