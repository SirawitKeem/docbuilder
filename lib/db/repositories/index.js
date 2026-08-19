import { jsonFieldProfilesRepo, jsonDocumentsRepo, jsonSentHistoryRepo } from "../adapters/json";

const DB_DRIVER = process.env.DB_DRIVER || "json";

function selectAdapters() {
  switch (DB_DRIVER) {
    case "json":
      return {
        fieldProfilesRepo: jsonFieldProfilesRepo,
        documentsRepo: jsonDocumentsRepo,
        sentHistoryRepo: jsonSentHistoryRepo,
      };
    default:
      throw new Error(`ไม่รู้จัก DB_DRIVER: "${DB_DRIVER}"`);
  }
}

export const { fieldProfilesRepo, documentsRepo, sentHistoryRepo } = selectAdapters();
