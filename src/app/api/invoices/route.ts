import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");

  const where: any = {};
  if (patientId) where.patientId = patientId;

  const invoices = await prisma.invoice.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return NextResponse.json(invoices);
}
