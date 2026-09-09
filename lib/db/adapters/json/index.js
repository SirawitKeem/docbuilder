import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

import {
  SYSTEM_CATEGORIES as DEFAULT_CATEGORIES,
  SYSTEM_DEFAULT_TEMPLATES as DEFAULT_TEMPLATES,
} from "../../../templates/catalog.js";



const DEFAULT_SETTINGS = {
  account: {
    fullName: "สิรวิทย์ เพชรจำรัส",
    email: "keem@crestzendo.com",
    role: "Owner / Admin",
    avatar: "",
    twoFactorEnabled: true,
  },
  preferences: {
    theme: "light",
    language: "th",
    dateFormat: "buddhist",
    defaultExportFormat: "pdf",
  },
  organization: {
    name: "บริษัท เครสท์ เซนโด จำกัด",
    nameEn: "Crest Zendo Co., Ltd.",
    taxId: "0105558073755",
    branch: "สำนักงานใหญ่",
    address: "8/40 The Connect 37, ซอยช่างอากาศอุทิศ 10 แยก 1-2 แขวงดอนเมือง เขตดอนเมือง กรุงเทพมหานคร 10210",
    phone: "02-123-4567",
    email: "contact@crestzendo.com",
    website: "https://crestzendo.com",
    logo: "",
  },
  sessions: [
    {
      id: "sess-current",
      device: "Chrome บน Windows 11",
      ip: "127.0.0.1",
      location: "Bangkok, Thailand",
      current: true,
      lastActive: "Active now",
    },
    {
      id: "sess-mobile",
      device: "Safari บน iPhone 15 Pro",
      ip: "182.52.41.22",
      location: "Bangkok, Thailand",
      current: false,
      lastActive: "2 ชั่วโมงที่แล้ว",
    },
  ],
  language: "th",
  currency: "THB",
  theme: "light",
};

