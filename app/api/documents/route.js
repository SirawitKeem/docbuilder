import { documentsRepo } from "@/lib/db/repositories";

export async function GET() {
  const documents = await documentsRepo.getAll();
  return Response.json(documents);
}

export async function POST(request) {
  const body = await request.json();
  const record = await documentsRepo.create(body);
  return Response.json(record);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  await documentsRepo.delete(id);
  return Response.json({ success: true });
}
