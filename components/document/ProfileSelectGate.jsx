"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  FileText,
  Plus,
  Search,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { listFieldProfiles } from "@/lib/data/fieldProfiles";
import { templateRegistry } from "@/lib/templates/registry";
import DocumentEditor from "./DocumentEditor";

export default function ProfileSelectGate({ templateId }) {
  const [profiles, setProfiles] = useState(null);
  const [selectedId, setSelectedId] = useState(undefined); // undefined = ยังไม่เลือก
  const [searchQuery, setSearchQuery] = useState("");

  const template = templateRegistry[templateId]?.schema;
  const templateName = template?.fullName || "เอกสาร";

  useEffect(() => {
    listFieldProfiles().then(setProfiles);
  }, []);

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
    <div className="min-h-screen bg-gray-50/70 flex flex-col">
      
      {/* Top Header Navigation */}
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sm:px-8 shrink-0 shadow-2xs">
        <div className="flex items-center gap-4">
          <Link
            href="/create"
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft size={18} />
            ย้อนกลับไปเลือกเทมเพลต
          </Link>
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          <p className="text-xs text-gray-500 hidden sm:block">
            สร้างเอกสารใหม่: <span className="font-bold text-gray-900">{templateName}</span>
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100 flex items-center gap-1.5">
          <Sparkles size={13} />
          ขั้นตอนที่ 1 จาก 2
        </span>
      </div>

      {/* Main Selection Area */}
      <div className="flex-1 overflow-auto max-w-3xl w-full mx-auto p-6 sm:p-8 space-y-6">
        
        {/* Hero Card Title */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-card space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            เลือกชุดข้อมูลที่ต้องการนำมาใช้งาน
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            เลือกรายชื่อคู่ค้าหรือข้อมูลองค์กรที่บันทึกไว้ เพื่อเติมรายละเอียดลงในสัญญาให้อัตโนมัติ หรือเลือกเริ่มจากเอกสารเปล่า
          </p>
        </div>

        {/* Toolbar: Live Search + Create Profile Link */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={17} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อชุดข้อมูล หรือชื่อคู่สัญญา..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          <Link
            href="/profile-data/new"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-all shadow-2xs shrink-0"
          >
            <Plus size={15} />
            เพิ่มชุดข้อมูลใหม่
          </Link>
        </div>

        {/* Profile Options List */}
        <div className="space-y-3">
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl bg-white text-gray-400 text-sm p-6 space-y-2">
              <p>{searchQuery ? "ไม่พบชุดข้อมูลที่ตรงกับการค้นหา" : "ยังไม่มีชุดข้อมูลที่ตั้งค่าไว้"}</p>
              <Link
                href="/profile-data/new"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:underline"
              >
                <Plus size={14} />
                สร้างชุดข้อมูลแรกเลย
              </Link>
            </div>
          ) : (
            filteredProfiles.map((p) => {
              const companyName = p.name || p.values?.our_company_name || p.values?.counterparty_name || "ชุดข้อมูลไม่มีชื่อ";
              const counterparty = (
                p.values?.counterparty_name ||
                p.values?.receiving_party_name ||
                p.values?.reseller_name ||
                "-"
              );
              const signatory = (
                p.values?.our_signatory_name ||
                p.values?.disclosing_signatory_name ||
                p.values?.counterparty_signatory_name ||
                p.values?.receiving_signatory_name ||
                "-"
              );

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className="w-full flex items-center justify-between p-5 rounded-2xl border border-gray-200 bg-white hover:border-primary-500 hover:bg-primary-50/40 hover:shadow-card transition-all text-left group shadow-2xs"
                >
                  <div className="flex items-start gap-4 min-w-0 pr-4">
                    <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      <Building2 size={22} />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-base group-hover:text-primary-700 transition-colors truncate">
                          {companyName}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="truncate">
                          คู่สัญญา: <strong className="text-gray-700 font-semibold">{counterparty}</strong>
                        </span>
                        {signatory !== "-" && (
                          <span className="flex items-center gap-1 text-gray-500 truncate">
                            <UserCheck size={13} className="text-gray-400 shrink-0" />
                            {signatory}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 text-gray-700 text-xs font-semibold border border-gray-200 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 shrink-0 transition-all shadow-2xs">
                    <span>เลือกชุดนี้</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Blank Document Choice Card */}
        <div className="pt-2">
          <button
            onClick={() => setSelectedId(null)}
            className="w-full flex items-center justify-between p-5 rounded-2xl border border-dashed border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50/80 transition-all text-left group"
          >
            <div className="flex items-center gap-4 min-w-0 pr-4">
              <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                <FileText size={22} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm group-hover:text-gray-800">
                  เริ่มจากเอกสารเปล่า (ไม่ใช้ข้อมูลที่ตั้งไว้)
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  กรอกข้อมูลสัญญาใหม่ทั้งหมดด้วยตัวเองตั้งแต่ต้น
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs font-semibold group-hover:bg-gray-200 shrink-0 transition-colors shadow-2xs">
              <span>เลือกเอกสารเปล่า</span>
              <ArrowRight size={14} />
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