const defaultData = {
  fieldProfiles: [],
  documents: [],
  sentHistory: [],
  categories: DEFAULT_CATEGORIES,
  customTemplates: DEFAULT_TEMPLATES,
  customTokens: [],
  notifications: [],
  settings: DEFAULT_SETTINGS,
};

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      console.error("Warning: db.json parse error, attempting auto-recovery...", parseErr.message);
      let recovered = false;
      // Recovery attempt 1: Find last valid closing brace if trailing corrupted text
      let candidateIdx = raw.lastIndexOf("}");
      while (candidateIdx > 0) {
        try {
          parsed = JSON.parse(raw.slice(0, candidateIdx + 1));
          recovered = true;
          console.log("Successfully auto-recovered db.json up to index", candidateIdx);
          await fs.writeFile(DB_PATH, JSON.stringify(parsed, null, 2), "utf-8");
          break;
        } catch {
          candidateIdx = raw.lastIndexOf("}", candidateIdx - 1);
        }
      }
      // Recovery attempt 2: Try .bak file
      if (!recovered) {
        try {
          const bakRaw = await fs.readFile(`${DB_PATH}.bak`, "utf-8");
          parsed = JSON.parse(bakRaw);
          recovered = true;
          console.log("Successfully restored db.json from backup (.bak)");
          await fs.writeFile(DB_PATH, JSON.stringify(parsed, null, 2), "utf-8");
        } catch {}
      }
      if (!recovered) {
        throw parseErr;
      }
    }

    // Auto-migrate any legacy quotations into documents (Single Source of Truth)
    const documents = parsed.documents || [];
    const existingDocIds = new Set(documents.map((d) => d.id));
    if (Array.isArray(parsed.quotations)) {
      for (const q of parsed.quotations) {
        if (!existingDocIds.has(q.id)) {
          documents.unshift({
            id: q.id,
            name: q.name,
            templateId: "quotation",
            templateName: "ใบเสนอราคา (Quotation)",
            createdBy: q.createdBy || "Admin",
            createdAt: q.createdAt || new Date().toISOString(),
            updatedAt: q.updatedAt || new Date().toISOString(),
            status: q.status || "draft",
            sentTo: q.sentTo || null,
            values: q,
          });
          existingDocIds.add(q.id);
        }
      }
    }

    // Ensure all system default templates are present in customTemplates
    const customTemplates = Array.isArray(parsed.customTemplates) && parsed.customTemplates.length > 0
      ? [...parsed.customTemplates]
      : [...DEFAULT_TEMPLATES];
    const existingTmplIds = new Set(customTemplates.map((t) => t.id));
    for (const defTmpl of DEFAULT_TEMPLATES) {
      if (!existingTmplIds.has(defTmpl.id)) {
        customTemplates.push(defTmpl);
        existingTmplIds.add(defTmpl.id);
      }
    }

    const db = {
      fieldProfiles: parsed.fieldProfiles || [],
      documents,
      sentHistory: parsed.sentHistory || [],
      categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : DEFAULT_CATEGORIES,
      customTemplates,
      customTokens: parsed.customTokens || [],
      notifications: parsed.notifications || [],
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {}),
        account: { ...DEFAULT_SETTINGS.account, ...((parsed.settings || {}).account || {}) },
        preferences: { ...DEFAULT_SETTINGS.preferences, ...((parsed.settings || {}).preferences || {}) },
        organization: { ...DEFAULT_SETTINGS.organization, ...((parsed.settings || {}).organization || {}) },
        sessions: (parsed.settings || {}).sessions || DEFAULT_SETTINGS.sessions,
      },
    };
    if (!parsed.categories || !parsed.customTemplates || !parsed.settings || !parsed.settings.account || !parsed.notifications || parsed.quotations) {
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
  // Strip out redundant quotations array to enforce single persistence
  const { quotations, ...cleanData } = data;
  const content = JSON.stringify(cleanData, null, 2);
  try {
    await fs.writeFile(`${DB_PATH}.bak`, content, "utf-8");
  } catch {}
  await fs.writeFile(DB_PATH, content, "utf-8");
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
    const docs = (db.documents || []).filter((d) => d.templateId === "quotation");
    return docs.map((d) => {
      const vals = d.values || {};
      return {
        ...vals,
        id: d.id,
        name: d.name,
        templateId: "quotation",
        templateName: d.templateName || "ใบเสนอราคา (Quotation)",
        status: d.status,
        sentTo: d.sentTo,
        createdBy: d.createdBy,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      };
    });
  },
  async getById(id) {
    const db = await readDb();
    const doc = (db.documents || []).find((d) => d.id === id);
    if (!doc) return null;
    const vals = doc.values || {};
    return {
      ...vals,
      id: doc.id,
      name: doc.name,
      templateId: "quotation",
      templateName: doc.templateName || "ใบเสนอราคา (Quotation)",
      status: doc.status,
      sentTo: doc.sentTo,
      createdBy: doc.createdBy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  },
  async create(data) {
    const db = await readDb();
    db.documents = db.documents || [];
    const existingQuotations = db.documents
      .filter((d) => d.templateId === "quotation")
      .map((d) => d.values || d);

    const quotationNo = data.quotationNo || generateQuotationNo(existingQuotations);
    const revision = data.revision || "01";
    const todayStr = new Date().toLocaleDateString("th-TH");
    const now = new Date().toISOString();
    const docId = data.id || `qt-${Date.now()}`;

    const quotationRecord = {
      id: docId,
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
      createdBy: data.createdBy || "Admin",
      createdAt: now,
      updatedAt: now,
      status: data.sentTo ? "sent" : (data.status || "draft"),
      sentTo: data.sentTo || null,
    };

    const docEntry = {
      id: quotationRecord.id,
      name: quotationRecord.name,
      templateId: "quotation",
      templateName: "ใบเสนอราคา (Quotation)",
      createdBy: quotationRecord.createdBy,
      createdAt: quotationRecord.createdAt,
      updatedAt: quotationRecord.updatedAt,
      status: quotationRecord.status,
      sentTo: quotationRecord.sentTo,
      values: quotationRecord,
    };

    const docIdx = db.documents.findIndex((d) => d.id === quotationRecord.id);
    if (docIdx >= 0) {
      db.documents[docIdx] = docEntry;
    } else {
      db.documents.unshift(docEntry);
    }

    await writeDb(db);
    return quotationRecord;
  },
  async update(id, data) {
    const db = await readDb();
    db.documents = db.documents || [];
    const idx = db.documents.findIndex((d) => d.id === id);
    if (idx === -1) {
      return this.create({ id, ...data });
    }

    const currentDoc = db.documents[idx];
    const currentValues = currentDoc.values || {};
    const updatedValues = {
      ...currentValues,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    db.documents[idx] = {
      ...currentDoc,
      name: updatedValues.name || currentDoc.name,
      status: updatedValues.status || currentDoc.status,
      sentTo: updatedValues.sentTo !== undefined ? updatedValues.sentTo : currentDoc.sentTo,
      updatedAt: new Date().toISOString(),
      values: updatedValues,
    };

    await writeDb(db);
    return updatedValues;
  },
  async createRevision(id) {
    const db = await readDb();
    db.documents = db.documents || [];
    const source = db.documents.find((d) => d.id === id);
    if (!source) throw new Error("ไม่พบใบเสนอราคาต้นฉบับ");

    const sourceData = source.values || source;
    const currentRevNum = parseInt(sourceData.revision || "1", 10);
    const nextRevNum = isNaN(currentRevNum) ? 2 : currentRevNum + 1;
    const nextRevision = String(nextRevNum).padStart(2, "0");

    const todayStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const newId = `qt-${Date.now()}`;
    const quotationNo = sourceData.quotationNo || generateQuotationNo(
      db.documents.filter((d) => d.templateId === "quotation").map((d) => d.values || d)
    );
    const now = new Date().toISOString();

    const revisionRecord = {
      ...sourceData,
      id: newId,
      quotationNo,
      revision: nextRevision,
      name: `ใบเสนอราคา ${quotationNo} Rev.${nextRevision}`,
      quotationDate: todayStr,
      status: "draft",
      parentId: sourceData.id,
      createdAt: now,
      updatedAt: now,
    };

    db.documents.unshift({
      id: revisionRecord.id,
      name: revisionRecord.name,
      templateId: "quotation",
      templateName: "ใบเสนอราคา (Quotation)",
      createdBy: revisionRecord.createdBy || "Admin",
      createdAt: revisionRecord.createdAt,
      updatedAt: revisionRecord.updatedAt,
      status: "draft",
      sentTo: null,
      values: revisionRecord,
    });

    await writeDb(db);
    return revisionRecord;
  },
  async delete(id) {
    const ids = Array.isArray(id) ? id : [id];
    const db = await readDb();
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

    // Resolve templateName from database customTemplates if not explicitly provided
    let resolvedTemplateName = templateName;
    if (!resolvedTemplateName && templateId) {
      if (db.customTemplates && db.customTemplates[templateId]?.name) {
        resolvedTemplateName = db.customTemplates[templateId].name;
      } else if (db.customTemplates) {
        const found = Object.values(db.customTemplates).find((t) => t.id === templateId);
        if (found?.name) resolvedTemplateName = found.name;
      }
    }

    const record = {
      id: docId,
      verificationToken,
      name,
      templateId,
      templateName: resolvedTemplateName || templateName || null,
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

    let resolvedTemplateName = templateName;
    if (resolvedTemplateName === undefined && templateId && (!current.templateName || templateId !== current.templateId)) {
      if (db.customTemplates && db.customTemplates[templateId]?.name) {
        resolvedTemplateName = db.customTemplates[templateId].name;
      } else if (db.customTemplates) {
        const found = Object.values(db.customTemplates).find((t) => t.id === templateId);
        if (found?.name) resolvedTemplateName = found.name;
      }
    }

    db.documents[idx] = {
      ...current,
      ...(name !== undefined ? { name } : {}),
      ...(templateId !== undefined ? { templateId } : {}),
      ...(resolvedTemplateName !== undefined ? { templateName: resolvedTemplateName } : {}),
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
    await writeDb(db);
    return { success: true };
  },
};

export const jsonSentHistoryRepo = {
  async getAll() {
    const db = await readDb();
    const history = db.sentHistory || [];
    const docMap = new Map((db.documents || []).map((d) => [d.id, d]));
    return history.map((item) => {
      const doc = item.documentId ? docMap.get(item.documentId) : null;
      return {
        ...item,
        values: item.values && Object.keys(item.values).length > 0
          ? item.values
          : (doc?.values || {}),
      };
    });
  },
  async create({ documentId, name, templateId, templateName, sentTo, subject, status = "sent", values }) {
    const db = await readDb();
    const now = new Date().toISOString();
    const record = {
      id: `history-${Date.now()}`,
      documentId: documentId || null,
      name,
      templateId: templateId || "document",
      templateName: templateName || "เอกสาร",
      subject: subject || name,
      createdBy: "Admin",
      createdAt: now,
      sentAt: now,
      status: status || "sent",
      sentTo: sentTo || null,
      // Store values only if no linked documentId exists to prevent duplication
      ...(documentId ? {} : { values: values || {} }),
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
      available: true,
      href: `/create/custom?categoryId=${id}`,
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
    margin = null,
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
      margin: margin || (theme?.marginMm !== undefined ? { mm: theme.marginMm, px: theme.marginPx } : null),
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
      ...(data.margin !== undefined ? { margin: data.margin } : {}),
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


export const jsonSettingsRepo = {
  async get() {
    const db = await readDb();
    const current = db.settings || {};
    return {
      ...DEFAULT_SETTINGS,
      ...current,
      account: { ...DEFAULT_SETTINGS.account, ...(current.account || {}) },
      preferences: { ...DEFAULT_SETTINGS.preferences, ...(current.preferences || {}) },
      organization: { ...DEFAULT_SETTINGS.organization, ...(current.organization || {}) },
      sessions: current.sessions || DEFAULT_SETTINGS.sessions,
    };
  },
  async update(patch) {
    const db = await readDb();
    const current = await this.get();

    const updated = {
      ...current,
      ...patch,
      account: patch.account ? { ...current.account, ...patch.account } : current.account,
      preferences: patch.preferences ? { ...current.preferences, ...patch.preferences } : current.preferences,
      organization: patch.organization ? { ...current.organization, ...patch.organization } : current.organization,
      sessions: patch.sessions !== undefined ? patch.sessions : current.sessions,
    };

    // Keep legacy top-level in sync if preferences or language/theme were updated
    if (patch.language) {
      updated.language = patch.language;
      updated.preferences.language = patch.language;
    }
    if (patch.theme) {
      updated.theme = patch.theme;
      updated.preferences.theme = patch.theme;
    }
    if (patch.preferences?.language) {
      updated.language = patch.preferences.language;
    }
    if (patch.preferences?.theme) {
      updated.theme = patch.preferences.theme;
    }

    db.settings = updated;
    await writeDb(db);
    return updated;
  }
};

export const jsonCustomTokensRepo = {
  async getAll() {
    const db = await readDb();
    return db.customTokens || [];
  },
  async create({ key, label, example = "", scope = "document", category = "custom" }) {
    const db = await readDb();
    db.customTokens = db.customTokens || [];

    // Validate key format (lowercase letters, digits, underscores only)
    const cleanKey = (key || "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!cleanKey) throw new Error("กรุณาระบุรหัสตัวแปร (key)");
    if (!label?.trim()) throw new Error("กรุณาระบุชื่อตัวแปร (label)");

    // Prevent duplicate keys
    const existing = db.customTokens.find((t) => t.key === cleanKey);
    if (existing) throw new Error(`ตัวแปร {{${cleanKey}}} มีอยู่แล้วในระบบ`);

    const validScopes = ["document", "entity"];
    const safeScope = validScopes.includes(scope) ? scope : "document";

    const newToken = {
      id: `ctok-${Date.now()}`,
      key: cleanKey,
      label: label.trim(),
      example: example?.trim() || "",
      scope: safeScope,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.customTokens.push(newToken);
    await writeDb(db);
    return newToken;
  },
  async delete(id) {
    const db = await readDb();
    db.customTokens = (db.customTokens || []).filter((t) => t.id !== id);
    await writeDb(db);
    return { success: true };
  },
};

export const jsonNotificationsRepo = {
  async getAll() {
    const db = await readDb();
    const list = db.notifications || [];
    return [...list].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
  async getUnreadCount() {
    const db = await readDb();
    const list = db.notifications || [];
    return list.filter((n) => n.unread).length;
  },
  async create({ type = "document_created", title, description = "", link = "/documents", metadata = {} }) {
    const db = await readDb();
    db.notifications = db.notifications || [];
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type,
      title: title || "การแจ้งเตือนใหม่",
      description: description || "",
      timestamp: new Date().toISOString(),
      unread: true,
      link: link || "/documents",
      metadata: metadata || {},
    };
    db.notifications.unshift(newNotif);
    // Keep maximum 50 most recent notifications
    if (db.notifications.length > 50) {
      db.notifications = db.notifications.slice(0, 50);
    }
    await writeDb(db);
    return newNotif;
  },
  async markAsRead(id) {
    const db = await readDb();
    db.notifications = (db.notifications || []).map((n) =>
      n.id === id ? { ...n, unread: false } : n
    );
    await writeDb(db);
    return { success: true };
  },
  async markAllAsRead() {
    const db = await readDb();
    db.notifications = (db.notifications || []).map((n) => ({ ...n, unread: false }));
    await writeDb(db);
    return { success: true };
  },
  async delete(id) {
    const db = await readDb();
    db.notifications = (db.notifications || []).filter((n) => n.id !== id);
    await writeDb(db);
    return { success: true };
  },
  async clearAll() {
    const db = await readDb();
    db.notifications = [];
    await writeDb(db);
    return { success: true };
  },
};


