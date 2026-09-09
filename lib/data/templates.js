import { SYSTEM_CATEGORIES, SYSTEM_SUB_TEMPLATES } from "../templates/catalog.js";

export const CATEGORIES = SYSTEM_CATEGORIES;
export const SUB_TEMPLATES = SYSTEM_SUB_TEMPLATES;

export async function getTemplates() {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn("Failed to fetch /api/categories, falling back:", e);
    }
  }
  return CATEGORIES;
}

export async function getTemplatesByCategory(categoryId) {
  if (!categoryId) return [];
  const normalized = categoryId.toLowerCase();
  const systemItems = (SUB_TEMPLATES[normalized] || []).map((s) => ({
    ...s,
    isSystem: true,
  }));

  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/templates?categoryId=${normalized}`);
      if (res.ok) {
        const customItems = await res.json();
        if (Array.isArray(customItems) && customItems.length > 0) {
          const systemIds = new Set(systemItems.map((s) => s.id));
          const filteredCustom = customItems
            .filter((c) => !systemIds.has(c.id))
            .map((c) => ({
              ...c,
              isCustom: true,
            }));
          return [...systemItems, ...filteredCustom];
        }
      }
    } catch (e) {
      console.warn("Failed to fetch /api/templates by category:", e);
    }
  }
  return systemItems;
}

export function getSubTemplateById(subTemplateId) {
  if (!subTemplateId) return null;
  for (const list of Object.values(SUB_TEMPLATES)) {
    const found = list.find((t) => t.id === subTemplateId);
    if (found) return found;
  }
  return null;
}