import { fieldRegistry, coreFieldKeys, categoryLabels } from "@/lib/profiles/fieldRegistry";

export { fieldRegistry, coreFieldKeys, categoryLabels };

export const profileFieldDefs = Object.entries(fieldRegistry).map(([id, def]) => ({
  id,
  label: def.label,
  type: def.type,
  placeholder: def.placeholder,
  group: categoryLabels[def.category] || def.category,
}));

export function getProfileFieldDefs() {
  return profileFieldDefs;
}
