/**
 * Dynamic Token Engine for Document Builder
 * Supports standard dynamic variables {{variable_name}} across Textboxes and DocTable line items.
 */

export const AVAILABLE_TOKEN_CATEGORIES = [
  {
    category: "ข้อมูลบริษัทผู้จัดทำ (Our Company)",
    tokens: [
      { key: "{{company_name}}", label: "ชื่อบริษัท (ไทย)", example: "บริษัท เดอะ รีโคฟเวอรี่ แอดไวเซอร์ จำกัด" },
      { key: "{{company_name_en}}", label: "ชื่อบริษัท (Eng)", example: "THE RECOVERY ADVISOR CO., LTD." },
      { key: "{{company_tax_id}}", label: "เลขประจำตัวผู้เสียภาษี", example: "0105554007189" },
      { key: "{{company_address}}", label: "ที่อยู่สำนักงานใหญ่", example: "45 ซอยโกสุมรวมใจ 37 แขวงดอนเมือง เขตดอนเมือง กรุงเทพฯ 10210" },
      { key: "{{company_phone}}", label: "เบอร์โทรศัพท์บริษัท", example: "02-1019884" },
      { key: "{{company_email}}", label: "อีเมลติดต่อบริษัท", example: "info@recoveryadvisor.co.th" },
    ],
  },
  {
    category: "ข้อมูลคู่สัญญา / ลูกค้า (Client / Customer)",
    tokens: [
      { key: "{{customer_name}}", label: "ชื่อผู้ติดต่อ / ลูกค้า", example: "คุณสมชาย มั่งคั่งทรัพย์" },
      { key: "{{customer_company}}", label: "ชื่อบริษัทคู่สัญญา", example: "บริษัท ไทยเจริญ พาณิชย์ จำกัด" },
      { key: "{{customer_address}}", label: "ที่อยู่คู่สัญญา", example: "888 อาคารสาทรทาวเวอร์ ชั้น 18 ถนนสาทรใต้ กรุงเทพฯ 10120" },
      { key: "{{customer_tax_id}}", label: "เลขภาษีคู่สัญญา", example: "0105562098765" },
      { key: "{{attn_name}}", label: "เรียน (Attn)", example: "คุณสมชาย มั่งคั่งทรัพย์ (กรรมการบริหาร)" },
    ],
  },
  {
    category: "ข้อมูลเอกสาร & การเงิน (Document & Finance)",
    tokens: [
      { key: "{{doc_no}}", label: "เลขที่เอกสาร", example: "DOC-2026-0901" },
      { key: "{{doc_date}}", label: "วันที่ออกเอกสาร", example: "03 กันยายน 2569" },
      { key: "{{subject}}", label: "หัวเรื่องเอกสาร", example: "แจ้งเปลี่ยนแปลงที่อยู่สำนักงานใหญ่และข้อมูลนิติกรรม" },
      { key: "{{grand_total}}", label: "ยอดเงินรวมทั้งสิ้น", example: "239,680.00 บาท" },
      { key: "{{vat_amount}}", label: "ยอดภาษี VAT 7%", example: "15,680.00 บาท" },
    ],
  },
  {
    category: "ผู้มีอำนาจลงนาม (Authorized Signatory)",
    tokens: [
      { key: "{{authorized_signatory_name}}", label: "ชื่อผู้มีอำนาจลงนาม", example: "นายศรายุทธ โกสิยารักษ์" },
      { key: "{{authorized_signatory_position}}", label: "ตำแหน่งผู้ลงนาม", example: "กรรมการผู้จัดการ / CEO" },
    ],
  },
];

