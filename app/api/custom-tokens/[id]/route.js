import { NextResponse } from "next/server";
import { customTokensRepo } from "@/lib/db/repositories";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await customTokensRepo.delete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting custom token:", err);
    return NextResponse.json({ error: "Failed to delete custom token" }, { status: 500 });
  }
}