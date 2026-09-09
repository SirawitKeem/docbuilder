import { templateRegistry } from "@/lib/templates/registry";
import { templateHasEntityTokens, scanCanvasTokens } from "@/lib/tokens/entityTokenExtractor";

// ─── System Template Helpers (unchanged) ───────────────────────────────────

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

// ─── Dynamic Template Schemas (System + Custom) ────────────────────────────

/**
 * สร้าง Schema สำหรับ Custom Template โดย Auto-detect entity tokens บน canvas
 * @param {Object} customTemplate - from db.customTemplates[]
 * @param {Array} customTokens - from /api/custom-tokens
 * @returns {Object} schema compatible with ProfileForm
 */
export function buildCustomTemplateSchema(customTemplate, customTokens = []) {
  const canvasTokens = scanCanvasTokens(customTemplate.pages || []);
  const fields = [];

  canvasTokens.forEach((key) => {
    const customDef = customTokens.find((t) => t.key === key && t.scope === "entity");
    if (customDef) {
      fields.push({ sharedKey: key, label: customDef.label, required: false });
    }
  });

  return {
    id: customTemplate.id,
    name: customTemplate.name || `Custom: ${customTemplate.id}`,
    profileSchemaId: "custom",
    isCustomTemplate: true,
    fields,
  };
}

/**
 * Async: ดึง Custom Templates จาก API แล้วรวมกับ System Templates
 * ใช้ใน ProfileForm, profile-data page
 * @param {Array} customTokens - จาก /api/custom-tokens (pass in to avoid double-fetch)
 * @returns {Array} combined template schemas
 */
export async function getDynamicTemplateSchemas(customTokens = []) {
  const systemSchemas = getAllTemplateSchemas();

  try {
    const res = await fetch("/api/templates", { cache: "no-store" });
    if (!res.ok) return systemSchemas;
    const customTemplates = await res.json();

    // กรองเฉพาะ custom templates ที่มีตัวแปร entity อย่างน้อย 1 ตัว
    const customSchemas = customTemplates
      .filter((t) => templateHasEntityTokens(t.pages || [], customTokens))
      .map((t) => buildCustomTemplateSchema(t, customTokens));

    return [...systemSchemas, ...customSchemas];
  } catch {
    return systemSchemas;
  }
}
