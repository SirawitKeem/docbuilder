"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  FolderPlus,
  FileSignature,
  Megaphone,
  Users,
  ClipboardList,
  Receipt,
  Building2,
  Handshake,
  FileText,
  Shield,
  Briefcase,
  GraduationCap,
  Award,
  Package,
  Bookmark,
  CreditCard,
  Folder,
  Sparkles,
  FolderOpen,
  ChevronRight,
} from "lucide-react";

export const EXTENDED_ICON_MAP = {
  FileText: { icon: FileText, label: "เอกสารทั่วไป" },
  Receipt: { icon: Receipt, label: "ใบเสนอราคา/การเงิน" },
  FileSignature: { icon: FileSignature, label: "สัญญา/ข้อตกลง" },
  Handshake: { icon: Handshake, label: "พันธมิตร" },
  Building2: { icon: Building2, label: "ตัวแทนจำหน่าย/องค์กร" },
  Shield: { icon: Shield, label: "ความปลอดภัย/NDA" },
  Briefcase: { icon: Briefcase, label: "งานธุรกิจ/HR" },
  ClipboardList: { icon: ClipboardList, label: "แบบฟอร์ม/คำร้อง" },
  Award: { icon: Award, label: "ใบรับรอง/Certificate" },
  CreditCard: { icon: CreditCard, label: "ใบแจ้งหนี้/การชำระเงิน" },
  Package: { icon: Package, label: "จัดซื้อ/สต็อกสินค้า" },
  Bookmark: { icon: Bookmark, label: "บันทึก/ระเบียบ" },
  Megaphone: { icon: Megaphone, label: "ประกาศองค์กร" },
  Users: { icon: Users, label: "บุคลากร/ทีมงาน" },
  GraduationCap: { icon: GraduationCap, label: "การฝึกอบรม/ศึกษา" },
  Folder: { icon: Folder, label: "โฟลเดอร์แฟ้มงาน" },
};

const COLOR_OPTIONS = [
  { id: "purple", name: "ม่วง (Purple)", hex: "#5542F6", bg: "bg-[#F5F1FF]", text: "text-[#5542F6]", border: "border-[#EBE3FF]" },
  { id: "blue", name: "น้ำเงิน (Blue)", hex: "#2563EB", bg: "bg-[#EFF6FF]", text: "text-[#2563EB]", border: "border-[#DBEAFE]" },
  { id: "emerald", name: "เขียว (Emerald)", hex: "#059669", bg: "bg-[#ECFDF5]", text: "text-[#059669]", border: "border-[#D1FAE5]" },
  { id: "amber", name: "ส้ม/ทอง (Amber)", hex: "#D97706", bg: "bg-[#FFFBEB]", text: "text-[#D97706]", border: "border-[#FEF3C7]" },
  { id: "rose", name: "ชมพู/แดง (Rose)", hex: "#E11D48", bg: "bg-[#FFF1F2]", text: "text-[#E11D48]", border: "border-[#FFE4E6]" },
  { id: "indigo", name: "คราม (Indigo)", hex: "#4F46E5", bg: "bg-[#EEF2FF]", text: "text-[#4F46E5]", border: "border-[#E0E7FF]" },
  { id: "cyan", name: "ฟ้า (Cyan)", hex: "#0891B2", bg: "bg-[#ECFEFF]", text: "text-[#0891B2]", border: "border-[#CFFAFE]" },
];

