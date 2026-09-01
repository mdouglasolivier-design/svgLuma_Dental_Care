require("dotenv/config");
const { PrismaClient } = require("../src/generated/prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Services ──────────────────────────────────────────
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: "Preventive Care",
        description: "Routine checkups, cleanings, and exams to keep your teeth and gums healthy.",
        duration: 60,
        category: "Preventive",
        icon: "shield-check",
      },
    }),
    prisma.service.create({
      data: {
        name: "Cosmetic Dentistry",
        description: "Enhance your smile with veneers, bonding, contouring, and more.",
        duration: 90,
        category: "Cosmetic",
        icon: "sparkles",
      },
    }),
    prisma.service.create({
      data: {
        name: "Invisalign",
        description: "Straighten your teeth comfortably with clear, removable aligners.",
        duration: 45,
        category: "Orthodontics",
        icon: "align-left",
      },
    }),
    prisma.service.create({
      data: {
        name: "Teeth Whitening",
        description: "Safe, effective whitening treatments for a brighter, more confident smile.",
        duration: 60,
        category: "Cosmetic",
        icon: "sun",
      },
    }),
    prisma.service.create({
      data: {
        name: "Dental Implants",
        description: "Permanent, natural-looking replacements for missing teeth.",
        duration: 120,
        category: "Restorative",
        icon: "circle-dot",
      },
    }),
    prisma.service.create({
      data: {
        name: "Pediatric Dentistry",
        description: "Gentle, friendly care designed to keep your child's smile healthy.",
        duration: 45,
        category: "Pediatric",
        icon: "baby",
      },
    }),
    prisma.service.create({
      data: {
        name: "Emergency Care",
        description: "Same-day appointments for dental pain, injuries, and other urgent issues.",
        duration: 30,
        category: "Emergency",
        icon: "siren",
      },
    }),
  ]);

  // ─── Locations ─────────────────────────────────────────
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: "Luma Dental Care – Downtown",
        address: "123 Smile Street, Suite 200",
        city: "Cityville",
        state: "CA",
        zip: "90210",
        phone: "(555) 123-4567",
        hours: JSON.stringify({
          "Mon-Fri": "9:00 AM – 6:00 PM",
          Saturday: "9:00 AM – 2:00 PM",
          Sunday: "Closed",
        }),
      },
    }),
    prisma.location.create({
      data: {
        name: "Luma Dental Care – Westside",
        address: "456 Healthy Way, Suite 101",
        city: "Cityville",
        state: "CA",
        zip: "90211",
        phone: "(555) 987-6543",
        hours: JSON.stringify({
          "Mon-Fri": "9:00 AM – 6:00 PM",
          Saturday: "Closed",
          Sunday: "Closed",
        }),
      },
    }),
  ]);

  // ─── Users & Doctors ───────────────────────────────────
  const password = await bcrypt.hash("password123", 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@lumadental.com",
      password,
      role: "ADMIN",
      name: "Admin User",
      phone: "(555) 000-0001",
    },
  });

  const doctorUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: "sarah@lumadental.com",
        password,
        role: "DOCTOR",
        name: "Dr. Sarah Johnson",
        phone: "(555) 111-0001",
      },
    }),
    prisma.user.create({
      data: {
        email: "michael@lumadental.com",
        password,
        role: "DOCTOR",
        name: "Dr. Michael Chen",
        phone: "(555) 111-0002",
      },
    }),
    prisma.user.create({
      data: {
        email: "emily@lumadental.com",
        password,
        role: "DOCTOR",
        name: "Dr. Emily Rodriguez",
        phone: "(555) 111-0003",
      },
    }),
  ]);

  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        userId: doctorUsers[0].id,
        specialty: "General Dentistry",
        rating: 4.9,
        bio: "Over 10 years of experience in general and preventive dentistry.",
        photo: "/doctors/sarah.jpg",
      },
    }),
    prisma.doctor.create({
      data: {
        userId: doctorUsers[1].id,
        specialty: "Cosmetic Dentistry",
        rating: 4.8,
        bio: "Specializing in smile makeovers and cosmetic procedures.",
        photo: "/doctors/michael.jpg",
      },
    }),
    prisma.doctor.create({
      data: {
        userId: doctorUsers[2].id,
        specialty: "Pediatric Dentistry",
        rating: 4.9,
        bio: "Passionate about making dental visits fun for kids.",
        photo: "/doctors/emily.jpg",
      },
    }),
  ]);

  // ─── Patient Users & Profiles ──────────────────────────
  const patientUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: "john@example.com",
        password,
        role: "PATIENT",
        name: "John Smith",
        phone: "(555) 222-0001",
      },
    }),
    prisma.user.create({
      data: {
        email: "jane@example.com",
        password,
        role: "PATIENT",
        name: "Jane Doe",
        phone: "(555) 222-0002",
      },
    }),
    prisma.user.create({
      data: {
        email: "robert@example.com",
        password,
        role: "PATIENT",
        name: "Robert Williams",
        phone: "(555) 222-0003",
      },
    }),
    prisma.user.create({
      data: {
        email: "maria@example.com",
        password,
        role: "PATIENT",
        name: "Maria Garcia",
        phone: "(555) 222-0004",
      },
    }),
  ]);

  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        userId: patientUsers[0].id,
        dateOfBirth: "1990-05-15",
        insurance: "BlueCross BlueShield",
      },
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[1].id,
        dateOfBirth: "1985-08-22",
        insurance: "Delta Dental",
      },
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[2].id,
        dateOfBirth: "1978-03-10",
        insurance: "Aetna",
      },
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[3].id,
        dateOfBirth: "1995-11-30",
        insurance: "Cigna",
      },
    }),
  ]);

  // ─── Appointments ──────────────────────────────────────
  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        patientId: patients[0].id,
        doctorId: doctors[0].id,
        serviceId: services[0].id,
        locationId: locations[0].id,
        date: "2026-09-05",
        time: "09:00",
        status: "CONFIRMED",
        reason: "Routine checkup and cleaning",
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[0].id,
        doctorId: doctors[1].id,
        serviceId: services[1].id,
        locationId: locations[0].id,
        date: "2026-09-15",
        time: "14:00",
        status: "PENDING",
        reason: "Consultation for veneers",
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[1].id,
        doctorId: doctors[0].id,
        serviceId: services[0].id,
        locationId: locations[0].id,
        date: "2026-09-03",
        time: "10:00",
        status: "CONFIRMED",
        reason: "Annual dental exam",
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[2].id,
        doctorId: doctors[2].id,
        serviceId: services[5].id,
        locationId: locations[1].id,
        date: "2026-09-04",
        time: "11:00",
        status: "CONFIRMED",
        reason: "Child dental checkup",
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[3].id,
        doctorId: doctors[0].id,
        serviceId: services[3].id,
        locationId: locations[0].id,
        date: "2026-08-28",
        time: "15:00",
        status: "COMPLETED",
        reason: "Teeth whitening",
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[1].id,
        doctorId: doctors[1].id,
        serviceId: services[4].id,
        locationId: locations[0].id,
        date: "2026-08-20",
        time: "09:00",
        status: "COMPLETED",
        reason: "Implant consultation",
      },
    }),
  ]);

  // ─── Treatment Records ─────────────────────────────────
  await Promise.all([
    prisma.treatmentRecord.create({
      data: {
        patientId: patients[3].id,
        appointmentId: appointments[4].id,
        doctorId: doctors[0].id,
        date: "2026-08-28",
        description: "Professional teeth whitening treatment completed. Patient tolerated procedure well. Results show significant improvement in tooth shade.",
        notes: "Follow up in 2 weeks. Avoid dark foods for 48 hours.",
      },
    }),
    prisma.treatmentRecord.create({
      data: {
        patientId: patients[1].id,
        appointmentId: appointments[5].id,
        doctorId: doctors[1].id,
        date: "2026-08-20",
        description: "Initial implant consultation. X-rays taken. Treatment plan discussed for single-tooth implant in lower right molar area.",
        notes: "Next appointment scheduled for implant placement.",
      },
    }),
  ]);

  // ─── Invoices ──────────────────────────────────────────
  await Promise.all([
    prisma.invoice.create({
      data: {
        patientId: patients[3].id,
        appointmentId: appointments[4].id,
        amount: 350.0,
        status: "PAID",
        description: "Professional Teeth Whitening",
      },
    }),
    prisma.invoice.create({
      data: {
        patientId: patients[1].id,
        appointmentId: appointments[5].id,
        amount: 150.0,
        status: "PAID",
        description: "Implant Consultation & X-Rays",
      },
    }),
    prisma.invoice.create({
      data: {
        patientId: patients[1].id,
        appointmentId: appointments[2].id,
        amount: 120.0,
        status: "UNPAID",
        description: "Annual Dental Exam & Cleaning",
      },
    }),
  ]);

  // ─── Messages ──────────────────────────────────────────
  await Promise.all([
    prisma.message.create({
      data: {
        threadId: "thread-1",
        senderId: patients[0].id,
        content: "Hi, I'd like to reschedule my upcoming appointment on Sept 5th. Is there availability on Sept 8th instead?",
      },
    }),
    prisma.message.create({
      data: {
        threadId: "thread-1",
        senderId: patients[0].id,
        content: "Also, I wanted to ask about payment plans for the veneers consultation.",
        read: true,
      },
    }),
    prisma.message.create({
      data: {
        threadId: "thread-2",
        senderId: patients[1].id,
        content: "Thank you for the implant consultation. I have a few questions about the recovery process.",
      },
    }),
  ]);

  // ─── Contact Messages ──────────────────────────────────
  await Promise.all([
    prisma.contactMessage.create({
      data: {
        name: "Alex Turner",
        phone: "(555) 333-0001",
        email: "alex.turner@email.com",
        message: "I'm looking for a new dentist and would like to know more about your preventive care services.",
        status: "NEW",
      },
    }),
    prisma.contactMessage.create({
      data: {
        name: "Susan Park",
        email: "susan.park@email.com",
        message: "Do you offer evening appointments? I work during the day and have difficulty making it in before 6 PM.",
        status: "NEW",
      },
    }),
    prisma.contactMessage.create({
      data: {
        name: "David Kim",
        phone: "(555) 333-0003",
        email: "david.kim@email.com",
        message: "I need emergency dental care. I broke a tooth and it's causing a lot of pain. Do you have same-day availability?",
        status: "RESPONDED",
      },
    }),
  ]);

  console.log("Seed data created successfully!");
  console.log(`  - ${services.length} services`);
  console.log(`  - ${locations.length} locations`);
  console.log(`  - ${doctors.length} doctors`);
  console.log(`  - ${patients.length} patients`);
  console.log(`  - ${appointments.length} appointments`);
  console.log("\nTest accounts (password: password123):");
  console.log("  Admin:   admin@lumadental.com");
  console.log("  Doctor:  sarah@lumadental.com");
  console.log("  Patient: john@example.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
