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
      <div className="p-8 max-w-4xl mx-auto">
        <div className="h-64 rounded-card bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    return <div className="p-8 text-gray-400 max-w-4xl mx-auto">ไม่พบข้อมูลนี้</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">แก้ไขชุดข้อมูล: {profile.name}</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
