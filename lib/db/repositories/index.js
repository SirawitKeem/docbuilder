import { jsonFieldProfilesRepo, jsonDocumentsRepo } from "../adapters/json";

const DB_DRIVER = process.env.DB_DRIVER || "json";

function selectAdapters() {
  switch (DB_DRIVER) {
    case "json":
      return { fieldProfilesRepo: jsonFieldProfilesRepo, documentsRepo: jsonDocumentsRepo };
    default:
      throw new Error(`ไม่รู้จัก DB_DRIVER: "${DB_DRIVER}"`);
  }
}

export const { fieldProfilesRepo, documentsRepo } = selectAdapters();
