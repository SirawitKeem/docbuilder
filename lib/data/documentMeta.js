/**
 * Unified Dynamic Document Metadata Engine
 * Normalizes metadata across all document types (Quotation, NDA, Notification, Partner, Distributor, Canvas, Sheet)
 * Provides clean extraction with 100% backward compatibility for legacy document records.
 */

/**
 * Formats an ISO date string into a human-friendly relative time in Thai
 */
export function formatRelativeTimeThai(dateInput) {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "-";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 45) return "เมื่อสักครู่";
  if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
  if (diffHour < 24) return `${diffHour} ชั่วโมงที่แล้ว`;
  if (diffDay === 1) return "เมื่อวานนี้";
  if (diffDay < 7) return `${diffDay} วันที่แล้ว`;

  // Fallback to Thai Date format e.g. 08 ก.ย. 2569
  const thaiMonthsShort = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];
  const day = date.getDate();
  const month = thaiMonthsShort[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

/**
 * Format full Thai Date & Time for tooltips e.g. "08 ก.ย. 2569 11:30 น."
 */
export function formatFullDateTimeThai(dateInput) {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "-";

  const thaiMonthsShort = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];
  const day = date.getDate();
  const month = thaiMonthsShort[date.getMonth()];
  const year = date.getFullYear() + 543;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes} น.`;
}

/**
 * Extract clean, unified metadata from any document record
 */
export function extractDocumentMeta(doc) {
  if (!doc) return null;

  const values = doc.values || {};

  // 1. Document Number
  let docNumber = doc.docNumber || "";
  if (!docNumber) {
    if (values.quotationNo) docNumber = values.quotationNo;
    else if (values.doc_no) docNumber = values.doc_no;
    else if (values.documentNo) docNumber = values.documentNo;
    else if (values.contract_no) docNumber = values.contract_no;
  }

  // 2. Counterparty / Recipient Name
  let counterpartyName = "";
  if (doc.counterparty && doc.counterparty.name) {
    counterpartyName = doc.counterparty.name;
  } else if (values.counterparty_name) {
    counterpartyName = values.counterparty_name;
  } else if (values.recipient && values.recipient !== "ท่านคู่ค้าและลูกค้าผู้มีอุปการคุณ / Valued Business Partners") {
    counterpartyName = values.recipient;
  } else if (values.billTo?.companyName) {
    counterpartyName = values.billTo.companyName;
  } else if (values.customer_company) {
    counterpartyName = values.customer_company;
  } else if (values.reseller_company_name) {
    counterpartyName = values.reseller_company_name;
  } else if (values.distributor_company_name && values.distributor_company_name !== "บริษัท เครสท์ เซนโด จำกัด") {
    counterpartyName = values.distributor_company_name;
  } else if (values.recipient) {
    counterpartyName = values.recipient;
  }

  if (!counterpartyName) {
    counterpartyName = "-";
  }

  // 3. Contact Person / Attn
  let contactPerson = "";
  if (doc.counterparty && doc.counterparty.contactPerson) {
    contactPerson = doc.counterparty.contactPerson;
  } else if (values.attn_name) {
    contactPerson = values.attn_name;
  } else if (values.counterparty_signatory_name) {
    contactPerson = values.counterparty_signatory_name;
  } else if (values.billTo?.attn) {
    contactPerson = values.billTo.attn;
  } else if (values.customer_name) {
    contactPerson = values.customer_name;
  }

  // 4. Template & Category
  const templateName = doc.templateName || (doc.templateId === "quotation" ? "ใบเสนอราคา (Quotation)" : (doc.templateId ? doc.templateId : "-"));
  const templateId = doc.templateId || "general";
  const category = doc.category || (
    templateId === "quotation" ? "commercial" :
    ["nda", "partner", "distributor"].includes(templateId) ? "legal" :
    templateId === "notification" ? "internal" : "general"
  );

  // 5. Timestamps
  const updatedAt = doc.updatedAt || doc.createdAt || new Date().toISOString();
  const createdAt = doc.createdAt || updatedAt;
  const relativeTime = formatRelativeTimeThai(updatedAt);
  const fullDateTime = formatFullDateTimeThai(updatedAt);

  // 6. Has Exported / Sent
  const hasExported = Boolean(
    doc.lastSentAt ||
    doc.sentTo ||
    (Array.isArray(doc.exportHistory) && doc.exportHistory.length > 0)
  );

  return {
    id: doc.id,
    name: doc.name || "เอกสารไม่มีชื่อ",
    docNumber,
    counterpartyName,
    contactPerson,
    templateId,
    templateName,
    category,
    createdAt,
    updatedAt,
    relativeTime,
    fullDateTime,
    hasExported,
    sentTo: doc.sentTo || null,
    lastSentAt: doc.lastSentAt || null,
  };
}
