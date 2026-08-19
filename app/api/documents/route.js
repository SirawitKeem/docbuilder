import { documentsRepo } from "@/lib/db/repositories";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const doc = await documentsRepo.getById(id);
    if (!doc) return Response.json({ error: "ไม่พบเอกสารนี้" }, { status: 404 });
    return Response.json(doc);
  }

  const documents = await documentsRepo.getAll();
  return Response.json(documents);
}

export async function POST(request) {
  const body = await request.json();
  if (body.id) {
    const existing = await documentsRepo.getById(body.id);
    if (existing) {
      const updated = await documentsRepo.update(body.id, body);
      return Response.json(updated);
    }
  }
  const record = await documentsRepo.create(body);
  return Response.json(record);
}

export async function PUT(request) {
  const body = await request.json();
  if (!body.id) return Response.json({ error: "Missing id" }, { status: 400 });
  const updated = await documentsRepo.update(body.id, body);
  return Response.json(updated);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  await documentsRepo.delete(id);
  return Response.json({ success: true });
}
