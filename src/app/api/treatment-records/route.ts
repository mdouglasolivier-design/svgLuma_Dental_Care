import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");

  const where: any = {};
  if (patientId) where.patientId = patientId;

  const records = await prisma.treatmentRecord.findMany({
    where,
    include: {
      doctor: { include: { user: { select: { name: true } } } },
      patient: { include: { user: { select: { name: true } } } },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(records);
}
