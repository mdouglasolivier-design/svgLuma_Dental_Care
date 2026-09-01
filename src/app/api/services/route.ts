import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/services — public: active services; admin: all services
export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get("all") === "true";
  const services = await prisma.service.findMany({
    where: showAll ? {} : { active: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(services);
}

// POST /api/services — admin: create a new service
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, duration, category, icon, image } = body;

    if (!name || !description || !duration || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration: parseInt(duration, 10),
        category,
        icon: icon || null,
        image: image || null,
        active: true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
