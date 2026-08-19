"use client";

import { useEffect, useState, use } from "react";
import ProfileForm from "@/components/profile/ProfileForm";
import { getFieldProfile } from "@/lib/data/fieldProfiles";

export default function EditProfileDataPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getFieldProfile(id).then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 md:p-8 text-gray-400 max-w-7xl mx-auto">
        ไม่พบชุดข้อมูลนี้ในระบบ
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">แก้ไขชุดข้อมูล: {profile.name}</h1>
        <p className="text-xs text-gray-500 mt-1">
          ปรับแต่งและอัปเดตรายละเอียดของชุดข้อมูลนี้
        </p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
