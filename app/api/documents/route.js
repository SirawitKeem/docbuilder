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
