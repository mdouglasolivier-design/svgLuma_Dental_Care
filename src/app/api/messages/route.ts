import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const messages = await prisma.message.findMany({
    orderBy: { timestamp: "asc" },
  });
  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { content, threadId, senderId } = body;

  const msg = await prisma.message.create({
    data: {
      threadId: threadId || "thread-1",
      senderId: senderId || "default-patient",
      content,
    },
  });

  return NextResponse.json(msg, { status: 201 });
}