// Default Sample Token Map
export const DEFAULT_SAMPLE_TOKEN_MAP = {
  company_name: "บริษัท เดอะ รีโคฟเวอรี่ แอดไวเซอร์ จำกัด",
  company_name_en: "THE RECOVERY ADVISOR CO., LTD.",
  company_tax_id: "0105554007189",
  company_address: "45 ซอยโกสุมรวมใจ 37 แขวงดอนเมือง เขตดอนเมือง กรุงเทพมหานคร 10210",
  company_phone: "02-1019884",
  company_email: "info@recoveryadvisor.co.th",
  customer_name: "คุณสมชาย มั่งคั่งทรัพย์",
  customer_company: "บริษัท ไทยเจริญ พาณิชย์ จำกัด",
  customer_address: "888 อาคารสาทรทาวเวอร์ ชั้น 18 ถนนสาทรใต้ แขวงยานนาวา เขตสาทร กรุงเทพฯ 10120",
  customer_tax_id: "0105562098765",
  attn_name: "คุณสมชาย มั่งคั่งทรัพย์ (กรรมการบริหาร)",
  doc_no: "DOC-2026-0901",
  doc_date: "03 กันยายน 2569",
  subject: "แจ้งเปลี่ยนแปลงที่อยู่สำนักงานใหญ่และข้อมูลนิติกรรม",
  grand_total: "239,680.00 บาท",
  vat_amount: "15,680.00 บาท",
  authorized_signatory_name: "นายศรายุทธ โกสิยารักษ์",
  authorized_signatory_position: "กรรมการผู้จัดการ / CEO",
};

/**
 * Replaces token strings {{token_name}} with values from tokenMap
 */
export function replaceTokens(text, tokenMap = DEFAULT_SAMPLE_TOKEN_MAP) {
  if (typeof text !== "string") return text;
  return text.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match, key) => {
    if (tokenMap[key] !== undefined) return tokenMap[key];
    if (tokenMap[`{{${key}}}`] !== undefined) return tokenMap[`{{${key}}}`];
    return match;
  });
}

/**
 * Applies token substitution to an entire Fabric Canvas (including DocTable items)
 */
export function applyTokensToCanvas(canvas, isPreview = true, tokenMap = DEFAULT_SAMPLE_TOKEN_MAP) {
  if (!canvas) return;

  const objects = canvas.getObjects();

  objects.forEach((obj) => {
    // 1. Textbox / I-Text
    if (obj.type === "textbox" || obj.type === "i-text" || obj.type === "text") {
      if (isPreview) {
        if (!obj.rawTemplateText) {
          obj.rawTemplateText = obj.text;
        }
        obj.set("text", replaceTokens(obj.rawTemplateText, tokenMap));
      } else {
        if (obj.rawTemplateText) {
          obj.set("text", obj.rawTemplateText);
        }
      }
    }

    // 2. DocTable Custom Object
    if (obj.isDocTable && obj.docTableData && obj.updateTableData) {
      if (isPreview) {
        if (!obj.rawItems) {
          obj.rawItems = JSON.parse(JSON.stringify(obj.docTableData.items || []));
        }
        const replacedItems = obj.rawItems.map((item) => ({
          ...item,
          desc: replaceTokens(item.desc, tokenMap),
        }));
        obj.updateTableData({ items: replacedItems });
      } else {
        if (obj.rawItems) {
          obj.updateTableData({ items: JSON.parse(JSON.stringify(obj.rawItems)) });
        }
      }
    }
  });

  canvas.renderAll();
}

/**
 * 🛡️ Direct JSON Tree Revert: Strips mock preview values and forces raw tokens in any Canvas JSON tree
 * Can be executed on ANY page snapshot JSON without needing an active canvas instance.
 */
export function revertTokensInPageJson(pageJson) {
  if (!pageJson || typeof pageJson !== "object") return pageJson;

  // Deep clone to avoid in-memory side effects
  const cloned = JSON.parse(JSON.stringify(pageJson));

  function cleanObject(obj) {
    if (!obj || typeof obj !== "object") return;

    // 1. If text element with rawTemplateText -> force revert text to rawTemplateText
    if (obj.rawTemplateText !== undefined && obj.rawTemplateText !== null) {
      obj.text = obj.rawTemplateText;
    }

    // 2. If DocTable with rawItems -> force revert items to rawItems
    if (obj.isDocTable && obj.rawItems && Array.isArray(obj.rawItems)) {
      if (obj.docTableData) {
        obj.docTableData.items = JSON.parse(JSON.stringify(obj.rawItems));
      }
    }

    // 3. Recurse nested children/group objects if present
    if (Array.isArray(obj.objects)) {
      obj.objects.forEach(cleanObject);
    }
  }

  if (Array.isArray(cloned.objects)) {
    cloned.objects.forEach(cleanObject);
  }

  return cloned;
}