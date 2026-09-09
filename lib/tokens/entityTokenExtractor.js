/**
 * entityTokenExtractor.js
 * Helper สำหรับสแกนตัวแปร {{...}} จาก Custom Template canvas
 * และกรองเฉพาะตัวแปรที่มี scope = "entity" ใน customTokens
 */

/**
 * สแกน Fabric canvas pages หาตัวแปร {{token}} ทั้งหมด
 * @param {Array} pages - array of { json: string } from customTemplate.pages
 * @returns {Set<string>} set of token keys (ไม่มี {{ }})
 */
export function scanCanvasTokens(pages = []) {
  const tokenSet = new Set();
  const pattern = /\{\{([a-zA-Z0-9_]+)\}\}/g;

  for (const page of pages) {
    const json = typeof page.json === "string" ? page.json : JSON.stringify(page.json || "");
    let match;
    while ((match = pattern.exec(json)) !== null) {
      tokenSet.add(match[1]);
    }
  }
  return tokenSet;
}

/**
 * กรองตัวแปรเฉพาะ scope="entity" จาก custom tokens list
 * @param {Array} customTokens - from GET /api/custom-tokens
 * @returns {Object} map of key -> token definition
 */
export function buildEntityTokenMap(customTokens = []) {
  const map = {};
  customTokens.forEach((t) => {
    if (t.scope === "entity") map[t.key] = t;
  });
  return map;
}

/**
 * ส่งคืน field definitions สำหรับ Custom Template ที่เป็น entity tokens
 * ใช้ใน ProfileForm เพื่อสร้าง form fields dynamically
 * @param {Array} pages - customTemplate.pages
 * @param {Array} customTokens - from /api/custom-tokens
 * @returns {Array} array of { key, label, example, scope }
 */
export function extractEntityTokensFromTemplate(pages = [], customTokens = []) {
  const canvasTokens = scanCanvasTokens(pages);
  const entityMap = buildEntityTokenMap(customTokens);

  const result = [];
  canvasTokens.forEach((key) => {
    if (entityMap[key]) {
      result.push({
        key,
        label: entityMap[key].label,
        example: entityMap[key].example || "",
        scope: "entity",
      });
    }
  });
  return result;
}

/**
 * ตรวจสอบว่า Custom Template มีตัวแปร entity ใดบ้าง
 * ใช้เพื่อตัดสินใจว่า template นั้นควรปรากฏใน Compatible Templates ของ Profile หรือไม่
 * @param {Array} pages
 * @param {Array} customTokens
 * @returns {boolean}
 */
export function templateHasEntityTokens(pages = [], customTokens = []) {
  return extractEntityTokensFromTemplate(pages, customTokens).length > 0;
}