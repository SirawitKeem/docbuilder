import ProfileForm from "@/components/profile/ProfileForm";

export default function NewProfileDataPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">สร้างชุดข้อมูลใหม่</h1>
      <ProfileForm />
    </div>
  );
}
