import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    where: { active: true },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { rating: "desc" },
  });

  const mapped = doctors.map((d) => ({
    id: d.id,
    name: d.user.name,
    email: d.user.email,
    specialty: d.specialty,
    rating: d.rating,
    bio: d.bio,
    photo: d.photo,
  }));

  return NextResponse.json(mapped);
}
