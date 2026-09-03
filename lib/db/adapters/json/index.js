import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const DEFAULT_CATEGORIES = [
  {
    id: "quotation",
    name: "Quotation",
    fullName: "ใบเสนอราคา",
    description: "ใบเสนอราคาพร้อมรายการสินค้า/บริการ คำนวณภาษี VAT 7% และยอดรวมอัตโนมัติ",
    icon: "Receipt",
    color: "purple",
    badge: "มาตรฐาน",
    order: 1,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "nda",
    name: "NDA",
    fullName: "หนังสือสัญญาไม่เปิดเผยข้อมูล",
    description: "Non-Disclosure Agreement สัญญามาตรฐานสำหรับการรักษาความลับทางการค้า",
    icon: "FileSignature",
    color: "blue",
    badge: "มาตรฐาน",
    order: 2,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "partner",
    name: "Partner Agreement",
    fullName: "สัญญาแต่งตั้งพันธมิตรตัวแทนจำหน่าย",
    description: "สัญญาแต่งตั้งพันธมิตร พร้อมเงื่อนไข Deal Registration และอัตราแลกเปลี่ยน",
    icon: "Handshake",
    color: "emerald",
    badge: "มาตรฐาน",
    order: 3,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "distributor",
    name: "Distributor Agreement",
    fullName: "สัญญาแต่งตั้งและจัดจำหน่ายซอฟต์แวร์",
    description: "สัญญาแต่งตั้งตัวแทนจำหน่ายและจัดจำหน่ายซอฟต์แวร์",
    icon: "Building2",
    color: "indigo",
    badge: "มาตรฐาน",
    order: 4,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "notification",
    name: "Notification Letter",
    fullName: "หนังสือแจ้งและประกาศทางการ",
    description: "หนังสือแจ้งการ, จดหมายแจ้งเปลี่ยนแปลงข้อมูลองค์กร และประกาศทางการ",
    icon: "Megaphone",
    color: "rose",
    badge: "มาตรฐาน",
    order: 5,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
];

const DEFAULT_TEMPLATES = [
  {
    id: "tmpl-quotation-standard",
    categoryId: "quotation",
    version: 1,
    name: "ใบเสนอราคามาตรฐาน",
    englishName: "Quotation Standard Template",
    description: "โครงสร้างเทมเพลตใบเสนอราคามาตรฐาน พร้อมระบบคำนวณภาษี VAT 7% และส่วนลด",
    icon: "Receipt",
    badge: "มาตรฐาน",
    pageCount: "1 หน้า A4",
    status: "published",
    orientation: "portrait",
    theme: { primaryColor: "#5542F6", backgroundColor: "#FFFFFF", hasWatermark: false },
    blocks: [
      {
        id: "b_header",
        type: "header",
        title: "หัวกระดาษบริษัท",
        settings: {
          hasLogo: true,
          logoUrl: "/quotation.png",
          companyName: "[ ชื่อบริษัท / ผู้เสนอราคา ]",
          companyNameEn: "[ Company Name (EN) ]",
          taxId: "0-0000-00000-00-0",
          address: "[ ที่อยู่สำนักงานใหญ่ / สถานประกอบการ ]",
          phone: "02-XXX-XXXX",
          email: "contact@company.com",
          align: "split",
        },
      },
      {
        id: "b_title",
        type: "doc_title",
        title: "หัวเรื่องเอกสาร",
        settings: {
          titleText: "ใบเสนอราคา (QUOTATION)",
          subtitleText: "ต้นฉบับ / Original",
          align: "center",
        },
      },
      {
        id: "b_info",
        type: "info_grid",
        title: "ข้อมูลลูกค้าและเอกสาร",
        settings: {
          billToTitle: "Bill To:",
          billToCompany: "[ ชื่อบริษัทลูกค้า / ผู้รับบริการ ]",
          attnName: "[ ชื่อผู้ติดต่อ ]",
          subject: "[ ระบุเรื่อง / โครงการ ]",
          quotationNo: "QT-YYYYMM-XXXX",
          date: "[ ว/ด/ป ที่ออกเอกสาร ]",
          validity: "30 วัน",
          amName: "[ ชื่อผู้จัดทำ / Account Manager ]",
        },
      },
      {
        id: "b_table",
        type: "quotation_table",
        title: "ตารางรายการสินค้า/บริการ",
        settings: {
          vatRate: 7,
          items: [],
        },
      },
      {
        id: "b_terms",
        type: "terms",
        title: "เงื่อนไขและข้อกำหนด",
        settings: {
          heading: "เงื่อนไขการชำระเงินและส่งมอบ:",
          bullets: [
            "ราคานี้ยังไม่รวมภาษีมูลค่าเพิ่ม (VAT 7%)",
            "กำหนดยืนราคา 30 วันนับจากวันที่ในเอกสาร",
            "เงื่อนไขการชำระเงิน: ภายใน 30 วันนับจากวันส่งมอบงาน",
          ],
        },
      },
      {
        id: "b_signatures",
        type: "signatures",
        title: "ส่วนลงนามอนุมัติ",
        settings: {
          slots: [
            { id: "s1", name: "[ ผู้มีอำนาจลงนาม / ผู้เสนอราคา ]", role: "ผู้เสนอราคา" },
            { id: "s2", name: "............................................", role: "ผู้อนุมัติสั่งซื้อ / ลูกค้า" },
          ],
        },
      },
    ],
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "tmpl-nda-standard",
    categoryId: "nda",
    version: 1,
    name: "หนังสือสัญญาไม่เปิดเผยข้อมูล",
    englishName: "Non-Disclosure Agreement (NDA)",
    description: "โครงสร้างสัญญามาตรฐานสำหรับการรักษาความลับทางการค้าและทรัพย์สินทางปัญญา",
    icon: "FileSignature",
    badge: "มาตรฐาน",
    pageCount: "2 หน้า A4",
    status: "published",
    orientation: "portrait",
    theme: { primaryColor: "#5542F6", backgroundColor: "#FFFFFF", hasWatermark: false },
    blocks: [
      {
        id: "b_header",
        type: "header",
        title: "หัวกระดาษ",
        settings: {
          hasLogo: true,
          logoUrl: "/quotation.png",
          companyName: "[ ชื่อบริษัท / องค์กร ]",
          companyNameEn: "[ Company Name (EN) ]",
          taxId: "0-0000-00000-00-0",
          address: "[ ที่อยู่สำนักงานใหญ่ ]",
          phone: "02-XXX-XXXX",
          email: "legal@company.com",
          align: "split",
        },
      },
      {
        id: "b_title",
        type: "doc_title",
        title: "หัวเรื่อง",
        settings: {
          titleText: "หนังสือสัญญาไม่เปิดเผยข้อมูล",
          subtitleText: "Non-Disclosure Agreement (NDA)",
          align: "center",
        },
      },
      {
        id: "b_text",
        type: "text_block",
        title: "โครงสร้างข้อสัญญา",
        settings: {
          content: "สัญญาฉบับนี้ทำขึ้นระหว่าง [ ชื่อคู่สัญญาฝ่ายเปิดเผยข้อมูล ] และ [ ชื่อคู่สัญญาฝ่ายรับข้อมูล ] โดยทั้งสองฝ่ายตกลงรักษาความลับของข้อมูลตามขอบเขตและระยะเวลาที่ระบุในสัญญานี้",
        },
      },
      {
        id: "b_terms",
        type: "terms",
        title: "ข้อกำหนดความลับ",
        settings: {
          heading: "ข้อกำหนดและขอบเขตความลับ:",
          bullets: [
            "ห้ามเปิดเผยข้อมูลความลับแก่บุคคลภายนอกโดยไม่ได้รับความยินยอมเป็นลายลักษณ์อักษร",
            "ใช้ข้อมูลความลับเพื่อวัตถุประสงค์ตามที่ตกลงกันไว้เท่านั้น",
            "สัญญานี้มีผลบังคับใช้ตามระยะเวลาที่กำหนดในสัญญา",
          ],
        },
      },
      {
        id: "b_signatures",
        type: "signatures",
        title: "ลงนามทั้งสองฝ่าย",
        settings: {
          slots: [
            { id: "s1", name: "[ ผู้มีอำนาจลงนามฝ่ายเปิดเผยข้อมูล ]", role: "ฝ่ายเปิดเผยข้อมูล" },
            { id: "s2", name: "............................................", role: "ฝ่ายรับข้อมูล" },
          ],
        },
      },
    ],
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "tmpl-partner-standard",
    categoryId: "partner",
    version: 1,
    name: "สัญญาแต่งตั้งพันธมิตรตัวแทนจำหน่าย",
    englishName: "Partner Agreement",
    description: "โครงสร้างสัญญาแต่งตั้งพันธมิตรทางธุรกิจ พร้อมเงื่อนไข Deal Registration",
    icon: "Handshake",
    badge: "มาตรฐาน",
    pageCount: "2 หน้า A4",
    status: "published",
    orientation: "portrait",
    theme: { primaryColor: "#5542F6", backgroundColor: "#FFFFFF", hasWatermark: false },
    blocks: [
      {
        id: "b_header",
        type: "header",
        title: "หัวกระดาษ",
        settings: {
          hasLogo: true,
          logoUrl: "/quotation.png",
          companyName: "[ ชื่อบริษัทผู้แต่งตั้ง ]",
          companyNameEn: "[ Company Name (EN) ]",
          taxId: "0-0000-00000-00-0",
          address: "[ ที่อยู่สำนักงานใหญ่ ]",
          phone: "02-XXX-XXXX",
          email: "partner@company.com",
          align: "split",
        },
      },
      {
        id: "b_title",
        type: "doc_title",
        title: "หัวเรื่อง",
        settings: {
          titleText: "สัญญาแต่งตั้งพันธมิตรตัวแทนจำหน่าย",
          subtitleText: "Partner Agreement",
          align: "center",
        },
      },
      {
        id: "b_text",
        type: "text_block",
        title: "รายละเอียดข้อตกลง",
        settings: {
          content: "สัญญานี้จัดทำขึ้นระหว่าง [ ชื่อบริษัทผู้แต่งตั้ง ] และ [ ชื่อตัวแทนพันธมิตร ] เพื่อแต่งตั้งให้เป็นตัวแทนพันธมิตรในการจำหน่ายและให้บริการผลิตภัณฑ์ตามเงื่อนไขที่ตกลงกัน",
        },
      },
      {
        id: "b_terms",
        type: "terms",
        title: "เงื่อนไขพันธมิตร",
        settings: {
          heading: "เงื่อนไขและสิทธิประโยชน์พันธมิตร:",
          bullets: [
            "ส่วนแบ่งผลประโยชน์ทางการค้าตามระดับพันธมิตรที่กำหนด",
            "การลงทะเบียนโครงการผ่านระบบ Deal Registration",
            "ระยะเวลาสัญญาและเงื่อนไขการต่ออายุสัญญา",
          ],
        },
      },
      {
        id: "b_signatures",
        type: "signatures",
        title: "ลงนามแต่งตั้ง",
        settings: {
          slots: [
            { id: "s1", name: "[ ผู้มีอำนาจลงนามผู้แต่งตั้ง ]", role: "ผู้แต่งตั้ง" },
            { id: "s2", name: "............................................", role: "ผู้รับการแต่งตั้ง (พันธมิตร)" },
          ],
        },
      },
    ],
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "tmpl-distributor-standard",
    categoryId: "distributor",
    version: 1,
    name: "สัญญาแต่งตั้งและจัดจำหน่ายซอฟต์แวร์",
    englishName: "Distributor Agreement",
    description: "โครงสร้างสัญญาแต่งตั้งตัวแทนจำหน่ายและจัดจำหน่ายซอฟต์แวร์",
    icon: "Building2",
    badge: "มาตรฐาน",
    pageCount: "2 หน้า A4",
    status: "published",
    orientation: "portrait",
    theme: { primaryColor: "#5542F6", backgroundColor: "#FFFFFF", hasWatermark: false },
    blocks: [
      {
        id: "b_header",
        type: "header",
        title: "หัวกระดาษ",
        settings: {
          hasLogo: true,
          logoUrl: "/quotation.png",
          companyName: "[ ชื่อบริษัทผู้จัดจำหน่ายหลัก ]",
          companyNameEn: "[ Principal Company (EN) ]",
          taxId: "0-0000-00000-00-0",
          address: "[ ที่อยู่สำนักงานใหญ่ ]",
          phone: "02-XXX-XXXX",
          email: "distributor@company.com",
          align: "split",
        },
      },
      {
        id: "b_title",
        type: "doc_title",
        title: "หัวเรื่อง",
        settings: {
          titleText: "สัญญาแต่งตั้งและจัดจำหน่ายซอฟต์แวร์",
          subtitleText: "Distributor Agreement",
          align: "center",
        },
      },
      {
        id: "b_text",
        type: "text_block",
        title: "รายละเอียดข้อสัญญา",
        settings: {
          content: "สัญญานี้จัดทำขึ้นระหว่าง [ ชื่อบริษัทผู้จัดจำหน่ายหลัก ] และ [ ชื่อบริษัทตัวแทนจำหน่าย ] เพื่อกำหนดสิทธิและหน้าที่ในการจำหน่ายผลิตภัณฑ์ซอฟต์แวร์ในเขตพื้นที่ที่กำหนด",
        },
      },
      {
        id: "b_terms",
        type: "terms",
        title: "ข้อกำหนดการจำหน่าย",
        settings: {
          heading: "เงื่อนไขการจำหน่ายและเป้าหมาย:",
          bullets: [
            "กำหนดเป้าหมายยอดจำหน่ายและอัตราส่วนลดตามระดับตัวแทน",
            "ขอบเขตพื้นที่และสิทธิการจัดจำหน่ายในอาณาเขตที่ตกลง",
            "การสนับสนุนด้านการตลาดและการฝึกอบรมผลิตภัณฑ์",
          ],
        },
      },
      {
        id: "b_signatures",
        type: "signatures",
        title: "ลงนามคู่สัญญา",
        settings: {
          slots: [
            { id: "s1", name: "[ ผู้มีอำนาจลงนามผู้จัดจำหน่ายหลัก ]", role: "ผู้จัดจำหน่ายหลัก" },
            { id: "s2", name: "............................................", role: "ตัวแทนจำหน่าย" },
          ],
        },
      },
    ],
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
];

const defaultData = {
  fieldProfiles: [],
  documents: [],
  sentHistory: [],
  quotations: [],
  categories: DEFAULT_CATEGORIES,
  customTemplates: DEFAULT_TEMPLATES,
};

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    const db = {
      fieldProfiles: parsed.fieldProfiles || [],
      documents: parsed.documents || [],
      sentHistory: parsed.sentHistory || [],
      quotations: parsed.quotations || [],
      categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : DEFAULT_CATEGORIES,
      customTemplates: parsed.customTemplates && parsed.customTemplates.length > 0 ? parsed.customTemplates : DEFAULT_TEMPLATES,
    };
    if (!parsed.categories || !parsed.customTemplates) {
      await writeDb(db);
    }
    return db;
  } catch (err) {
    if (err.code === "ENOENT") {
      await writeDb(defaultData);
      return defaultData;
    }
    throw err;
  }
}

