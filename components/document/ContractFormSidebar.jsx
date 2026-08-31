"use client";

import React from "react";
import {
  Calendar,
  Building2,
  UserCheck,
  Sparkles,
  CheckCircle2,
  FileSignature,
} from "lucide-react";
import { useDocumentFields } from "@/context/DocumentFieldsContext";

export default function ContractFormSidebar({ template, isOpen }) {
  const { values, setField } = useDocumentFields();

  if (!isOpen) return null;

  const handleFillTodayDate = () => {
    const now = new Date();
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    setField("contract_date_day", String(now.getDate()));
    setField("contract_date_month", thaiMonths[now.getMonth()]);
    setField("contract_date_year", String(now.getFullYear() + 543));
    if (!values.contract_location) {
      setField("contract_location", "กรุงเทพมหานคร");
    }
  };

  const fields = template?.fields || [];
  const requiredFields = fields.filter((f) => f.required);
  const filledRequiredCount = requiredFields.filter((f) => values[f.id]?.trim()).length;
  const isComplete = requiredFields.length > 0 && filledRequiredCount === requiredFields.length;

  return (
    <div className="w-[360px] xl:w-[400px] bg-white border-r border-[#E4E4E8] flex flex-col h-full shrink-0 shadow-sm z-20 select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#E4E4E8] bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F5F1FF] text-[#5542F6] flex items-center justify-center">
              <FileSignature size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 leading-none">กรอกข้อมูลสัญญา</h2>
              <span className="text-[11px] text-gray-500">{template?.name || "สัญญา NDA"}</span>
            </div>
          </div>

          <button
            onClick={handleFillTodayDate}
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F0EBFF] hover:bg-[#E5DCFF] text-[#5542F6] text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
            title="ใส่วันที่ปัจจุบันอัตโนมัติ"
          >
            <Sparkles size={12} />
            <span>ใส่วันที่วันนี้</span>
          </button>
        </div>

        {/* Completion Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-500 font-medium">ความสมบูรณ์ของฟิลด์</span>
            <span className={`font-bold ${isComplete ? "text-emerald-600" : "text-[#5542F6]"}`}>
              {filledRequiredCount} / {requiredFields.length} ฟิลด์
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isComplete ? "bg-emerald-500" : "bg-gradient-to-r from-[#5542F6] to-[#7C4DFF]"
              }`}
              style={{
                width: `${requiredFields.length > 0 ? (filledRequiredCount / requiredFields.length) * 100 : 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Form Fields Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin text-left">
        
        {/* Section 1: ข้อมูลสัญญา & วันที่ */}
        <div className="space-y-3 p-3.5 rounded-xl border border-gray-100 bg-[#FAFAFC]">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <Calendar size={15} className="text-[#5542F6]" />
            <span>1. วันที่และสถานที่ทำสัญญา</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-600">สถานที่ทำสัญญา</label>
            <input
              type="text"
              value={values.contract_location || ""}
              onChange={(e) => setField("contract_location", e.target.value)}
              placeholder="เช่น กรุงเทพมหานคร"
              className="w-full h-9 px-3 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600">วัน</label>
              <input
                type="text"
                value={values.contract_date_day || ""}
                onChange={(e) => setField("contract_date_day", e.target.value)}
                placeholder="17"
                className="w-full h-9 px-2.5 text-xs text-center rounded-lg border border-gray-200 bg-white focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600">เดือน</label>
              <input
                type="text"
                value={values.contract_date_month || ""}
                onChange={(e) => setField("contract_date_month", e.target.value)}
                placeholder="สิงหาคม"
                className="w-full h-9 px-2.5 text-xs text-center rounded-lg border border-gray-200 bg-white focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600">ปี พ.ศ.</label>
              <input
                type="text"
                value={values.contract_date_year || ""}
                onChange={(e) => setField("contract_date_year", e.target.value)}
                placeholder="2569"
                className="w-full h-9 px-2.5 text-xs text-center rounded-lg border border-gray-200 bg-white focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: ข้อมูลคู่สัญญา (ผู้รับข้อมูล) */}
        <div className="space-y-3 p-3.5 rounded-xl border border-gray-100 bg-[#FAFAFC]">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <Building2 size={15} className="text-[#5542F6]" />
            <span>2. ข้อมูลคู่สัญญา (ผู้รับข้อมูล)</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-600">
              ชื่อบริษัท / นิติบุคคล <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={values.receiving_party_name || values.counterparty_name || ""}
              onChange={(e) => {
                setField("receiving_party_name", e.target.value);
                setField("counterparty_name", e.target.value);
              }}
              placeholder="บริษัท คู่สัญญา จำกัด"
              className="w-full h-9 px-3 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-600">
              ที่อยู่สำนักงานใหญ่ <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={values.receiving_party_address || values.counterparty_address || ""}
              onChange={(e) => {
                setField("receiving_party_address", e.target.value);
                setField("counterparty_address", e.target.value);
              }}
              placeholder="เลขที่ ... ถนน ... แขวง/ตำบล ... เขต/อำเภอ ... จังหวัด ... รหัสไปรษณีย์ ..."
              className="w-full p-2.5 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] outline-none transition-all resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Section 3: ข้อมูลผู้ลงนาม */}
        <div className="space-y-3 p-3.5 rounded-xl border border-gray-100 bg-[#FAFAFC]">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <UserCheck size={15} className="text-[#5542F6]" />
            <span>3. ผู้ลงนาม (คู่สัญญา)</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-600">
              ชื่อ-นามสกุล ผู้มีอำนาจลงนาม <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={values.receiving_signatory_name || values.counterparty_signatory_name || ""}
              onChange={(e) => {
                setField("receiving_signatory_name", e.target.value);
                setField("counterparty_signatory_name", e.target.value);
              }}
              placeholder="เช่น นายสมชาย ตัวอย่าง"
              className="w-full h-9 px-3 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-600">
              ตำแหน่ง <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={values.receiving_signatory_position || values.counterparty_signatory_position || ""}
              onChange={(e) => {
                setField("receiving_signatory_position", e.target.value);
                setField("counterparty_signatory_position", e.target.value);
              }}
              placeholder="เช่น กรรมการผู้จัดการ"
              className="w-full h-9 px-3 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] outline-none transition-all"
            />
          </div>
        </div>

        {/* Section 4: ข้อมูลฝ่ายเรา (ผู้เปิดเผยข้อมูล - เครสท์ เซนโด) */}
        <div className="p-3 rounded-xl border border-purple-100 bg-[#FBF9FF] text-xs text-gray-600 space-y-1.5">
          <p className="font-bold text-[#5542F6] flex items-center gap-1.5">
            <CheckCircle2 size={14} /> ฝ่ายผู้เปิดเผยข้อมูล (ฝ่ายเรา):
          </p>
          <p className="text-[11px] leading-relaxed text-gray-600">
            <strong>บริษัท เครสท์ เซนโด จำกัด</strong>
            <br />
            ผู้ลงนาม: นายศรายุทธ โกสิยารักษ์ (CEO/Founder)
          </p>
        </div>

      </div>
    </div>
  );
}