export default function CreateCategoryModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    description: "",
    icon: "FileText",
    color: "purple",
    badge: "หมวดใหม่",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const SelectedIconData = EXTENDED_ICON_MAP[formData.icon] || EXTENDED_ICON_MAP.FileText;
  const SelectedIconComp = SelectedIconData.icon;
  const selectedColorStyle = COLOR_OPTIONS.find((c) => c.id === formData.color) || COLOR_OPTIONS[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg("กรุณาระบุชื่อประเภทเอกสาร (ภาษาอังกฤษ)");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          fullName: formData.fullName.trim() || formData.name.trim(),
          description: formData.description.trim() || `คลังรวบรวมเทมเพลตสำหรับ ${formData.name.trim()}`,
          icon: formData.icon,
          color: formData.color,
          badge: formData.badge || "หมวดใหม่",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "เกิดข้อผิดพลาดในการสร้างหมวดหมู่");
      }

      if (onCreated) {
        await onCreated();
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 via-white to-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F1FF] text-[#5542F6] border border-[#EBE3FF] flex items-center justify-center shadow-2xs">
              <FolderPlus size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                เพิ่มประเภทเอกสารใหม่
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                สร้างโฟลเดอร์หมวดหมู่สำหรับจัดเก็บและรวบรวมเทมเพลตเอกสารประเภทใหม่
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Input Form (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Category English / Main Name */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  ชื่อประเภทเอกสาร (ภาษาอังกฤษ / ชื่อหลัก) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="เช่น Purchase Order, Invoice, MOU, Certificate..."
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-900 outline-none focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] transition-all"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  ใช้แสดงเป็นหัวข้อหลักของการ์ดโฟลเดอร์ในคลังเทมเพลต
                </p>
              </div>

              {/* Category Full Thai Name */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  ชื่อภาษาไทยเต็ม (Thai Full Name)
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="เช่น ใบสั่งซื้อสินค้า (Purchase Order), ใบแจ้งหนี้..."
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 outline-none focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  คำอธิบายวัตถุประสงค์และการใช้งาน (Description)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="อธิบายการใช้งาน เช่น เอกสารสำหรับสั่งซื้อสินค้าและบริการ พร้อมระบบเงื่อนไขการส่งมอบ..."
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 outline-none focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] transition-all resize-none"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  เลือกไอคอนประจำประเภทเอกสาร
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {Object.entries(EXTENDED_ICON_MAP).map(([key, item]) => {
                    const Icon = item.icon;
                    const isSelected = formData.icon === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: key })}
                        className={`h-11 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#5542F6] text-white shadow-xs scale-105"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200/80"
                        }`}
                        title={item.label}
                      >
                        <Icon size={18} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Theme Presets */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  ธีมสีประจำประเภท
                </label>
                <div className="flex items-center flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => {
                    const isSelected = formData.color === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: c.id })}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? `${c.bg} ${c.text} ${c.border} ring-2 ring-offset-1 ring-[#5542F6] shadow-2xs`
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Real-time Live Card Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#5542F6]" />
                  <span>ตัวอย่างการ์ดในคลังเทมเพลต (Live Preview)</span>
                </span>
              </div>

              {/* Preview Card */}
              <div className="bg-white rounded-2xl border-2 border-dashed border-[#5542F6]/40 p-6 shadow-sm flex flex-col justify-between group text-left relative overflow-hidden bg-gradient-to-b from-purple-50/20 to-white">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${selectedColorStyle.bg} ${selectedColorStyle.text} ${selectedColorStyle.border} border flex items-center justify-center shadow-2xs`}
                    >
                      <SelectedIconComp size={22} />
                    </div>

                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-50 text-[#5542F6] border border-purple-100/80">
                      0 รูปแบบเทมเพลต
                    </span>
                  </div>

                  <h3 className="text-base font-black text-gray-900 leading-snug">
                    {formData.name || "ชื่อประเภทเอกสารใหม่"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {formData.description || "คลังรวบรวมเทมเพลตสำหรับเอกสารประเภทนี้"}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#5542F6]">
                  <span className="flex items-center gap-1.5">
                    <FolderOpen size={15} />
                    <span>เปิดดูคลังเทมเพลต</span>
                  </span>
                  <ChevronRight size={16} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 text-[11px] text-gray-500 leading-relaxed">
                💡 <strong>คำแนะนำ:</strong> เมื่อสร้างประเภทเอกสารใหม่แล้ว ระบบจะสร้างโฟลเดอร์หมวดหมู่ในคลังเทมเพลตให้ทันที จากนั้นคุณสามารถกดเข้าไปเพื่อสร้างเทมเพลตใหม่แบบกระดาษเปล่า A4 ในหมวดหมู่นี้ได้ทันที
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5542F6] hover:bg-[#4332D6] disabled:opacity-50 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังสร้างประเภทเอกสาร...</span>
                </>
              ) : (
                <>
                  <Plus size={15} />
                  <span>สร้างประเภทเอกสารใหม่</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
