import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/database/[table]/[id] — update a record
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  const { table, id } = await params;
  const tableKey = table.charAt(0).toLowerCase() + table.slice(1);
  const body = await req.json();

  // Remove relations from update data
  const { patient, doctor, user, service, location, ...updateData } = body;

  const validModels: Record<string, any> = {
    user: prisma.user,
    patient: prisma.patient,
    doctor: prisma.doctor,
    service: prisma.service,
    location: prisma.location,
    appointment: prisma.appointment,
    treatmentRecord: prisma.treatmentRecord,
    invoice: prisma.invoice,
    message: prisma.message,
    contactMessage: prisma.contactMessage,
    siteSetting: prisma.siteSetting,
    testimonial: prisma.testimonial,
    teamMember: prisma.teamMember,
    pageImage: prisma.pageImage,
  };

  const model = validModels[tableKey];
  if (!model) {
    return NextResponse.json({ error: "Invalid table: " + table }, { status: 400 });
  }

  try {
    // Convert numeric fields
    if (updateData.rating) updateData.rating = parseFloat(updateData.rating);
    if (updateData.duration) updateData.duration = parseInt(updateData.duration);
    if (updateData.amount) updateData.amount = parseFloat(updateData.amount);
    if (updateData.rating) updateData.rating = parseFloat(updateData.rating);
    if (updateData.sortOrder !== undefined) updateData.sortOrder = parseInt(updateData.sortOrder);

    // Convert boolean fields
    for (const key of Object.keys(updateData)) {
      if (updateData[key] === "true") updateData[key] = true;
      if (updateData[key] === "false") updateData[key] = false;
    }

    const record = await model.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ record });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/database/[table]/[id] — delete a record
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  const { table, id } = await params;
  const tableKey = table.charAt(0).toLowerCase() + table.slice(1);

  const validModels: Record<string, any> = {
    user: prisma.user,
    patient: prisma.patient,
    doctor: prisma.doctor,
    service: prisma.service,
    location: prisma.location,
    appointment: prisma.appointment,
    treatmentRecord: prisma.treatmentRecord,
    invoice: prisma.invoice,
    message: prisma.message,
    contactMessage: prisma.contactMessage,
    siteSetting: prisma.siteSetting,
    testimonial: prisma.testimonial,
    teamMember: prisma.teamMember,
    pageImage: prisma.pageImage,
  };

  const model = validModels[tableKey];
  if (!model) {
    return NextResponse.json({ error: "Invalid table: " + table }, { status: 400 });
  }

  try {
    await model.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
