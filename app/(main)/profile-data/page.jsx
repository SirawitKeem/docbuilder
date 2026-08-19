"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Building2,
  MoreHorizontal,
} from "lucide-react";
import { listFieldProfiles, deleteFieldProfile } from "@/lib/data/fieldProfiles";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const load = () => listFieldProfiles().then(setProfiles);

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

  const handleDelete = async (id, name) => {
    if (!confirm(`คุณต้องการลบชุดข้อมูล "${name}" ใช่หรือไม่?`)) return;
    await deleteFieldProfile(id);
    load();
  };

  if (profiles === null) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">ตั้งค่าข้อมูล</h1>
        <p className="text-sm text-gray-500 mb-8">
          จัดการและบันทึกชุดข้อมูลคู่ค้าเพื่อดึงไปใช้สร้างเอกสารอัตโนมัติ
        </p>
        <div className="h-64 rounded-card bg-gray-100 animate-pulse" />
      </div>
    );
  }

  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const companyName = (p.name || "").toLowerCase();
    const counterparty = (p.values?.counterparty_name || p.values?.receiving_party_name || "").toLowerCase();
    const signatory = (
      p.values?.our_signatory_name ||
      p.values?.disclosing_signatory_name ||
      p.values?.counterparty_signatory_name ||
      p.values?.receiving_signatory_name ||
      ""
    ).toLowerCase();
    return companyName.includes(q) || counterparty.includes(q) || signatory.includes(q);
  });

  return (
    <div>
      {/* Page Title & Subtitle Header - Standardized with all main pages */}
      <h1 className="text-2xl font-bold text-gray-900 mb-1">ตั้งค่าข้อมูล</h1>
      <p className="text-sm text-gray-500 mb-8">
        จัดการและบันทึกชุดข้อมูลคู่ค้าเพื่อดึงไปใช้สร้างเอกสารอัตโนมัติ
      </p>

      {/* Main Card Container */}
      <div className="bg-white border border-gray-200 rounded-card p-6 shadow-card space-y-5">
        
        {/* Toolbar: Search Input + Create Button */}
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
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-all shadow-sm shrink-0"
          >
            <Plus size={16} />
            สร้างข้อมูลใหม่
          </Link>
        </div>

        {/* Clean Data Table */}
        <div className="border border-gray-200/90 rounded-xl overflow-visible bg-white">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200/90 text-xs font-semibold text-gray-500 bg-gray-50/70">
                <th className="px-5 py-3.5">ชื่อชุดข้อมูล</th>
                <th className="px-5 py-3.5">ผู้ลงนาม</th>
                <th className="px-5 py-3.5">ตำแหน่ง</th>
                <th className="px-5 py-3.5">อัปเดตล่าสุด</th>
                <th className="px-5 py-3.5 text-right w-28">การกระทำ</th>
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
                      {/* Company Name & Address Subtext */}
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
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/profile-data/${p.id}`}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 transition-colors shadow-2xs"
                            title="แก้ไขข้อมูล"
                          >
                            <Pencil size={15} />
                          </Link>

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
                                onClick={() => setOpenMenuId(null)}
                                className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                              >
                                <Pencil size={14} className="text-gray-500" />
                                แก้ไขข้อมูล
                              </Link>
                              <button
                                onClick={() => {
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
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
