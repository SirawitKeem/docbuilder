"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Building,
  Building2,
  UserCheck,
  Save,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { profileFieldDefs } from "@/lib/data/profileFields";
import { getFieldProfile, saveFieldProfile } from "@/lib/data/fieldProfile";

const groupIcons = {
  "วันที่ทำสัญญา": Calendar,
  "ข้อมูลบริษัทเรา (ผู้จัดจำหน่ายหลัก / ผู้เปิดเผยข้อมูล)": Building,
  "ข้อมูลคู่สัญญา (Reseller / ผู้รับข้อมูล)": Building2,
  "ผู้ลงนามคู่สัญญา": UserCheck,
};

function groupFields(defs) {
  const groups = {};
  for (const f of defs) {
    if (!groups[f.group]) groups[f.group] = [];
    groups[f.group].push(f);
  }
  return groups;
}

export default function ProfileDataPage() {
  const router = useRouter();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getFieldProfile().then((data) => {
      setValues(data);
      setLoading(false);
    });
  }, []);

  const handleChange = (id, val) => {
    setValues((prev) => ({ ...prev, [id]: val }));
    setSaved(false);
  };

  const handleSave = async () => {
    await saveFieldProfile(values);
    setSaved(true);
  };

  if (loading) {
    return (
      <div className="max-w-5xl space-y-6">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-40 bg-gray-100 rounded-card animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-card animate-pulse" />
      </div>
    );
  }

  const groups = groupFields(profileFieldDefs);

  return (
    <div className="max-w-5xl pb-12">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold mb-3 border border-primary-100">
          <Sparkles size={14} />
          <span>ระบบเติมข้อมูลอัตโนมัติ (Auto Pre-fill)</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1.5">
          ตั้งค่าข้อมูลกลาง
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          บันทึกข้อมูลบริษัทฝ่ายเรา วันที่ทำสัญญา ข้อมูลบริษัทคู่สัญญา และผู้ลงนามไว้ที่นี่ครั้งเดียว
          ระบบจะนำไปเติมในทุกเทมเพลตให้อัตโนมัติเมื่อเริ่มสร้างเอกสารใหม่
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(groups).map(([groupName, fields]) => {
          const Icon = groupIcons[groupName] || Building2;
          const isDateGroup = groupName === "วันที่ทำสัญญา";
          const isTwoCol = fields.length === 2 || fields.length === 3;

          return (
            <section
              key={groupName}
              className="bg-white border border-gray-200 rounded-card p-6 shadow-card transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">{groupName}</h2>
                </div>
              </div>

              <div
                className={
                  isDateGroup
                    ? "grid grid-cols-1 sm:grid-cols-3 gap-4"
                    : isTwoCol
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                    : "space-y-4"
                }
              >
                {fields.map((f) => (
                  <div key={f.id} className={f.type === "textarea" ? "col-span-full" : ""}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {f.label}
                    </label>
                    {f.type === "select" ? (
                      <select
                        value={values[f.id] || ""}
                        onChange={(e) => handleChange(f.id, e.target.value)}
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white text-gray-900 font-medium transition-all"
                      >
                        <option value="">-- {f.placeholder} --</option>
                        {f.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : f.type === "textarea" ? (
                      <textarea
                        value={values[f.id] || ""}
                        placeholder={f.placeholder}
                        onChange={(e) => handleChange(f.id, e.target.value)}
                        rows={3}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none transition-all"
                      />
                    ) : (
                      <input
                        type="text"
                        value={values[f.id] || ""}
                        placeholder={f.placeholder}
                        onChange={(e) => handleChange(f.id, e.target.value)}
                        className="w-full h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-4 rounded-card bg-gray-50 border border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-colors shadow-sm"
          >
            <Save size={18} />
            <span>บันทึกข้อมูล</span>
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm text-success-600 font-semibold bg-success-100 px-3 py-1.5 rounded-md">
              <CheckCircle2 size={16} />
              บันทึกสำเร็จแล้ว
            </span>
          )}
        </div>

        <button
          onClick={() => router.push("/create")}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors shadow-xs"
        >
          <span>ไปเลือกเทมเพลต</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
