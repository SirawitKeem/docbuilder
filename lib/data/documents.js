export async function getRecentDocuments(limit = 5) {
  try {
    const res = await fetch("/api/documents");
    if (!res.ok) return [];
    const docs = await res.json();
    return docs.slice(0, limit);
  } catch {
    return [];
  }
}

export async function getDocumentHistory() {
  try {
    const res = await fetch("/api/documents");
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}