import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/locations
export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get("all") === "true";
  const locations = await prisma.location.findMany({
    where: showAll ? {} : { active: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(locations);
}

// POST /api/locations — admin: create a new location
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, city, state, zip, phone, hours } = body;

    if (!name || !address || !city || !state || !zip || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const location = await prisma.location.create({
      data: {
        name,
        address,
        city,
        state,
        zip,
        phone,
        hours: hours || "{}",
        active: true,
      },
    });

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}
