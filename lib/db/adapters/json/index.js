import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");
const defaultData = { fieldProfiles: [], documents: [], sentHistory: [], quotations: [] };

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      fieldProfiles: parsed.fieldProfiles || [],
      documents: parsed.documents || [],
      sentHistory: parsed.sentHistory || [],
      quotations: parsed.quotations || [],
    };
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
  return `${prefix}${String(nextNum).padStart(3, "0")}`; // e.g., "CZ2608001" or "CZ2608063"
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
    return (db.quotations || []).find((q) => q.id === id) || null;
  },
  async create(data) {
    const db = await readDb();
    const quotations = db.quotations || [];

    const quotationNo = data.quotationNo || generateQuotationNo(quotations);
    const todayStr = new Date().toLocaleDateString("th-TH");

    const record = {
      id: data.id || `qt-${Date.now()}`,
      quotationNo,
      name: data.name || `ใบเสนอราคา ${quotationNo}`,
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
      senderName: data.senderName || "นาย ศรายุทธ โกสิยารักษ์",
      senderPhone: data.senderPhone || "02-123-4567",
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
  async delete(id) {
    const db = await readDb();
    db.quotations = (db.quotations || []).filter((q) => q.id !== id);
    db.documents = (db.documents || []).filter((d) => d.id !== id);
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
    return (db.documents || []).find((doc) => doc.id === id) || null;
  },
  async create({ name, templateId, templateName, sentTo, values, id }) {
    const db = await readDb();
    const record = {
      id: id || `doc-${Date.now()}`,
      name,
      templateId,
      templateName,
      createdBy: "Admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: sentTo ? "sent" : "draft",
      sentTo: sentTo || null,
      values: values || {},
    };
    db.documents = db.documents || [];
    db.documents.unshift(record);
    await writeDb(db);
    return record;
  },
  async update(id, { name, templateId, templateName, sentTo, values, status }) {
    const db = await readDb();
    db.documents = db.documents || [];
    const idx = db.documents.findIndex((doc) => doc.id === id);
    if (idx === -1) {
      return this.create({ id, name, templateId, templateName, sentTo, values });
    }

    db.documents[idx] = {
      ...db.documents[idx],
      ...(name !== undefined ? { name } : {}),
      ...(templateId !== undefined ? { templateId } : {}),
      ...(templateName !== undefined ? { templateName } : {}),
      ...(sentTo !== undefined ? { sentTo } : {}),
      ...(values !== undefined ? { values } : {}),
      ...(status !== undefined ? { status } : {}),
      updatedAt: new Date().toISOString(),
    };

    await writeDb(db);
    return db.documents[idx];
  },
  async delete(id) {
    const db = await readDb();
    db.documents = (db.documents || []).filter((doc) => doc.id !== id);
    db.quotations = (db.quotations || []).filter((q) => q.id !== id);
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
