export async function getFieldProfile() {
  try {
    const res = await fetch("/api/field-profile");
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export async function saveFieldProfile(values) {
  try {
    const res = await fetch("/api/field-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) return values;
    const data = await res.json();
    return data.fieldProfile || values;
  } catch {
    return values;
  }
}
