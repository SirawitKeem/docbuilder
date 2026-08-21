import { contractProfileFieldDefs } from "./contract";
import { quotationProfileFieldDefs } from "./quotation";

export const profileSchemaRegistry = {
  contract: {
    id: "contract",
    label: "ข้อมูลสัญญา",
    description: "ชื่อคู่สัญญา ที่อยู่ ผู้ลงนาม — ใช้กับเอกสารสัญญาทุกประเภท",
    fields: contractProfileFieldDefs,
  },
  quotation: {
    id: "quotation",
    label: "ข้อมูลใบเสนอราคา",
    description: "ข้อมูลลูกค้าและผู้เสนอราคา — ใช้กับใบเสนอราคา",
    fields: quotationProfileFieldDefs,
  },
};

export function getProfileSchema(schemaId) {
  return profileSchemaRegistry[schemaId] || null;
}
