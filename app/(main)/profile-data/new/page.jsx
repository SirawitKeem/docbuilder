import ProfileForm from "@/components/profile/ProfileForm";

export default function NewProfileDataPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">สร้างชุดข้อมูลใหม่</h1>
        <p className="text-xs text-gray-500 mt-1">
          กรอกข้อมูลคู่ค้าหรือรายละเอียดตั้งต้นเพื่อนำไปดึงใช้งานอัตโนมัติ
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
