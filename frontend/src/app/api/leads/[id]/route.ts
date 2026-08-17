import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // 1. Fetch current lead custom_fields
    const rows = await prisma.$queryRaw<any[]>`
      SELECT custom_fields FROM leads WHERE id = ${id}::uuid
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Lead không tồn tại" }, { status: 404 });
    }

    let currentCustom = {};
    if (rows[0].custom_fields) {
      currentCustom = typeof rows[0].custom_fields === 'string' 
        ? JSON.parse(rows[0].custom_fields) 
        : rows[0].custom_fields;
    }

    // 2. Merge updates (e.g. status)
    const updatedCustom = { ...currentCustom, ...body };

    // 3. Update database
    await prisma.$executeRaw`
      UPDATE leads
      SET custom_fields = ${JSON.stringify(updatedCustom)}::jsonb
      WHERE id = ${id}::uuid
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật lead:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
