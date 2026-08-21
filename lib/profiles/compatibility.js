import { templateRegistry } from "@/lib/templates/registry";

export function getAllTemplateSchemas() {
  return Object.values(templateRegistry).map((entry) => entry.schema);
}

export function getTemplateRequiredKeys(templateId) {
  const entry = templateRegistry[templateId];
  if (!entry || !entry.schema?.fields) return [];
  return entry.schema.fields.filter((f) => f.required && f.sharedKey).map((f) => f.sharedKey);
}

export function getTemplateAllKeys(templateId) {
  const entry = templateRegistry[templateId];
  if (!entry || !entry.schema?.fields) return [];
  return entry.schema.fields.filter((f) => f.sharedKey).map((f) => f.sharedKey);
}

export function checkCompatibility(profileValues, templateId) {
  const required = getTemplateRequiredKeys(templateId);
  const missing = required.filter((k) => !profileValues?.[k]?.trim?.());
  return {
    templateId,
    required,
    missing,
    isComplete: required.length > 0 && missing.length === 0,
  };
}

// คืนเฉพาะเทมเพลตที่ profile นี้เกี่ยวข้องด้วย (มีอย่างน้อย 1 field ตรงกัน หรือสมบูรณ์)
export function getRelevantTemplates(profileValues) {
  return getAllTemplateSchemas()
    .map((schema) => ({
      schema,
      templateId: schema.id,
      ...checkCompatibility(profileValues, schema.id),
    }))
    .filter((r) => r.required.some((k) => profileValues?.[k]?.trim?.()) || r.isComplete);
}
