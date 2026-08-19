"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Building2,
  Star,
  MoreHorizontal,
} from "lucide-react";
import { listFieldProfiles, deleteFieldProfile, updateFieldProfile } from "@/lib/data/fieldProfiles";

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
    if (!confirm(`ลบข้อมูล "${name}" ใช่ไหม?`)) return;
    await deleteFieldProfile(id);
    load();
  };

  const handleToggleStar = async (p) => {
    await updateFieldProfile(p.id, {
      name: p.name,
      values: p.values,
      isFavorite: !p.isFavorite,
    });
    load();
  };

  const handleSetDefault = async (targetProfile) => {
    // ปลด default อันอื่นออก แล้วตั้งให้targetProfile เป็น default
    for (const p of profiles) {
      if (p.isDefault && p.id !== targetProfile.id) {
        await updateFieldProfile(p.id, { name: p.name, values: p.values, isDefault: false });
      }
    }
    await updateFieldProfile(targetProfile.id, {
      name: targetProfile.name,
      values: targetProfile.values,
      isDefault: !targetProfile.isDefault,
    });
    load();
  };

  if (profiles === null) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  // Filter profiles based on search query
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
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Outer Card Container */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card space-y-6">
        
        {/* Header Bar: Title + Search Box + Create Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-900">ชุดข้อมูลที่บันทึกไว้</h1>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input Box */}
            <div className="relative flex-1 sm:w-80">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={17} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อบริษัท หรือผู้ลงนาม"
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all bg-gray-50/50"
              />
            </div>

            {/* Create New Profile Button */}
            <Link
              href="/profile-data/new"
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-all shadow-sm shrink-0"
            >
              <Plus size={16} />
              สร้างข้อมูลใหม่
            </Link>
          </div>
        </div>

        {/* Data Table */}
        <div className="border border-gray-200/90 rounded-xl overflow-visible bg-white">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200/90 text-xs font-semibold text-gray-500 bg-gray-50/70">
                <th className="w-12 px-4 py-3.5 text-center"></th>
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
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
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
                      {/* Star Button */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleToggleStar(p)}
                          className="text-gray-300 hover:text-amber-400 transition-colors"
                          title={p.isFavorite ? "เลิกติดดาว" : "ติดดาวเป็นรายการโปรด"}
                        >
                          <Star
                            size={18}
                            className={p.isFavorite ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                          />
                        </button>
                      </td>

                      {/* Company Name & Address */}
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              p.isDefault
                                ? "bg-primary-100 text-primary-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <Building2 size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-sm">{companyName}</span>
                              {p.isDefault && (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary-50 text-primary-600 border border-primary-100">
                                  ค่าเริ่มต้น
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1 max-w-lg leading-relaxed line-clamp-2">
                              {address}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Signatory */}
                      <td className="px-5 py-4 text-gray-800 text-xs font-medium">{signatory}</td>

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
                            title="เพิ่มเติม"
                          >
                            <MoreHorizontal size={15} />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === p.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-5 top-11 w-44 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                            >
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleSetDefault(p);
                                }}
                                className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                              >
                                <Star size={14} className="text-amber-500" />
                                {p.isDefault ? "ยกเลิกค่าเริ่มต้น" : "ตั้งเป็นค่าเริ่มต้น"}
                              </button>
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
