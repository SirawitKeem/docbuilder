import { listFieldProfiles, getFieldProfile as getProfileById } from "./fieldProfiles";

export async function getFieldProfile(id) {
  if (id) return getProfileById(id);
  const profiles = await listFieldProfiles();
  return profiles.length > 0 ? profiles[0].values : {};
}

export async function saveFieldProfile(values) {
  const profiles = await listFieldProfiles();
  if (profiles.length > 0) {
    return updateFieldProfile(profiles[0].id, { name: profiles[0].name, values });
  }
  return createFieldProfile({ name: "ชุดข้อมูลหลัก", values });
}
