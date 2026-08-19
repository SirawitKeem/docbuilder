import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");
const defaultData = { fieldProfiles: [], documents: [], sentHistory: [] };

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      fieldProfiles: parsed.fieldProfiles || [],
      documents: parsed.documents || [],
      sentHistory: parsed.sentHistory || [],
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

export const jsonDocumentsRepo = {
  async getAll() {
    const db = await readDb();
    return db.documents || [];
  },
  async create({ name, templateId, templateName, sentTo, values }) {
    const db = await readDb();
    const record = {
      id: `doc-${Date.now()}`,
      name,
      templateId,
      templateName,
      createdBy: "Admin",
      createdAt: new Date().toISOString(),
      status: sentTo ? "sent" : "draft",
      sentTo: sentTo || null,
      values: values || {},
    };
    db.documents = db.documents || [];
    db.documents.unshift(record);
    await writeDb(db);
    return record;
  },
  async delete(id) {
    const db = await readDb();
    db.documents = (db.documents || []).filter((doc) => doc.id !== id);
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
