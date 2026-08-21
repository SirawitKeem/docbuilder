"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Plus, X, ArrowLeft } from "lucide-react";
import { fieldRegistry, categoryLabels, coreFieldKeys } from "@/lib/profiles/fieldRegistry";
import { getAllTemplateSchemas, getTemplateAllKeys, getRelevantTemplates } from "@/lib/profiles/compatibility";
import { createFieldProfile, updateFieldProfile } from "@/lib/data/fieldProfiles";

function ProfileFormContent({ profile }) {
  const router = useRouter();

  const [name, setName] = useState(profile?.name || "");
  const [values, setValues] = useState(profile?.values || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // เทมเพลตที่เปิดใช้งานฟิลด์ในฟอร์มนี้
  const [activeTemplateIds, setActiveTemplateIds] = useState(() => {
    if (profile?.values) {
      return getRelevantTemplates(profile.values).map((r) => r.templateId);
    }
    return [];
  });

  const allTemplates = getAllTemplateSchemas();
  const availableToAdd = allTemplates.filter((t) => !activeTemplateIds.includes(t.id));

  // field ที่ควรแสดงในฟอร์ม = core + ฟิลด์ของเทมเพลตที่เปิดใช้ + field ที่มีค่าอยู่แล้ว
  const visibleKeys = useMemo(() => {
    const keys = new Set(coreFieldKeys);
    activeTemplateIds.forEach((id) => {
      const templateKeys = getTemplateAllKeys(id);
      templateKeys.forEach((k) => keys.add(k));
    });
    Object.entries(values).forEach(([k, v]) => {
      if (v) keys.add(k);
    });
    return [...keys].filter((k) => fieldRegistry[k]);
  }, [activeTemplateIds, values]);

  const grouped = useMemo(() => {
    const groups = {};
    visibleKeys.forEach((key) => {
      const cat = fieldRegistry[key]?.category || "company";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(key);
    });
    return groups;
  }, [visibleKeys]);

  const handleChange = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("กรุณาตั้งชื่อชุดข้อมูลเพื่อให้จำง่ายตอนเลือกใช้");
      return;
    }
    setSaving(true);
    try {
      if (profile) await updateFieldProfile(profile.id, { name, values });
      else await createFieldProfile({ name, values });
      setSaved(true);
      setTimeout(() => router.push("/profile-data"), 600);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Navigation Back */}
      <div>
        <Link
          href="/profile-data"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs"
        >
          <ArrowLeft size={15} />
          ย้อนกลับไปหน้าชุดข้อมูล
        </Link>
      </div>

      {/* ONE Unified White Container Card wrapping profile name, form fields, and template chips */}
      <div className="bg-white border border-gray-200 rounded-card p-6 shadow-card space-y-6">
        
        {/* 1. Profile Name Input Field */}
        <div className="space-y-1.5 pb-5 border-b border-[#E4E4E8]">
          <label className="block text-sm font-bold text-[#22162B]">ชื่อชุดข้อมูล</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น บริษัท ตัวอย่าง จำกัด, ลูกค้าประจำ A"
            className="w-full h-11 px-3.5 rounded-[10px] border border-[#E4E4E8] text-sm outline-none focus:border-[#7C4DFF] focus:ring-2 focus:ring-[#F5F1FF] font-medium"
          />
          <p className="text-xs text-[#646469]">ใช้เป็นชื่อสำหรับเลือกตอนสร้างเอกสาร ไม่ปรากฏในเอกสารจริง</p>
        </div>

        {/* 2. Dynamic Form Fields grouped by Category inside the same card */}
        {Object.entries(grouped).map(([category, keys]) => (
          <div key={category} className="space-y-4 pt-1">
            <h2 className="text-base font-bold text-[#22162B] pb-2 border-b border-[#E4E4E8]">
              {categoryLabels[category] || category}
            </h2>
            <div className="space-y-4">
              {keys.map((key) => {
                const def = fieldRegistry[key];
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-[#22162B] mb-1.5">{def.label}</label>
                    {def.type === "textarea" ? (
                      <textarea
                        value={values[key] || ""}
                        placeholder={def.placeholder}
                        onChange={(e) => handleChange(key, e.target.value)}
                        rows={2}
                        className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E4E4E8] text-sm outline-none focus:border-[#7C4DFF] focus:ring-2 focus:ring-[#F5F1FF] resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={values[key] || ""}
                        placeholder={def.placeholder}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full h-11 px-3.5 rounded-[10px] border border-[#E4E4E8] text-sm outline-none focus:border-[#7C4DFF] focus:ring-2 focus:ring-[#F5F1FF]"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* 3. Add Template Specific Fields Chips (inside the same white card) */}
        <div className="pt-4 border-t border-dashed border-[#E4E4E8] space-y-3">
          <h2 className="text-sm font-bold text-[#22162B]">เพิ่มข้อมูลเฉพาะสำหรับเทมเพลต</h2>
          
          {/* Active template chips */}
          {activeTemplateIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeTemplateIds.map((id) => {
                const t = allTemplates.find((x) => x.id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5F1FF] text-[#7C4DFF] text-xs font-semibold border border-[#E1D3FF] shadow-2xs"
                  >
                    {t?.name || id}
                    <button
                      type="button"
                      onClick={() => setActiveTemplateIds((prev) => prev.filter((x) => x !== id))}
                      className="hover:text-red-600 ml-0.5"
                      title="ปิดการแสดงฟิลด์นี้"
                    >
                      <X size={13} />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Available to add buttons */}
          {availableToAdd.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {availableToAdd.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTemplateIds((prev) => [...prev, t.id])}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E4E4E8] text-[#646469] text-xs font-semibold hover:border-[#7C4DFF] hover:text-[#7C4DFF] hover:bg-[#F5F1FF]/50 transition-colors shadow-2xs"
                >
                  <Plus size={13} /> {t.name}
                </button>
              ))}
            </div>
          )}

          <p className="text-xs text-[#646469]">
            เลือกเทมเพลตที่ชุดข้อมูลนี้จะนำไปใช้ — ระบบจะโชว์เฉพาะ field ที่เทมเพลตนั้นต้องการเพิ่มมาให้กรอก
          </p>
        </div>

      </div>

      {/* Action Footer Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="h-11 px-7 rounded-[10px] bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white text-sm font-semibold hover:opacity-95 disabled:opacity-60 transition-opacity"
        >
          {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
        <button
          onClick={() => router.push("/profile-data")}
          className="h-11 px-6 rounded-[10px] border border-[#E4E4E8] text-[#22162B] text-sm font-medium hover:bg-[#F6F6FA] transition-colors bg-white"
        >
          ยกเลิก
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-[#17682F] font-bold">
            <CheckCircle2 size={16} className="text-[#239742]" />
            บันทึกแล้ว
          </span>
        )}
      </div>
    </div>
  );
}

export default function ProfileForm(props) {
  return (
    <Suspense fallback={<div className="h-32 flex items-center justify-center text-gray-400">กำลังโหลด...</div>}>
      <ProfileFormContent {...props} />
    </Suspense>
  );
}
