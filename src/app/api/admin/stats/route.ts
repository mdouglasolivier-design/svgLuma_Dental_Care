import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const totalPatients = await prisma.patient.count();

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const appointmentsThisWeek = await prisma.appointment.count({
    where: {
      date: {
        gte: weekStart.toISOString().split("T")[0],
        lte: now.toISOString().split("T")[0],
      },
    },
  });

  const invoices = await prisma.invoice.findMany({
    where: { status: "PAID" },
  });
  const revenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  return NextResponse.json({
    totalPatients,
    appointmentsThisWeek,
    revenue,
    satisfactionRate: 98,
  });
}
