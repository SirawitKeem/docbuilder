import { settingsRepo } from "@/lib/db/repositories";
import { NextResponse } from "next/server";

export async function GET() {
  const settings = await settingsRepo.get();
  return NextResponse.json(settings);
}

export async function PATCH(request) {
  const body = await request.json();
  // Only allow known fields
  const allowedFields = ['language', 'currency', 'theme'];
  const patch = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      patch[key] = body[key];
    }
  }
  const updated = await settingsRepo.update(patch);
  return NextResponse.json(updated);
}
