import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        accounts: {
          select: {
            provider: true
          }
        }
      },
      orderBy: {
        id: "desc"
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Lỗi tải danh sách tài khoản" }, { status: 500 });
  }
}
