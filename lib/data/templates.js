export const CATEGORIES = [
  {
    id: "quotation",
    name: "Quotation",
    fullName: "ใบเสนอราคา",
    description: "ใบเสนอราคาพร้อมรายการสินค้า/บริการ คำนวณภาษี VAT 7% และยอดรวมอัตโนมัติ",
    color: "gray",
    href: "/create/quotation",
    available: true,
  },
  {
    id: "nda",
    name: "NDA",
    fullName: "หนังสือสัญญาไม่เปิดเผยข้อมูล",
    description: "Non-Disclosure Agreement สัญญามาตรฐานสำหรับการรักษาความลับทางการค้า",
    color: "primary",
    href: "/create/nda",
    available: true,
  },
  {
    id: "partner",
    name: "Partner Agreement",
    fullName: "สัญญาแต่งตั้งพันธมิตรตัวแทนจำหน่าย",
    description: "สัญญาแต่งตั้งพันธมิตร พร้อมเงื่อนไข Deal Registration และอัตราแลกเปลี่ยน",
    color: "purple",
    href: "/create/partner",
    available: true,
  },
  {
    id: "distributor",
    name: "Distributor Agreement",
    fullName: "สัญญาแต่งตั้งและจัดจำหน่ายซอฟต์แวร์",
    description: "สัญญาแต่งตั้งตัวแทนจำหน่ายและจัดจำหน่ายซอฟต์แวร์",
    color: "success",
    href: "/create/distributor",
    available: true,
  },
  {
    id: "service-agreement",
    name: "Service Agreement",
    fullName: "สัญญาจ้างบริการและขอบเขตการทำงาน",
    description: "ข้อตกลงการให้บริการและขอบเขตการทำงาน (Scope of Work)",
    color: "amber",
    href: "/create/service-agreement",
    available: false,
    badge: "เร็วๆ นี้",
  },
  {
    id: "receipt",
    name: "Receipt",
    fullName: "ใบเสร็จรับเงิน / หลักฐานการชำระเงิน",
    description: "เอกสารสำคัญสำหรับการรับชำระเงินและออกหลักฐานให้แก่ลูกค้า",
    color: "warning",
    href: "/create/receipt",
    available: false,
    badge: "เร็วๆ นี้",
  },
];

export const SUB_TEMPLATES = {
  quotation: [
    {
      id: "quotation-standard",
      categoryId: "quotation",
      name: "ใบเสนอราคามาตรฐาน",
      englishName: "CREST ZENDO Quotation",
      tag: "มาตรฐาน",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "เทมเพลตใบเสนอราคามาตรฐานของ CREST ZENDO พร้อมระบบคำนวณ VAT 7% และส่วนลดอัตโนมัติ",
      pageCount: "ไดนามิก (ตามรายการสินค้า)",
      features: [
        "คำนวณ VAT 7% และส่วนลดอัตโนมัติ",
        "รองรับการเพิ่ม/ลบรายการและหมวดหมู่ย่อย",
        "สร้างเลข Quotation No. อัตโนมัติ",
        "ส่งออกเป็น PDF และส่งอีเมลได้ทันที",
      ],
    },
  ],

  nda: [
    {
      id: "nda-standard",
      categoryId: "nda",
      name: "หนังสือสัญญาไม่เปิดเผยข้อมูล",
      englishName: "Non-Disclosure Agreement (NDA)",
      tag: "มาตรฐาน",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "หนังสือสัญญาไม่เปิดเผยข้อมูลมาตรฐานสำหรับการรักษาความลับทางการค้าและทรัพย์สินทางปัญญา",
      pageCount: "4 หน้า",
      features: [
        "คุ้มครองข้อมูลความลับทางการค้าและเทคโนโลยี",
        "ข้อกำหนดการรักษาความลับและการลงนามทั้งสองฝ่าย",
        "ส่งออกเป็น PDF พร้อมใช้งาน",
      ],
    },
  ],

  partner: [
    {
      id: "partner-standard",
      categoryId: "partner",
      name: "สัญญาแต่งตั้งพันธมิตรตัวแทนจำหน่าย",
      englishName: "Partner Agreement",
      tag: "มาตรฐาน",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "สัญญาแต่งตั้งพันธมิตรตัวแทนจำหน่าย พร้อมเงื่อนไข Deal Registration และอัตราแลกเปลี่ยน",
      pageCount: "5 หน้า",
      features: [
        "เงื่อนไข Deal Registration ปกป้องโอกาสทางการขาย",
        "อัตราส่วนลดมาตรฐานของตัวแทนและเงื่อนไขความร่วมมือ",
        "ส่งออกเป็น PDF พร้อมใช้งาน",
      ],
    },
  ],

  distributor: [
    {
      id: "distributor-standard",
      categoryId: "distributor",
      name: "สัญญาแต่งตั้งและจัดจำหน่ายซอฟต์แวร์",
      englishName: "Distributor Agreement",
      tag: "มาตรฐาน",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "สัญญาแต่งตั้งตัวแทนจำหน่ายและจัดจำหน่ายซอฟต์แวร์",
      pageCount: "5 หน้า",
      features: [
        "สิทธิการจัดจำหน่ายในอาณาเขตที่กำหนด",
        "ข้อกำหนดการสั่งซื้อและการชำระเงิน",
        "ส่งออกเป็น PDF พร้อมใช้งาน",
      ],
    },
  ],
};

export async function getTemplates() {
  return CATEGORIES;
}

export function getTemplatesByCategory(categoryId) {
  if (!categoryId) return [];
  const normalized = categoryId.toLowerCase();
  return SUB_TEMPLATES[normalized] || [];
}

export function getSubTemplateById(subTemplateId) {
  if (!subTemplateId) return null;
  for (const list of Object.values(SUB_TEMPLATES)) {
    const found = list.find((t) => t.id === subTemplateId);
    if (found) return found;
  }
  return null;
}