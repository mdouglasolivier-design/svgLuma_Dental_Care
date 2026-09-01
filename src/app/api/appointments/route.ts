import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");
  const doctorId = searchParams.get("doctorId");
  const status = searchParams.get("status");

  const where: any = {};
  if (patientId) where.patientId = patientId;
  if (doctorId) where.doctorId = doctorId;
  if (status) where.status = status;

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      patient: { include: { user: { select: { name: true, email: true, phone: true } } } },
      doctor: { include: { user: { select: { name: true } } } },
      service: true,
      location: true,
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(appointments);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, doctorId, locationId, date, time, name, email, phone, reason, patientId } = body;

    if (!serviceId || !doctorId || !locationId || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let finalPatientId = patientId;

    if (!finalPatientId && name && email) {
      const bcrypt = require("bcryptjs");
      // Use patient-provided password if available, otherwise generate a temp one
      const passwordHash = await bcrypt.hash(body.password || ("temp-password-" + Date.now()), 10);

      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            password: passwordHash,
            role: "PATIENT",
            name,
            phone: phone || null,
          },
        });

        const patient = await prisma.patient.create({
          data: { userId: user.id },
        });
        finalPatientId = patient.id;

        // Log registration via booking
        try {
          await prisma.activityLog.create({
            data: {
              type: "REGISTRATION",
              userId: user.id,
              email: user.email,
              name: user.name,
              role: "PATIENT",
              details: "Created during appointment booking",
            },
          });
        } catch (e) { console.error("Activity log error:", e); }
      } else {
        const patient = await prisma.patient.findUnique({ where: { userId: user.id } });
        if (patient) {
          finalPatientId = patient.id;
        }
      }
    }

    if (!finalPatientId) {
      return NextResponse.json({ error: "Could not identify patient" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: finalPatientId,
        doctorId,
        serviceId,
        locationId,
        date,
        time,
        reason: reason || null,
        status: "PENDING",
      },
      include: {
        patient: { include: { user: { select: { name: true, email: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
        service: true,
        location: true,
      },
    });

    // Send confirmation email (non-blocking)
    try {
      const { sendAppointmentConfirmation } = await import("@/lib/email");
      const settings = await prisma.siteSetting.findMany();
      const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));
      
      await sendAppointmentConfirmation({
        patientName: name,
        patientEmail: email,
        doctorName: appointment.doctor.user.name,
        serviceName: appointment.service.name,
        date: appointment.date,
        time: appointment.time,
        locationName: appointment.location.name,
        clinicName: settingsMap.clinicName || "Luma Dental Care",
      });
    } catch (emailError) {
      console.error("Email sending failed (non-critical):", emailError);
    }

    // Log appointment booked
    try {
      await prisma.activityLog.create({
        data: {
          type: "APPOINTMENT_BOOKED",
          userId: null,
          email: email,
          name: name,
          role: "PATIENT",
          details: `Booked with Dr. ${appointment.doctor.user.name} on ${date} at ${time}`,
        },
      });
    } catch (e) { console.error("Activity log error:", e); }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    console.error("Appointment creation error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing appointment id" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        patient: { include: { user: { select: { name: true, email: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
        service: true,
        location: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
