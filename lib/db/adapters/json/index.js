import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");
const defaultData = { fieldProfile: {}, documents: [] };

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw);
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

/** @type {import('../../repositories/types').FieldProfileRepo} */
export const jsonFieldProfileRepo = {
  async get() {
    const db = await readDb();
    return db.fieldProfile || {};
  },
  async save(values) {
    const db = await readDb();
    db.fieldProfile = values;
    await writeDb(db);
    return db.fieldProfile;
  },
};

/** @type {import('../../repositories/types').DocumentsRepo} */
export const jsonDocumentsRepo = {
  async getAll() {
    const db = await readDb();
    return db.documents || [];
  },
  async create({ name, templateId, templateName, sentTo }) {
    const db = await readDb();
    const record = {
      id: `doc-${Date.now()}`,
      name: name || "document.pdf",
      templateId: templateId || "nda",
      templateName: templateName || "NDA",
      createdBy: "Admin",
      createdAt: new Date().toISOString(),
      status: sentTo ? "sent" : "draft",
      sentTo: sentTo || null,
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
