export const distributorTemplate = {
  id: "distributor",
  name: "Distributor Agreement",
  fullName: "สัญญาแต่งตั้งและจัดจำหน่ายซอฟต์แวร์ (Distributor Agreement)",
  logo: "/preview.webp",
  pageCount: 3,

  fields: [
    { id: "dist_date_day", label: "วัน", type: "text", page: 1, placeholder: "18", required: true },
    { id: "dist_date_month", label: "เดือน", type: "text", page: 1, placeholder: "สิงหาคม", required: true },
    { id: "dist_date_year", label: "ปี พ.ศ.", type: "text", page: 1, placeholder: "2569", required: true },
    { id: "distributor_name", label: "ชื่อบริษัทตัวแทนจำหน่าย", type: "text", page: 1, placeholder: "บริษัท ตัวแทนจำหน่าย จำกัด", required: true },
    { id: "distributor_address", label: "ที่อยู่ตัวแทนจำหน่าย", type: "textarea", page: 1, placeholder: "เลขที่ ... แขวง/ตำบล ...", required: true },
    { id: "distributor_signatory_name", label: "ชื่อผู้ลงนาม (ตัวแทนจำหน่าย)", type: "text", page: 3, placeholder: "ชื่อ-นามสกุล", required: true },
    { id: "distributor_signatory_position", label: "ตำแหน่ง (ตัวแทนจำหน่าย)", type: "text", page: 3, placeholder: "กรรมการผู้จัดการ", required: true },
  ],
};
