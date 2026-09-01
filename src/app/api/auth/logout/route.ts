import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, role, userId } = body;

    await prisma.activityLog.create({
      data: {
        type: "LOGOUT",
        userId: userId || null,
        email: email || "unknown",
        name: name || null,
        role: role || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: true }); // non-critical
  }
}
