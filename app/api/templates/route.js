import { NextResponse } from "next/server";
import { customTemplatesRepo } from "@/lib/db/repositories";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    const templates = await customTemplatesRepo.getAll({ categoryId });
    return NextResponse.json(templates);
  } catch (err) {
    console.error("Error fetching custom templates:", err);
    return NextResponse.json({ error: "Failed to fetch custom templates" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, categoryId, description, icon, badge, status, orientation, theme, blocks } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "กรุณาระบุชื่อเทมเพลต" }, { status: 400 });
    }

    const created = await customTemplatesRepo.create({
      name: name.trim(),
      categoryId: categoryId || "forms",
      description: description || "",
      icon: icon || "FileText",
      badge: badge || "กำหนดเอง",
      status: status || "published",
      orientation: orientation || "portrait",
      theme: theme || {
        primaryColor: "#5542F6",
        backgroundColor: "#FFFFFF",
        hasWatermark: false,
      },
      blocks: Array.isArray(blocks) ? blocks : [],
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Error creating custom template:", err);
    return NextResponse.json({ error: "Failed to create custom template" }, { status: 500 });
  }
}
