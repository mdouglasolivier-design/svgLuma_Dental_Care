import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// PUT /api/admin/users/[id] — update a user
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, password, phone, role, specialty, bio, rating } = body;

    // Find existing user
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { doctor: true, patient: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check email uniqueness if changed
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
    }

    // Update user
    const updateData: any = {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone: phone || null }),
      ...(role !== undefined && { role }),
    };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Handle role changes
    if (role === "DOCTOR" && !existingUser.doctor) {
      // Create doctor profile if switching to doctor role
      await prisma.doctor.create({
        data: {
          userId: id,
          specialty: specialty || "General Dentistry",
          bio: bio || null,
          rating: rating || 5.0,
        },
      });
    } else if (role === "DOCTOR" && existingUser.doctor) {
      // Update doctor profile
      await prisma.doctor.update({
        where: { id: existingUser.doctor.id },
        data: {
          ...(specialty !== undefined && { specialty }),
          ...(bio !== undefined && { bio }),
          ...(rating !== undefined && { rating: parseFloat(rating) || 5.0 }),
        },
      });
    } else if (role === "PATIENT" && !existingUser.patient) {
      // Create patient profile
      await prisma.patient.create({
        data: { userId: id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] — deactivate a user (remove from login, keep data)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Instead of deleting, change password to prevent login
    // This preserves all relational data
    const randomHash = await bcrypt.hash(Math.random().toString(36), 10);
    await prisma.user.update({
      where: { id },
      data: { password: randomHash, name: "[Deactivated]" },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to deactivate user" }, { status: 500 });
  }
}
