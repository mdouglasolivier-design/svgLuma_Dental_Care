import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/admin/users — list all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        patient: { select: { id: true } },
        doctor: { select: { id: true, specialty: true, rating: true, active: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}

// POST /api/admin/users — create a new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, role, specialty, bio, rating } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: role || "DOCTOR",
      },
    });

    // If doctor, create doctor profile
    if (role === "DOCTOR") {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          specialty: specialty || "General Dentistry",
          bio: bio || null,
          rating: rating || 5.0,
          photo: null,
        },
      });
    }

    // If patient, create patient profile
    if (role === "PATIENT") {
      await prisma.patient.create({
        data: {
          userId: user.id,
        },
      });
    }

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 500 });
  }
}
