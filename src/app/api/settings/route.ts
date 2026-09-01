import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/settings — public, returns all site settings
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    // Convert array to key-value object for easy consumption
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

// PUT /api/settings — admin-only, updates settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updates: { key: string; value: string }[] = [];

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        updates.push({ key, value });
      }
    }

    for (const update of updates) {
      await prisma.siteSetting.upsert({
        where: { key: update.key },
        update: { value: update.value },
        create: { key: update.key, value: update.value },
      });
    }

    // Return updated settings
    const settings = await prisma.siteSetting.findMany();
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
