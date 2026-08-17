const documents = [
  {
    id: "doc-1",
    name: "NDA_2024-05-17_ClientABC.pdf",
    templateId: "nda",
    templateName: "NDA",
    createdBy: "Admin",
    createdAt: "2024-05-17T10:30:00",
    status: "sent", // sent | draft | cancelled
    sentTo: "clientabc@example.com",
  },
  {
    id: "doc-2",
    name: "NDA_2024-05-16_ClientXYZ.pdf",
    templateId: "nda",
    templateName: "NDA",
    createdBy: "Admin",
    createdAt: "2024-05-16T15:45:00",
    status: "draft",
  },
];

export async function getRecentDocuments(limit = 5) {
  await new Promise((r) => setTimeout(r, 100));
  return [...documents]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}

export async function getDocumentHistory() {
  await new Promise((r) => setTimeout(r, 100));
  return [...documents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// เรียกตอนส่งอีเมลสำเร็จจริง — ตอนนี้แค่ push เข้า array ใน memory (หายเมื่อ refresh)
// พอมี DB จริง เปลี่ยนเป็น INSERT query ตรงนี้ที่เดียว
export async function createDocumentRecord({ name, templateId, templateName, sentTo }) {
  const record = {
    id: `doc-${Date.now()}`,
    name,
    templateId,
    templateName,
    createdBy: "Admin",
    createdAt: new Date().toISOString(),
    status: sentTo ? "sent" : "draft",
    sentTo,
  };
  documents.unshift(record);
  return record;
}