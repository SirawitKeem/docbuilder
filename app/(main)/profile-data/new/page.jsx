import ProfileForm from "@/components/profile/ProfileForm";

export default function NewProfileDataPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">สร้างชุดข้อมูลใหม่</h1>
        <p className="text-sm text-gray-500">
          กรอกข้อมูลคู่ค้าหรือรายละเอียดตั้งต้นเพื่อนำไปดึงใช้งานอัตโนมัติ
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
