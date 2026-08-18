import { jsonFieldProfileRepo, jsonDocumentsRepo } from "../adapters/json";

// อ่านจาก .env — ค่าเริ่มต้นคือ "json" ถ้ายังไม่ตั้งอะไร
const DB_DRIVER = process.env.DB_DRIVER || "json";

function selectAdapters() {
  switch (DB_DRIVER) {
    case "json":
      return { fieldProfileRepo: jsonFieldProfileRepo, documentsRepo: jsonDocumentsRepo };

    // ตอนพร้อมต่อ DB จริง: สร้าง adapters/prisma/index.js ตาม interface เดียวกัน
    // แล้วเปิดคอมเมนต์ 2 บรรทัดนี้ + import ด้านบน
    //
    // case "prisma": {
    //   const { prismaFieldProfileRepo, prismaDocumentsRepo } = require("../adapters/prisma");
    //   return { fieldProfileRepo: prismaFieldProfileRepo, documentsRepo: prismaDocumentsRepo };
    // }

    default:
      throw new Error(`ไม่รู้จัก DB_DRIVER: "${DB_DRIVER}"`);
  }
}

export const { fieldProfileRepo, documentsRepo } = selectAdapters();
