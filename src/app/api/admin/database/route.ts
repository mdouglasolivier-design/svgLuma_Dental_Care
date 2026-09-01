import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/database?table=tableName&page=1&search=term
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const search = searchParams.get("search") || "";
  const skip = (page - 1) * pageSize;

  // If no table specified, return list of all tables with record counts
  if (!table) {
    const tables = [
      { name: "User", model: "user" },
      { name: "Patient", model: "patient" },
      { name: "Doctor", model: "doctor" },
      { name: "Service", model: "service" },
      { name: "Location", model: "location" },
      { name: "Appointment", model: "appointment" },
      { name: "TreatmentRecord", model: "treatmentRecord" },
      { name: "Invoice", model: "invoice" },
      { name: "Message", model: "message" },
      { name: "ContactMessage", model: "contactMessage" },
      { name: "SiteSetting", model: "siteSetting" },
      { name: "Testimonial", model: "testimonial" },
      { name: "TeamMember", model: "teamMember" },
      { name: "PageImage", model: "pageImage" },
    ];

    const counts = await Promise.all(
      tables.map(async (t) => {
        const count = await (prisma as any)[t.model].count();
        return { ...t, count };
      })
    );

    return NextResponse.json({ tables: counts });
  }

  // Return records for a specific table (normalize to lowercase)
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

  // Build search conditions based on table
  let where: any = {};
  if (search) {
    const searchFields: Record<string, string[]> = {
      user: ["email", "name", "phone"],
      patient: ["dateOfBirth", "insurance", "notes"],
      doctor: ["specialty", "bio"],
      service: ["name", "description", "category"],
      location: ["name", "address", "city", "state"],
      appointment: ["date", "time", "status", "reason"],
      treatmentRecord: ["description", "notes"],
      invoice: ["description", "status"],
      message: ["content", "threadId"],
      contactMessage: ["name", "email", "message", "status"],
      siteSetting: ["key", "value"],
      testimonial: ["name", "text"],
      teamMember: ["name", "title", "bio", "email", "specialty"],
      pageImage: ["pageKey", "heroTitle", "heroSubtitle"],
    };

    const fields = searchFields[tableKey] || ["id"];
    where = {
      OR: fields.map((f) => ({ [f]: { contains: search } })),
    };
  }

  // Include relations for tables that need them
  const includes: Record<string, any> = {
    user: { patient: true, doctor: true },
    patient: { user: true },
    doctor: { user: true },
    appointment: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } },
      service: true,
      location: true,
    },
  };

  // Determine ordering field - not all tables have createdAt
  const orderField = tableKey === 'siteSetting' || tableKey === 'pageImage' ? 'id' : 'createdAt';

  const [records, total] = await Promise.all([
    model.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { [orderField]: "desc" },
      ...(includes[tableKey] ? { include: includes[tableKey] } : {}),
    }),
    model.count({ where }),
  ]);

  return NextResponse.json({
    records,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
