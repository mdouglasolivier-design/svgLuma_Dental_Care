import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, title, bio, photo, email, specialty } = body;
    const maxOrder = await prisma.teamMember.aggregate({ _max: { sortOrder: true } });
    const member = await prisma.teamMember.create({
      data: { name, title, bio, photo, email, specialty, sortOrder: (maxOrder._max.sortOrder || 0) + 1 },
    });
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}
