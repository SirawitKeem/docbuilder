"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileX } from "lucide-react";
import { listFieldProfiles } from "@/lib/data/fieldProfiles";
import DocumentEditor from "./DocumentEditor";

export default function ProfileSelectGate({ templateId }) {
  const [profiles, setProfiles] = useState(null);
  const [selectedId, setSelectedId] = useState(undefined); // undefined = ยังไม่เลือก

  useEffect(() => {
    listFieldProfiles().then(setProfiles);
  }, []);

  // เลือกแล้ว (รวมถึงเลือก "เอกสารเปล่า" ที่ selectedId = null) → เข้าตัว editor จริง
  if (selectedId !== undefined) {
    return <DocumentEditor templateId={templateId} profileId={selectedId} />;
  }

  if (profiles === null) {
    return <div className="h-screen flex items-center justify-center text-gray-400 text-sm">กำลังโหลด...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 p-8 shadow-card">
        <h1 className="text-xl font-bold text-gray-900 mb-1">เลือกข้อมูลที่จะใช้</h1>
        <p className="text-sm text-gray-500 mb-6">
          เลือกชุดข้อมูลที่ตั้งค่าไว้ เพื่อเติมให้อัตโนมัติในเอกสารนี้
        </p>

        {profiles.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl text-sm text-gray-400 mb-6 bg-gray-50/50">
            ยังไม่มีชุดข้อมูลที่ตั้งค่าไว้ —{" "}
            <Link href="/profile-data/new" className="text-primary-600 font-semibold hover:underline">
              สร้างข้อมูลใหม่
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5 mb-6">
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-gray-200 bg-white hover:border-primary-400 hover:bg-primary-50/70 transition-all text-left group shadow-2xs"
              >
                <div className="min-w-0 pr-3">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{p.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {p.values?.counterparty_name || p.values?.receiving_party_name || "ยังไม่ได้กรอกชื่อคู่สัญญา"}
                  </p>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-primary-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setSelectedId(null)}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          <FileX size={16} />
          เริ่มจากเอกสารเปล่า (ไม่ใช้ข้อมูลที่ตั้งไว้)
        </button>
      </div>
    </div>
  );
}
