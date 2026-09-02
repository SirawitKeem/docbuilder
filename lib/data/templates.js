export const CATEGORIES = [
  {
    id: "quotation",
    name: "Quotation",
    fullName: "ใบเสนอราคา",
    description: "ใบเสนอราคาพร้อมรายการสินค้า/บริการ คำนวณภาษี VAT 7% และยอดรวมอัตโนมัติ",
    icon: "Receipt",
    color: "purple",
    badge: "มาตรฐาน",
    href: "/create/quotation",
    available: true,
  },
  {
    id: "nda",
    name: "NDA",
    fullName: "หนังสือสัญญาไม่เปิดเผยข้อมูล",
    description: "Non-Disclosure Agreement สัญญามาตรฐานสำหรับการรักษาความลับทางการค้า",
    icon: "FileSignature",
    color: "blue",
    badge: "มาตรฐาน",
    href: "/create/nda",
    available: true,
  },
  {
    id: "partner",
    name: "Partner Agreement",
    fullName: "สัญญาแต่งตั้งพันธมิตรตัวแทนจำหน่าย",
    description: "สัญญาแต่งตั้งพันธมิตร พร้อมเงื่อนไข Deal Registration และอัตราแลกเปลี่ยน",
    icon: "Handshake",
    color: "emerald",
    badge: "มาตรฐาน",
    href: "/create/partner",
    available: true,
  },
  {
    id: "distributor",
    name: "Distributor Agreement",
    fullName: "สัญญาแต่งตั้งและจัดจำหน่ายซอฟต์แวร์",
    description: "สัญญาแต่งตั้งตัวแทนจำหน่ายและจัดจำหน่ายซอฟต์แวร์",
    icon: "Building2",
    color: "indigo",
    badge: "มาตรฐาน",
    href: "/create/distributor",
    available: true,
  },
  {
    id: "notification",
    name: "Notification Letter",
    fullName: "หนังสือแจ้งและประกาศทางการ",
    description: "หนังสือแจ้งการ, จดหมายแจ้งเปลี่ยนแปลงข้อมูลองค์กร และประกาศทางการ",
    icon: "Megaphone",
    color: "rose",
    badge: "มาตรฐาน",
    href: "/create/notification",
    available: true,
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

  notification: [
    {
      id: "tmpl-notification-relocation",
      categoryId: "notification",
      name: "หนังสือแจ้งเปลี่ยนแปลงที่ตั้งสำนักงานใหญ่",
      englishName: "Notice of Head Office Relocation",
      tag: "มาตรฐาน",
      tagColor: "bg-rose-50 text-rose-700 border-rose-200",
      description: "หนังสือแจ้งเปลี่ยนแปลงที่อยู่และสถานที่ตั้งสำนักงานใหญ่ทางการ (ไทย-อังกฤษ)",
      pageCount: "1 หน้า",
      features: [
        "หนังสือแจ้งเปลี่ยนแปลงที่อยู่สองภาษา (TH/EN)",
        "กล่องเปรียบเทียบที่อยู่เดิมและที่อยู่ใหม่อย่างชัดเจน",
        "ส่วนลงนามผู้มีอำนาจลงนามและตำแหน่ง",
        "ส่งออกเป็น PDF คุณภาพสูงได้ทันที",
      ],
    },
  ],
};

export async function getTemplates() {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn("Failed to fetch /api/categories, falling back:", e);
    }
  }
  return CATEGORIES;
}

export async function getTemplatesByCategory(categoryId) {
  if (!categoryId) return [];
  const normalized = categoryId.toLowerCase();
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/templates?categoryId=${normalized}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn("Failed to fetch /api/templates by category:", e);
    }
  }
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