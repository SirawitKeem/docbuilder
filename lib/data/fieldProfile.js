const STORAGE_KEY = "doc-generator-field-profile";

// ห่อด้วย Promise แม้ localStorage เป็น sync — เพื่อให้ signature เหมือน fetch API จริง
// พอมี backend ค่อยเปลี่ยนเนื้อในเป็น fetch("/api/profile") ที่เดียว ไม่ต้องแก้จุดที่เรียกใช้
export async function getFieldProfile() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function saveFieldProfile(values) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  return values;
}
