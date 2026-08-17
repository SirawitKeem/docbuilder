import React from "react";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import { currentUser } from "@/lib/mock-data/user";

export default function Home() {
  // Mock data for dashboard
  const stats = [
    { name: "เอกสารทั้งหมด", value: "148", change: "+12% เดือนนี้", icon: FileText, color: "text-primary-500", bg: "bg-primary-50" },
    { name: "เสร็จสมบูรณ์", value: "132", change: "92% ของทั้งหมด", icon: CheckCircle2, color: "text-success-600", bg: "bg-success-100/50" },
    { name: "รอการลงนาม/อนุมัติ", value: "12", change: "ต้องดำเนินการด่วน 3 รายการ", icon: Clock, color: "text-warning-600", bg: "bg-warning-100/50" },
    { name: "ฉบับร่าง", value: "4", change: "บันทึกล่าสุดวานนี้", icon: AlertTriangle, color: "text-gray-500", bg: "bg-gray-100" }
  ];

  const recentDocuments = [
    { id: "DOC-2026-001", title: "สัญญาจ้างบริการซอฟต์แวร์", template: "สัญญาบริการ (Service Agreement)", date: "17 ส.ค. 2026", status: "เสร็จสมบูรณ์", statusColor: "bg-success-100 text-success-600" },
    { id: "DOC-2026-002", title: "ใบเสนอราคา - โครงการปรับปรุงระบบไอที", template: "ใบเสนอราคา (Quotation)", date: "16 ส.ค. 2026", status: "รออนุมัติ", statusColor: "bg-warning-100 text-warning-600" },
    { id: "DOC-2026-003", title: "สัญญาบันทึกข้อตกลงไม่เปิดเผยข้อมูล (NDA)", template: "NDA Template", date: "15 ส.ค. 2026", status: "เสร็จสมบูรณ์", statusColor: "bg-success-100 text-success-600" },
    { id: "DOC-2026-004", title: "ใบเสร็จรับเงินมัดจำค่าบริการ", template: "ใบเสร็จรับเงิน (Receipt)", date: "14 ส.ค. 2026", status: "ฉบับร่าง", statusColor: "bg-gray-100 text-gray-500" }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <HeroSection userName={currentUser.name} />

      {/* Stats Grid */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name} 
              className="bg-white rounded-card shadow-card border border-gray-100 p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-gray-500">{stat.name}</span>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon size={20} className={`${stat.color} stroke-[2]`} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</span>
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <TrendingUp size={12} className="text-primary-500" />
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Recent Documents */}
        <div className="bg-white rounded-card shadow-card border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">เอกสารล่าสุด</h2>
              <p className="text-xs text-gray-500 mt-0.5">รายการเอกสารที่สร้างหรือทำรายการล่าสุดในระบบ</p>
            </div>
            <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors">
              <span>ดูทั้งหมด</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ชื่อเอกสาร</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">เทมเพลต</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">แก้ไขล่าสุด</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentDocuments.map((doc) => (
                  <tr key={doc.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 pr-3">
                      <div className="font-semibold text-sm text-gray-900 group-hover:text-primary-600 transition-colors truncate max-w-[200px] sm:max-w-xs">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 font-medium">{doc.id}</div>
                    </td>
                    <td className="py-3.5 px-3 text-sm text-gray-500 hidden sm:table-cell">
                      {doc.template}
                    </td>
                    <td className="py-3.5 px-3 text-sm text-gray-500">
                      {doc.date}
                    </td>
                    <td className="py-3.5 pl-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${doc.statusColor}`}>
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Shortcut Card / Quick Guides */}
        <div className="space-y-6">
          <div className="bg-white rounded-card shadow-card border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">เริ่มต้นด่วน</h2>
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-lg border border-gray-100 hover:border-primary-100 hover:bg-primary-50/30 transition-all cursor-pointer group">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  สร้างจากสัญญามาตรฐาน
                </h3>
                <p className="text-xs text-gray-500 mt-1">ใช้เทมเพลตมาตรฐานที่ผ่านการตรวจสอบโดยนักกฎหมาย</p>
              </div>
              <div className="p-3.5 rounded-lg border border-gray-100 hover:border-primary-100 hover:bg-primary-50/30 transition-all cursor-pointer group">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  จัดการคลังเทมเพลต
                </h3>
                <p className="text-xs text-gray-500 mt-1">ออกแบบโครงสร้างฟอร์มเพื่อใช้ซ้ำภายในทีมงาน</p>
              </div>
              <div className="p-3.5 rounded-lg border border-gray-100 hover:border-primary-100 hover:bg-primary-50/30 transition-all cursor-pointer group">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  ตั้งค่าความปลอดภัยเอกสาร
                </h3>
                <p className="text-xs text-gray-500 mt-1">กําหนดสิทธิ์การเข้าถึงและการลงลายมือชื่อดิจิทัล</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
