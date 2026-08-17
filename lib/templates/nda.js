export const ndaTemplate = {
  id: "nda",
  name: "NDA",
  fullName: "หนังสือสัญญาไม่เปิดเผยข้อมูล (Non-Disclosure Agreement)",
  logo: "/templates/nda/logo.png",
  pageCount: 4,

  // ข้อมูลฝ่ายผู้เปิดเผยข้อมูล — คงที่ ไม่ให้แก้ไข
  disclosingParty: {
    name: "บริษัท เครสท์ เซนโด จำกัด",
    address:
      "สำนักงานใหญ่ ตั้งอยู่เลขที่ 8/40 เดอะ คอนเนค 37 ซอยช่างอากาศอุทิศ 10 แยก 1-2 แขวงดอนเมือง เขตดอนเมือง กรุงเทพมหานคร 10210 ประเทศไทย",
    signatoryName: "นายศรายุทธ โกสิยารักษ์",
    signatoryPosition: "CEO/Founder",
  },

  fields: [
    {
      id: "contract_date_day",
      label: "วัน",
      type: "text",
      page: 1,
      placeholder: "17",
      required: true,
    },
    {
      id: "contract_date_month",
      label: "เดือน",
      type: "text",
      page: 1,
      placeholder: "สิงหาคม",
      required: true,
    },
    {
      id: "contract_date_year",
      label: "ปี พ.ศ.",
      type: "text",
      page: 1,
      placeholder: "2569",
      required: true,
    },
    {
      id: "receiving_party_name",
      label: "ชื่อบริษัท/นิติบุคคล (ผู้รับข้อมูล)",
      type: "text",
      page: 1,
      placeholder: "บริษัท ตัวอย่าง จำกัด",
      required: true,
    },
    {
      id: "receiving_party_address",
      label: "ที่อยู่สำนักงาน (ผู้รับข้อมูล)",
      type: "textarea",
      page: 1,
      placeholder: "เลขที่ ... แขวง/ตำบล ... เขต/อำเภอ ... จังหวัด ... รหัสไปรษณีย์ ...",
      required: true,
    },
    {
      id: "receiving_signatory_name",
      label: "ชื่อผู้ลงนาม (ผู้รับข้อมูล)",
      type: "text",
      page: 4,
      placeholder: "ชื่อ-นามสกุล",
      required: true,
    },
    {
      id: "receiving_signatory_position",
      label: "ตำแหน่ง",
      type: "text",
      page: 4,
      placeholder: "เช่น กรรมการผู้จัดการ",
      required: true,
    },
  ],
};

// helper: เช็คว่ากรอกครบหรือยัง — ใช้กับ Completion Status (Design System ข้อ 17)
export function getCompletionStatus(values) {
  const requiredFields = ndaTemplate.fields.filter((f) => f.required);
  const filled = requiredFields.filter((f) => values[f.id]?.trim());
  return {
    total: requiredFields.length,
    filled: filled.length,
    isComplete: filled.length === requiredFields.length,
  };
}