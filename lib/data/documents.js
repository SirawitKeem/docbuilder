export async function getRecentDocuments(limit = 5) {
  try {
    const res = await fetch("/api/documents");
    if (!res.ok) return [];
    const docs = await res.json();
    // Sort documents by createdAt descending (newest first) and limit to 5
    const sorted = [...docs].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
    return sorted.slice(0, limit);
  } catch {
    return [];
  }
}

export async function getDocumentHistory() {
  try {
    const res = await fetch("/api/documents");
    if (!res.ok) return [];
    const docs = await res.json();
    return [...docs].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  } catch {
    return [];
  }
}