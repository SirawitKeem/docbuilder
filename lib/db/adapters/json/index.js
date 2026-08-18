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
    const profile = db.fieldProfile || {};
    const defaultFallbackValues = {
      contract_location: profile.contract_location || "กรุงเทพมหานคร",
      contract_date_day: profile.contract_date_day || "18",
      contract_date_month: profile.contract_date_month || "สิงหาคม",
      contract_date_year: profile.contract_date_year || "2569",
      disclosing_party_name: profile.our_company_name || "บริษัท เครสท์ เซนโด จำกัด",
      disclosing_signatory_name: profile.our_signatory_name || "นายศรายุทธ โกสิยารักษ์",
      disclosing_signatory_position: profile.our_signatory_position || "CEO/Founder",
      receiving_party_name: profile.counterparty_name || "บริษัท อินโนเว็กซ์ โซลูชั่นส์ จำกัด",
      receiving_party_address: profile.counterparty_address || "เลขที่ 8/40 เดอะ คอนเนค 37 ซอยช่างอากาศอุทิศ 10 แขวงดอนเมือง เขตดอนเมือง กรุงเทพมหานคร 10210",
      receiving_signatory_name: profile.counterparty_signatory_name || "นายธนภัทร เจริญทรัพย์",
      receiving_signatory_position: profile.counterparty_signatory_position || "Procurement Officer",
      reseller_name: profile.counterparty_name || "บริษัท อินโนเว็กซ์ โซลูชั่นส์ จำกัด",
      reseller_signatory_name: profile.counterparty_signatory_name || "นายธนภัทร เจริญทรัพย์",
      reseller_signatory_position: profile.counterparty_signatory_position || "Procurement Officer",
    };

    return (db.documents || []).map((doc) => ({
      ...doc,
      values: doc.values && Object.keys(doc.values).length > 0 ? doc.values : defaultFallbackValues,
    }));
  },
  async create({ name, templateId, templateName, sentTo, values }) {
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
