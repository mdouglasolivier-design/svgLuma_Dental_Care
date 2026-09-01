import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/services/[id] — admin: update a service
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, duration, category, icon, image, active } = body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(duration !== undefined && { duration: parseInt(duration, 10) }),
        ...(category !== undefined && { category }),
        ...(icon !== undefined && { icon }),
        ...(image !== undefined && { image }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

// DELETE /api/services/[id] — admin: soft-delete a service (set active=false)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Soft delete — just deactivate since appointments may reference it
    await prisma.service.update({
      where: { id },
      data: { active: false },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
