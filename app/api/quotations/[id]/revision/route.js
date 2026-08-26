import { quotationsRepo } from "@/lib/db/repositories";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const newRevision = await quotationsRepo.createRevision(id);
    return Response.json(newRevision);
  } catch (error) {
    console.error("Create quotation revision error:", error);
    return Response.json({ error: error.message || "สร้างฉบับปรับปรุงไม่สำเร็จ" }, { status: 500 });
  }
}
