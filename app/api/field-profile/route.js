import { fieldProfileRepo } from "@/lib/db/repositories";

export async function GET() {
  const profile = await fieldProfileRepo.get();
  return Response.json(profile);
}

export async function POST(request) {
  const values = await request.json();
  const saved = await fieldProfileRepo.save(values);
  return Response.json({ success: true, fieldProfile: saved });
}
