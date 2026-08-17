export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Check if leads table is empty
    let leads = await prisma.$queryRaw<any[]>`
      SELECT id, name, email, phone, source, custom_fields, captured_at
      FROM leads
      ORDER BY captured_at DESC
    `;

    // 2. Seed default leads if empty to provide initial admin view
    if (leads.length === 0) {
      // Find or create default organization
      let orgId = "00000000-0000-0000-0000-000000000000";
      const orgRows = await prisma.$queryRaw<any[]>`SELECT id FROM organizations LIMIT 1`;
      if (orgRows.length > 0) {
        orgId = orgRows[0].id;
      } else {
        await prisma.$executeRaw`
          INSERT INTO organizations (id, name, slug)
          VALUES (${orgId}::uuid, 'CoerZ Org', 'coerz-org')
          ON CONFLICT DO NOTHING
        `;
      }

      // Find or create default chatbot
      let chatbotId = "11111111-1111-1111-1111-111111111111";
      const chatbotRows = await prisma.$queryRaw<any[]>`SELECT id FROM chatbots LIMIT 1`;
      if (chatbotRows.length > 0) {
        chatbotId = chatbotRows[0].id;
      } else {
        await prisma.$executeRaw`
          INSERT INTO chatbots (id, organization_id, name, embed_token)
          VALUES (${chatbotId}::uuid, ${orgId}::uuid, 'Default Bot', 'default-embed-token')
          ON CONFLICT DO NOTHING
        `;
      }

      // Insert default seed leads
      const SEED_LEADS = [
        { name: "Nguyễn Văn An", email: "an.nv@gmail.com", phone: "0901234567", source: "Du Học Bình Dương", status: "hot", score: 85, interest: "Du học Úc - Lớp 10", assignedTo: "Trần Hoàng Duy", lastMessage: "Em muốn biết thêm về học phí" },
        { name: "Trần Thị Mai", email: "mai.tt@yahoo.com", phone: "0912345678", source: "Việt Mỹ English", status: "warm", score: 55, interest: "IELTS 6.5", assignedTo: "Trần Tấn Phúc", lastMessage: "Lịch học như thế nào?" },
        { name: "Lê Hoàng Nam", email: "nam.lh@outlook.com", phone: "0923456789", source: "Du Học Bình Dương", status: "hot", score: 92, interest: "Du học Canada - Đại học", assignedTo: "Phạm Đăng Hoàng Hiếu", lastMessage: "Cho em xin lịch hẹn tư vấn" },
        { name: "Phạm Minh Tuấn", email: "tuan.pm@gmail.com", phone: "0934567890", source: "Shop ABC", status: "cold", score: 20, interest: "Laptop gaming", assignedTo: "Phạm Thị Hồng Ngân", lastMessage: "Xem thử thôi" },
        { name: "Võ Thị Hồng", email: "hong.vt@gmail.com", phone: "0945678901", source: "Du Học Bình Dương", status: "warm", score: 60, interest: "Du học Nhật - Ngôn ngữ", assignedTo: "Trần Hoàng Duy", lastMessage: "Chi phí khoảng bao nhiêu?" }
      ];

      for (const sl of SEED_LEADS) {
        const custom = {
          status: sl.status,
          score: sl.score,
          interest: sl.interest,
          assignedTo: sl.assignedTo,
          lastMessage: sl.lastMessage
        };
        await prisma.$executeRaw`
          INSERT INTO leads (chatbot_id, name, email, phone, source, custom_fields)
          VALUES (${chatbotId}::uuid, ${sl.name}, ${sl.email}, ${sl.phone}, ${sl.source}, ${JSON.stringify(custom)}::jsonb)
        `;
      }

      // Re-query
      leads = await prisma.$queryRaw<any[]>`
        SELECT id, name, email, phone, source, custom_fields, captured_at
        FROM leads
        ORDER BY captured_at DESC
      `;
    }

    // 3. Map database leads to the frontend Lead format
    const mappedLeads = leads.map(l => {
      let custom: any = {};
      if (l.custom_fields) {
        custom = typeof l.custom_fields === 'string' ? JSON.parse(l.custom_fields) : l.custom_fields;
      }
      return {
        id: l.id,
        name: l.name || "Chương trình ẩn danh",
        email: l.email || "Không có email",
        phone: l.phone || "Không có SĐT",
        source: l.source || "chat",
        status: custom.status || "cold",
        score: Number(custom.score) || 30,
        interest: custom.interest || "Tìm hiểu chung",
        assignedTo: custom.assignedTo || "Chưa gán",
        createdAt: l.captured_at ? new Date(l.captured_at).toISOString().replace('T', ' ').substring(0, 16) : "",
        lastMessage: custom.lastMessage || "Xin chào!"
      };
    });

    return NextResponse.json(mappedLeads);
  } catch (error: any) {
    console.error("Lỗi khi lấy danh sách lead từ Supabase:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