async function writeDb(data) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function generateQuotationNo(quotations) {
  const now = new Date();
  const year2Digits = String(now.getFullYear()).slice(-2); // e.g., "26" for 2026
  const month2Digits = String(now.getMonth() + 1).padStart(2, "0"); // e.g., "08" for August
  const prefix = `CZ${year2Digits}${month2Digits}`; // e.g., "CZ2608"

  const sameMonthItems = (quotations || []).filter(
    (q) => q.quotationNo && q.quotationNo.startsWith(prefix)
  );
  const nextNum = sameMonthItems.length + 1;
  return `${prefix}${String(nextNum).padStart(4, "0")}`; // e.g., "CZ26080001"
}

export const jsonFieldProfilesRepo = {
  async getAll() {
    const db = await readDb();
    return db.fieldProfiles || [];
  },
  async getById(id) {
    const db = await readDb();
    return (db.fieldProfiles || []).find((p) => p.id === id) || null;
  },
  async create({ name, values }) {
    const db = await readDb();
    const profile = {
      id: `profile-${Date.now()}`,
      name: name || "ข้อมูลไม่มีชื่อ",
      values: values || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.fieldProfiles = db.fieldProfiles || [];
    db.fieldProfiles.push(profile);
    await writeDb(db);
    return profile;
  },
  async update(id, { name, values }) {
    const db = await readDb();
    db.fieldProfiles = db.fieldProfiles || [];
    const idx = db.fieldProfiles.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("ไม่พบข้อมูลนี้");

    db.fieldProfiles[idx] = {
      ...db.fieldProfiles[idx],
      ...(name !== undefined ? { name } : {}),
      ...(values !== undefined ? { values } : {}),
      updatedAt: new Date().toISOString(),
    };
    await writeDb(db);
    return db.fieldProfiles[idx];
  },
  async remove(id) {
    const db = await readDb();
    db.fieldProfiles = (db.fieldProfiles || []).filter((p) => p.id !== id);
    await writeDb(db);
  },
};

export const jsonQuotationsRepo = {
  async getAll() {
    const db = await readDb();
    return db.quotations || [];
  },
  async getById(id) {
    const db = await readDb();
    const q = (db.quotations || []).find((q) => q.id === id);
    if (q) return q;
    const doc = (db.documents || []).find((d) => d.id === id);
    if (doc) return doc.values || doc;
    return null;
  },
  async create(data) {
    const db = await readDb();
    const quotations = db.quotations || [];

    const quotationNo = data.quotationNo || generateQuotationNo(quotations);
    const revision = data.revision || "01";
    const todayStr = new Date().toLocaleDateString("th-TH");

    const record = {
      id: data.id || `qt-${Date.now()}`,
      quotationNo,
      revision,
      name: data.name || `ใบเสนอราคา ${quotationNo} Rev.${revision}`,
      templateId: "quotation",
      templateName: "ใบเสนอราคา (Quotation)",
      quotationDate: data.quotationDate || todayStr,
      priceValidity: data.priceValidity || "30 Days",
      deliveryTerm: data.deliveryTerm || "Within 15-30 Days",
      creditTerm: data.creditTerm || "30 Days",
      billTo: data.billTo || {
        companyName: "",
        attn: "",
        endUser: "",
        subject: "",
        am: "",
      },
      lineItems: data.lineItems || [],
      vatRate: data.vatRate !== undefined ? data.vatRate : 7,
      remarks: data.remarks || "",
      senderName: data.senderName || "",
      senderPhone: data.senderPhone || "",
      createdBy: "Admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: data.sentTo ? "sent" : "draft",
      sentTo: data.sentTo || null,
    };

    quotations.unshift(record);
    db.quotations = quotations;

    // Sync to documents array for unified list
    db.documents = db.documents || [];
    const docIdx = db.documents.findIndex((d) => d.id === record.id);
    const docEntry = {
      id: record.id,
      name: record.name,
      templateId: "quotation",
      templateName: "ใบเสนอราคา (Quotation)",
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      status: record.status,
      sentTo: record.sentTo,
      values: record,
    };
    if (docIdx >= 0) {
      db.documents[docIdx] = docEntry;
    } else {
      db.documents.unshift(docEntry);
    }

    await writeDb(db);
    return record;
  },
  async update(id, data) {
    const db = await readDb();
    db.quotations = db.quotations || [];
    const idx = db.quotations.findIndex((q) => q.id === id);
    if (idx === -1) {
      return this.create({ id, ...data });
    }

    db.quotations[idx] = {
      ...db.quotations[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Sync to documents array for unified list
    db.documents = db.documents || [];
    const docIdx = db.documents.findIndex((d) => d.id === id);
    const updatedRecord = db.quotations[idx];
    const docEntry = {
      id,
      name: updatedRecord.name,
      templateId: "quotation",
      templateName: "ใบเสนอราคา (Quotation)",
      createdBy: updatedRecord.createdBy,
      createdAt: updatedRecord.createdAt,
      updatedAt: updatedRecord.updatedAt,
      status: updatedRecord.status,
      sentTo: updatedRecord.sentTo,
      values: updatedRecord,
    };
    if (docIdx >= 0) {
      db.documents[docIdx] = docEntry;
    } else {
      db.documents.unshift(docEntry);
    }

    await writeDb(db);
    return db.quotations[idx];
  },
  async createRevision(id) {
    const db = await readDb();
    const quotations = db.quotations || [];
    const source = (quotations || []).find((q) => q.id === id) || (db.documents || []).find((d) => d.id === id);
    if (!source) throw new Error("ไม่พบใบเสนอราคาต้นฉบับ");

    const sourceData = source.values || source;
    const currentRevNum = parseInt(sourceData.revision || "1", 10);
    const nextRevNum = isNaN(currentRevNum) ? 2 : currentRevNum + 1;
    const nextRevision = String(nextRevNum).padStart(2, "0");

    const todayStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const newId = `qt-${Date.now()}`;
    const quotationNo = sourceData.quotationNo || generateQuotationNo(quotations);

    const record = {
      ...sourceData,
      id: newId,
      quotationNo,
      revision: nextRevision,
      name: `ใบเสนอราคา ${quotationNo} Rev.${nextRevision}`,
      quotationDate: todayStr,
      status: "draft",
      parentId: sourceData.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    quotations.unshift(record);
    db.quotations = quotations;

    db.documents = db.documents || [];
    db.documents.unshift({
      id: record.id,
      name: record.name,
      templateId: "quotation",
      templateName: "ใบเสนอราคา (Quotation)",
      createdBy: record.createdBy || "Admin",
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      status: "draft",
      sentTo: null,
      values: record,
    });

    await writeDb(db);
    return record;
  },
  async delete(id) {
    const ids = Array.isArray(id) ? id : [id];
    const db = await readDb();
    db.quotations = (db.quotations || []).filter((q) => !ids.includes(q.id));
    db.documents = (db.documents || []).filter((d) => !ids.includes(d.id));
    await writeDb(db);
    return { success: true };
  },
};

export const jsonDocumentsRepo = {
  async getAll() {
    const db = await readDb();
    return db.documents || [];
  },
  async getById(id) {
    const db = await readDb();
    return (db.documents || []).find((doc) => doc.id === id || doc.verificationToken === id) || null;
  },
  async create({ name, templateId, templateName, sentTo, values, id, status = "draft", createdBy = "นายสมชาย ใจดี (ผู้จัดทำ)" }) {
    const db = await readDb();
    const now = new Date().toISOString();
    const docId = id || `doc-${Date.now()}`;
    const verificationToken = `VRF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const record = {
      id: docId,
      verificationToken,
      name,
      templateId,
      templateName,
      createdBy,
      createdAt: now,
      updatedAt: now,
      status: sentTo ? "sent" : status,
      sentTo: sentTo || null,
      values: values || {},
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          action: "create",
          performedBy: createdBy,
          timestamp: now,
          details: "สร้างเอกสารฉบับร่าง",
        },
      ],
      approvalChain: [
        {
          id: "step-1",
          stepName: "ผู้จัดทำ / ผู้ยื่นเอกสาร",
          assignedRole: "ผู้จัดทำ",
          assignedUser: createdBy,
          status: "approved",
          signedAt: now,
        },
        {
          id: "step-2",
          stepName: "ผู้มีอำนาจอนุมัติ / กรรมการ",
          assignedRole: "กรรมการผู้จัดการ",
          assignedUser: "นายศรายุทธ โกสิยารักษ์",
          status: "pending",
          signedAt: null,
        },
      ],
    };
    db.documents = db.documents || [];
    db.documents.unshift(record);
    await writeDb(db);
    return record;
  },
  async update(id, { name, templateId, templateName, sentTo, values, status, activityLogs, approvalChain, rejectionReason }) {
    const db = await readDb();
    db.documents = db.documents || [];
    const idx = db.documents.findIndex((doc) => doc.id === id);
    if (idx === -1) {
      return this.create({ id, name, templateId, templateName, sentTo, values, status });
    }

    const current = db.documents[idx];
    const now = new Date().toISOString();

    db.documents[idx] = {
      ...current,
      ...(name !== undefined ? { name } : {}),
      ...(templateId !== undefined ? { templateId } : {}),
      ...(templateName !== undefined ? { templateName } : {}),
      ...(sentTo !== undefined ? { sentTo } : {}),
      ...(values !== undefined ? { values } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(activityLogs !== undefined ? { activityLogs } : {}),
      ...(approvalChain !== undefined ? { approvalChain } : {}),
      ...(rejectionReason !== undefined ? { rejectionReason } : {}),
      updatedAt: now,
    };

    await writeDb(db);
    return db.documents[idx];
  },
  async addActivityLog(id, { action, performedBy, details, comment }) {
    const db = await readDb();
    db.documents = db.documents || [];
    const idx = db.documents.findIndex((doc) => doc.id === id);
    if (idx === -1) return null;

    const doc = db.documents[idx];
    doc.activityLogs = doc.activityLogs || [];
    doc.activityLogs.unshift({
      id: `act-${Date.now()}`,
      action,
      performedBy: performedBy || "ผู้ดูแลระบบ (Admin)",
      timestamp: new Date().toISOString(),
      details: details || "",
      comment: comment || "",
    });
    doc.updatedAt = new Date().toISOString();

    await writeDb(db);
    return doc;
  },
  async submitForApproval(id, { performedBy = "นายสมชาย ใจดี", comment = "" } = {}) {
    const db = await readDb();
    db.documents = db.documents || [];
    const idx = db.documents.findIndex((doc) => doc.id === id);
    if (idx === -1) return null;

    const doc = db.documents[idx];
    const now = new Date().toISOString();
    doc.status = "pending_approval";
    doc.updatedAt = now;
    doc.activityLogs = doc.activityLogs || [];
    doc.activityLogs.unshift({
      id: `act-${Date.now()}`,
      action: "submit_approval",
      performedBy,
      timestamp: now,
      details: "ส่งเอกสารเข้าสายอนุมัติ",
      comment,
    });

    await writeDb(db);
    return doc;
  },
  async approveDocument(id, { performedBy = "นายศรายุทธ โกสิยารักษ์ (กรรมการผู้จัดการ)", comment = "", signatureImg = null } = {}) {
    const db = await readDb();
    db.documents = db.documents || [];
    const idx = db.documents.findIndex((doc) => doc.id === id);
    if (idx === -1) return null;

    const doc = db.documents[idx];
    const now = new Date().toISOString();
    doc.status = "completed";
    doc.approvedAt = now;
    doc.approvedBy = performedBy;
    doc.updatedAt = now;

    if (!doc.verificationToken) {
      doc.verificationToken = `VRF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    }

    if (signatureImg && doc.values) {
      doc.values.signatures = doc.values.signatures || {};
      doc.values.signatures.approver = signatureImg;
    }

    doc.activityLogs = doc.activityLogs || [];
    doc.activityLogs.unshift({
      id: `act-${Date.now()}`,
      action: "approve",
      performedBy,
      timestamp: now,
      details: "อนุมัติและลงนามเอกสารเสร็จสมบูรณ์",
      comment,
    });

    // Update approval chain
    if (doc.approvalChain && doc.approvalChain[1]) {
      doc.approvalChain[1].status = "approved";
      doc.approvalChain[1].signedAt = now;
      doc.approvalChain[1].comment = comment;
    }

    await writeDb(db);
    return doc;
  },
  async rejectDocument(id, { performedBy = "นายศรายุทธ โกสิยารักษ์", reason = "" } = {}) {
    const db = await readDb();
    db.documents = db.documents || [];
    const idx = db.documents.findIndex((doc) => doc.id === id);
    if (idx === -1) return null;

    const doc = db.documents[idx];
    const now = new Date().toISOString();
    doc.status = "rejected";
    doc.rejectionReason = reason;
    doc.updatedAt = now;

    doc.activityLogs = doc.activityLogs || [];
    doc.activityLogs.unshift({
      id: `act-${Date.now()}`,
      action: "reject",
      performedBy,
      timestamp: now,
      details: "ตีกลับเอกสารเพื่อแก้ไข",
      comment: reason,
    });

    if (doc.approvalChain && doc.approvalChain[1]) {
      doc.approvalChain[1].status = "rejected";
      doc.approvalChain[1].comment = reason;
    }

    await writeDb(db);
    return doc;
  },
  async delete(id) {
    const ids = Array.isArray(id) ? id : [id];
    const db = await readDb();
    db.documents = (db.documents || []).filter((doc) => !ids.includes(doc.id));
    db.quotations = (db.quotations || []).filter((q) => !ids.includes(q.id));
    await writeDb(db);
    return { success: true };
  },
};

export const jsonSentHistoryRepo = {
  async getAll() {
    const db = await readDb();
    return db.sentHistory || [];
  },
  async create({ name, templateId, templateName, sentTo, values }) {
    const db = await readDb();
    const record = {
      id: `history-${Date.now()}`,
      name,
      templateId,
      templateName,
      createdBy: "Admin",
      createdAt: new Date().toISOString(),
      status: "sent",
      sentTo: sentTo || null,
      values: values || {},
    };
    db.sentHistory = db.sentHistory || [];
    db.sentHistory.unshift(record);
    await writeDb(db);
    return record;
  },
  async delete(id) {
    const db = await readDb();
    db.sentHistory = (db.sentHistory || []).filter((h) => h.id !== id);
    await writeDb(db);
    return { success: true };
  },
};

export const jsonCategoriesRepo = {
  async getAll() {
    const db = await readDb();
    const categories = db.categories || [];
    const templates = db.customTemplates || [];
    return categories.map((cat) => ({
      ...cat,
      templateCount: templates.filter((t) => t.categoryId === cat.id).length,
    }));
  },
  async getById(id) {
    const db = await readDb();
    const cat = (db.categories || []).find((c) => c.id === id);
    if (!cat) return null;
    const templates = db.customTemplates || [];
    return {
      ...cat,
      templateCount: templates.filter((t) => t.categoryId === cat.id).length,
    };
  },
  async create({ name, fullName, description, icon, color, badge, order }) {
    const db = await readDb();
    const slug = (name || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const isTaken = (db.categories || []).some((c) => c.id === slug);
    const id = slug && !isTaken ? slug : `cat-${Date.now()}`;

    const newCategory = {
      id,
      name: name || "หมวดหมู่ใหม่",
      fullName: fullName || name || "หมวดหมู่ใหม่",
      description: description || "",
      icon: icon || "FileText",
      color: color || "purple",
      badge: badge || "หมวดใหม่",
      order: Number(order) || (db.categories || []).length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.categories = db.categories || [];
    db.categories.push(newCategory);
    await writeDb(db);
    return newCategory;
  },
  async update(id, { name, fullName, description, icon, color, badge, order }) {
    const db = await readDb();
    db.categories = db.categories || [];
    const idx = db.categories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("ไม่พบหมวดหมู่นี้");

    db.categories[idx] = {
      ...db.categories[idx],
      ...(name !== undefined ? { name } : {}),
      ...(fullName !== undefined ? { fullName } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(icon !== undefined ? { icon } : {}),
      ...(color !== undefined ? { color } : {}),
      ...(badge !== undefined ? { badge } : {}),
      ...(order !== undefined ? { order: Number(order) } : {}),
      updatedAt: new Date().toISOString(),
    };
    await writeDb(db);
    return db.categories[idx];
  },
  async delete(id) {
    const db = await readDb();
    db.categories = (db.categories || []).filter((c) => c.id !== id);
    await writeDb(db);
    return { success: true };
  },
};

export const jsonCustomTemplatesRepo = {
  async getAll({ categoryId } = {}) {
    const db = await readDb();
    let list = db.customTemplates || [];
    if (categoryId && categoryId !== "all") {
      list = list.filter((t) => t.categoryId === categoryId);
    }
    return list.map((t) => {
      const editorType = t.editorType || "document";
      const isSheet = editorType === "sheet";
      return {
        ...t,
        editorType,
        canvasPreset: isSheet ? null : t.canvasPreset || (editorType === "slide" ? "slide-16-9" : "a4-portrait"),
        sheetData: Array.isArray(t.sheetData) ? t.sheetData : [],
      };
    });
  },
  async getById(id) {
    const db = await readDb();
    const item = (db.customTemplates || []).find((t) => t.id === id);
    if (!item) return null;
    const editorType = item.editorType || "document";
    const isSheet = editorType === "sheet";
    return {
      ...item,
      editorType,
      canvasPreset: isSheet ? null : item.canvasPreset || (editorType === "slide" ? "slide-16-9" : "a4-portrait"),
      sheetData: Array.isArray(item.sheetData) ? item.sheetData : [],
    };
  },
  async create({
    name,
    categoryId,
    description,
    icon,
    badge,
    status = "published",
    orientation = "portrait",
    theme = { primaryColor: "#5542F6", backgroundColor: "#FFFFFF", hasWatermark: false },
    blocks = [],
    pageCount = 1,
    pages = [],
    editorType = "document",
    canvasPreset = "a4-portrait",
    sheetData = [],
  }) {
    const db = await readDb();
    const id = `tmpl-${Date.now()}`;
    const validEditorTypes = ["document", "slide", "sheet"];
    const safeEditorType = validEditorTypes.includes(editorType) ? editorType : "document";
    const isSheet = safeEditorType === "sheet";
    const safeCanvasPreset = isSheet ? null : canvasPreset || (safeEditorType === "slide" ? "slide-16-9" : "a4-portrait");

    const newTemplate = {
      id,
      name: name || (isSheet ? "เทมเพลตตารางคำนวณใหม่ (Sheets)" : "เทมเพลตใหม่"),
      categoryId: categoryId || "forms",
      editorType: safeEditorType,
      canvasPreset: safeCanvasPreset,
      version: 1,
      description: description || "",
      icon: icon || (isSheet ? "Table" : "FileText"),
      badge: badge || "กำหนดเอง",
      status: status || "published",
      orientation: isSheet ? "landscape" : orientation,
      theme,
      pageCount: isSheet ? 0 : pageCount || (pages.length > 0 ? pages.length : 1),
      pages: isSheet ? [] : Array.isArray(pages) ? pages : [],
      sheetData: isSheet ? (Array.isArray(sheetData) ? sheetData : []) : [],
      blocks: Array.isArray(blocks) ? blocks : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.customTemplates = db.customTemplates || [];
    db.customTemplates.unshift(newTemplate);
    await writeDb(db);
    return newTemplate;
  },
  async update(id, data) {
    const db = await readDb();
    db.customTemplates = db.customTemplates || [];
    const idx = db.customTemplates.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("ไม่พบเทมเพลตนี้");

    const current = db.customTemplates[idx];
    const validEditorTypes = ["document", "slide", "sheet"];
    const safeEditorType = data.editorType && validEditorTypes.includes(data.editorType)
      ? data.editorType
      : current.editorType || "document";
    const isSheet = safeEditorType === "sheet";

    db.customTemplates[idx] = {
      ...current,
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
      ...(data.editorType !== undefined ? { editorType: safeEditorType } : {}),
      ...(data.canvasPreset !== undefined ? { canvasPreset: isSheet ? null : data.canvasPreset } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.icon !== undefined ? { icon: data.icon } : {}),
      ...(data.badge !== undefined ? { badge: data.badge } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.orientation !== undefined ? { orientation: data.orientation } : {}),
      ...(data.theme !== undefined ? { theme: data.theme } : {}),
      ...(data.blocks !== undefined ? { blocks: data.blocks } : {}),
      ...(data.pageCount !== undefined ? { pageCount: isSheet ? 0 : data.pageCount } : {}),
      ...(data.pages !== undefined ? { pages: isSheet ? [] : data.pages } : {}),
      ...(data.sheetData !== undefined ? { sheetData: Array.isArray(data.sheetData) ? data.sheetData : [] } : {}),
      version: (current.version || 1) + 1,
      updatedAt: new Date().toISOString(),
    };
    await writeDb(db);
    return db.customTemplates[idx];
  },
  async delete(id) {
    const db = await readDb();
    db.customTemplates = (db.customTemplates || []).filter((t) => t.id !== id);
    await writeDb(db);
    return { success: true };
  },
};
