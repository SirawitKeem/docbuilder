import { NextResponse } from "next/server";
import { customTemplatesRepo } from "@/lib/db/repositories";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const template = await customTemplatesRepo.getById(id);
    if (!template) {
      return NextResponse.json({ error: "ไม่พบเทมเพลตนี้" }, { status: 404 });
    }
    return NextResponse.json(template);
  } catch (err) {
    console.error("Error fetching template by id:", err);
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await customTemplatesRepo.update(id, body);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating template:", err);
    return NextResponse.json({ error: err.message || "Failed to update template" }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await customTemplatesRepo.delete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting template:", err);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}
