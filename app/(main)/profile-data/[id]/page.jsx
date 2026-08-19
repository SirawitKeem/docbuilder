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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">แก้ไขชุดข้อมูล</h1>
        <div className="h-64 rounded-card bg-gray-100 animate-pulse mt-6" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-gray-400">ไม่พบชุดข้อมูลนี้ในระบบ</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">แก้ไขชุดข้อมูล: {profile.name}</h1>
        <p className="text-sm text-gray-500">
          ปรับแต่งและอัปเดตรายละเอียดของชุดข้อมูลนี้
        </p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
