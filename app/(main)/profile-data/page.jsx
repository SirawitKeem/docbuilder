"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { listFieldProfiles, deleteFieldProfile } from "@/lib/data/fieldProfiles";

export default function ProfileDataListPage() {
  const [profiles, setProfiles] = useState(null);

  const load = () => listFieldProfiles().then(setProfiles);

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`ลบข้อมูล "${name}" ใช่ไหม?`)) return;
    await deleteFieldProfile(id);
    load();
  };

  if (profiles === null) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="h-64 rounded-card bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-900">ตั้งค่าข้อมูล</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        สร้างชุดข้อมูลที่ใช้บ่อยไว้หลายชุด (เช่น แยกตามคู่ค้าแต่ละราย) ตอนสร้างเอกสารจะเลือกได้ว่าจะดึงชุดไหนมาเติมให้อัตโนมัติ
      </p>

      <Link
        href="/profile-data/new"
        className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 mb-6 transition-colors shadow-2xs"
      >
        <Plus size={16} />
        สร้างข้อมูลใหม่
      </Link>

      {profiles.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-card text-gray-400 text-sm bg-white">
          ยังไม่มีชุดข้อมูล — เริ่มสร้างชุดแรกได้เลย
        </div>
      ) : (
        <div className="space-y-3">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-5 py-4 rounded-card border border-gray-200 bg-white hover:border-gray-300 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                  <User size={18} className="text-primary-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    คู่สัญญา: {p.values?.counterparty_name || p.values?.receiving_party_name || "ยังไม่ได้กรอกชื่อคู่สัญญา"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  href={`/profile-data/${p.id}`}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                  title="แก้ไขชุดข้อมูล"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                  title="ลบชุดข้อมูล"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
