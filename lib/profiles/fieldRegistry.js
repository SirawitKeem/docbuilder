export const fieldRegistry = {
  // 1. ข้อมูลบริษัทและผู้รับใบเสนอราคา (Bill To / Customer)
  bill_to_company: {
    label: "ชื่อบริษัทลูกค้า (Bill To / To)",
    type: "text",
    category: "company",
    placeholder: "เช่น บริษัท CS LoxInfo Public Company Limited",
  },
  counterparty_name: {
    label: "ชื่อบริษัท/นิติบุคคล",
    type: "text",
    category: "company",
    placeholder: "เช่น บริษัท ตัวอย่าง จำกัด",
  },
  counterparty_registration_number: {
    label: "เลขประจำตัวผู้เสียภาษี / เลขทะเบียนนิติบุคคล",
    type: "text",
    category: "company",
    placeholder: "0105558073755",
  },
  counterparty_address: {
    label: "ที่อยู่สำนักงาน",
    type: "textarea",
    category: "company",
    placeholder: "เลขที่ ... แขวง/ตำบล ... เขต/อำเภอ ... จังหวัด ... รหัสไปรษณีย์ ...",
  },

  // 2. ข้อมูลผู้ติดต่อ (Contact Persons)
  attn_name: {
    label: "ผู้ติดต่อ (Attn.)",
    type: "text",
    category: "contact",
    placeholder: "เช่น คุณ Sarun Phongpodchanan",
  },
  end_user: {
    label: "End User",
    type: "text",
    category: "contact",
    placeholder: "เช่น P.R. Foodland Co., Ltd.",
  },
  subject: {
    label: "หัวข้อเรื่อง (Subject)",
    type: "text",
    category: "business",
    placeholder: "เช่น CDNetworks Annual Services (WAF+DDoS+BOT)",
  },
  am_name: {
    label: "ชื่อ Account Manager (AM)",
    type: "text",
    category: "contact",
    placeholder: "เช่น Narin Rattanavajij / Channel Manager",
  },
  am_phone: {
    label: "เบอร์โทร AM",
    type: "text",
    category: "contact",
    placeholder: "+6682-44-686-95",
  },

  // 3. เงื่อนไขใบเสนอราคา (Quotation Terms)
  price_validity: {
    label: "ระยะเวลาการยืนราคา (Price Validity)",
    type: "text",
    category: "business",
    placeholder: "เช่น 20 Sept 2026 หรือ 30 days",
  },
  delivery_term: {
    label: "เงื่อนไขส่งมอบ (Delivery Term)",
    type: "text",
    category: "business",
    placeholder: "เช่น 7 days",
  },
  credit_term: {
    label: "เงื่อนไขชำระเงิน (Credit Term)",
    type: "text",
    category: "business",
    placeholder: "เช่น 30 days",
  },

  // 4. ข้อมูลการลงนามสัญญา (สำหรับ NDA / Agreement เท่านั้น)
  counterparty_signatory_name: {
    label: "ชื่อผู้ลงนามสัญญา",
    type: "text",
    category: "signatory",
    placeholder: "ชื่อ-นามสกุล",
  },
  counterparty_signatory_position: {
    label: "ตำแหน่งผู้ลงนามสัญญา",
    type: "text",
    category: "signatory",
    placeholder: "เช่น กรรมการผู้จัดการ",
  },
  our_company_name: {
    label: "ชื่อบริษัท/นิติบุคคล (ฝ่ายเรา)",
    type: "text",
    category: "company",
    placeholder: "บริษัท เครสท์ เซนโด จำกัด",
  },
  our_signatory_name: {
    label: "ชื่อผู้ลงนาม (ฝ่ายเรา)",
    type: "text",
    category: "signatory",
    placeholder: "นายศรายุทธ โกสิยารักษ์",
  },
  our_signatory_position: {
    label: "ตำแหน่งผู้ลงนาม (ฝ่ายเรา)",
    type: "text",
    category: "signatory",
    placeholder: "CEO/Founder",
  },
};

export const categoryLabels = {
  company: "ข้อมูลบริษัท & ลูกค้า (Company / Customer)",
  contact: "ข้อมูลผู้ติดต่อ & ทีมขาย (Contact / AM)",
  business: "เงื่อนไขทางธุรกิจ & ใบเสนอราคา (Business & Terms)",
  signatory: "ข้อมูลผู้ลงนามสัญญา (Signatory - NDA/Agreement)",
};

// field ที่ถือเป็น "แกนกลาง" ของใบเสนอราคา
export const coreFieldKeys = [
  "bill_to_company",
  "attn_name",
  "am_name",
  "price_validity",
  "delivery_term",
  "credit_term",
];
