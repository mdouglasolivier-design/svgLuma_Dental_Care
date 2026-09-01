import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, text, rating, avatar } = body;
    const maxOrder = await prisma.testimonial.aggregate({ _max: { sortOrder: true } });
    const testimonial = await prisma.testimonial.create({
      data: { name, text, rating: rating || 5, avatar, sortOrder: (maxOrder._max.sortOrder || 0) + 1 },
    });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
