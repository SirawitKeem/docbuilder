"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Layers,
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
  Sparkles,
  Check,
} from "lucide-react";
import { EXTENDED_ICON_MAP } from "./CreateCategoryModal";

export const ICON_MAP = {
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
};

export const COLOR_MAP = {
  purple: { bg: "bg-[#F5F1FF]", text: "text-[#5542F6]", border: "border-[#EBE3FF]", ring: "ring-[#5542F6]" },
  blue: { bg: "bg-[#EFF6FF]", text: "text-[#2563EB]", border: "border-[#DBEAFE]", ring: "ring-[#2563EB]" },
  emerald: { bg: "bg-[#ECFDF5]", text: "text-[#059669]", border: "border-[#D1FAE5]", ring: "ring-[#059669]" },
  amber: { bg: "bg-[#FFFBEB]", text: "text-[#D97706]", border: "border-[#FEF3C7]", ring: "ring-[#D97706]" },
  rose: { bg: "bg-[#FFF1F2]", text: "text-[#E11D48]", border: "border-[#FFE4E6]", ring: "ring-[#E11D48]" },
  indigo: { bg: "bg-[#EEF2FF]", text: "text-[#4F46E5]", border: "border-[#E0E7FF]", ring: "ring-[#4F46E5]" },
  cyan: { bg: "bg-[#ECFEFF]", text: "text-[#0891B2]", border: "border-[#CFFAFE]", ring: "ring-[#0891B2]" },
};

export default function CategoryManagerModal({
  isOpen,
  onClose,
  categories = [],
  onCategoriesUpdated,
  onOpenCreateModal,
}) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    description: "",
    icon: "FileText",
    color: "purple",
    badge: "พร้อมใช้งาน",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name || "",
      fullName: cat.fullName || cat.name || "",
      description: cat.description || "",
      icon: cat.icon || "FileText",
      color: cat.color || "purple",
      badge: cat.badge || "พร้อมใช้งาน",
    });
    setErrorMsg("");
  };

  const handleCancelForm = () => {
    setEditingId(null);
    setErrorMsg("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg("กรุณาระบุชื่อหมวดหมู่");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      if (editingId) {
        const res = await fetch(`/api/categories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "แก้ไขหมวดหมู่ไม่สำเร็จ");
      }

      handleCancelForm();
      if (onCategoriesUpdated) onCategoriesUpdated();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cat) => {
    if (["quotation", "nda", "partner", "distributor"].includes(cat.id)) {
      alert("หมวดหมู่พื้นฐานของระบบไม่สามารถลบได้");
      return;
    }

    if (!confirm(`คุณต้องการลบหมวดหมู่ "${cat.name}" หรือไม่?`)) return;

    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/categories/${cat.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ลบหมวดหมู่ไม่สำเร็จ");

      if (editingId === cat.id) handleCancelForm();
      if (onCategoriesUpdated) onCategoriesUpdated();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150 text-left">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F1FF] text-[#5542F6] border border-[#EBE3FF] flex items-center justify-center shadow-2xs">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">จัดการหมวดหมู่เอกสาร</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                ดูรายการ แก้ไขข้อมูล หรือจัดการโฟลเดอร์หมวดหมู่ในระบบ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Edit Form Section */}
          {editingId && (
            <form onSubmit={handleSave} className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                <span className="text-xs font-bold text-[#5542F6] flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>แก้ไขข้อมูลหมวดหมู่</span>
                </span>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">ชื่อประเภทเอกสาร (EN) *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="เช่น Purchase Order"
                    className="w-full h-9 px-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 outline-none focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">ชื่อภาษาไทยเต็ม</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="เช่น ใบสั่งซื้อสินค้า (Purchase Order)"
                    className="w-full h-9 px-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 outline-none focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">คำอธิบาย</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="อธิบายวัตถุประสงค์ของเอกสารหมวดนี้..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 outline-none focus:border-[#5542F6] focus:ring-1 focus:ring-[#5542F6] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-purple-100/80">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-3.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#5542F6] hover:bg-[#4332D6] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                </button>
              </div>
            </form>
          )}

          {/* Header Action Bar */}
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-700">
              รายการประเภทเอกสารทั้งหมด ({categories.length})
            </span>
            <button
              type="button"
              onClick={() => {
                if (onOpenCreateModal) onOpenCreateModal();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5542F6] text-white hover:bg-[#4332D6] text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Plus size={14} />
              <span>เพิ่มประเภทเอกสารใหม่</span>
            </button>
          </div>

          {/* Categories List */}
          <div className="space-y-2.5">
            {categories.map((cat) => {
              const IconData = EXTENDED_ICON_MAP[cat.icon];
              const IconComp = IconData ? IconData.icon : (ICON_MAP[cat.icon] || FileText);
              const colorStyle = COLOR_MAP[cat.color] || COLOR_MAP.purple;
              const isProtected = ["quotation", "nda", "partner", "distributor"].includes(cat.id);

              return (
                <div
                  key={cat.id}
                  className="group flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-white hover:border-purple-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${colorStyle.bg} ${colorStyle.text} border ${colorStyle.border} flex items-center justify-center shrink-0 shadow-2xs`}>
                      <IconComp size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gray-900">{cat.name}</span>
                        {isProtected ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            มาตรฐาน
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#5542F6] border border-purple-100">
                            {cat.badge || "กำหนดเอง"}
                          </span>
                        )}
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {cat.templateCount || 0} รูปแบบ
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{cat.description || "ไม่มีคำอธิบาย"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(cat)}
                      className="p-2 rounded-xl text-gray-400 hover:text-[#5542F6] hover:bg-purple-50 transition-colors cursor-pointer"
                      title="แก้ไขข้อมูลหมวดหมู่"
                    >
                      <Edit2 size={15} />
                    </button>
                    {!isProtected && (
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="ลบหมวดหมู่นี้"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
