require("dotenv/config");
const { PrismaClient } = require("../src/generated/prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding testimonials, team members, and page images...");

  // ─── Testimonials ─────────────────────────────────────
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        name: "Sarah M.",
        text: "The team at Luma Dental Care is amazing! They make every visit comfortable and stress-free. Highly recommend!",
        rating: 5,
        sortOrder: 1,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "David K.",
        text: "I was nervous about my implant procedure, but Dr. Chen made it so easy. The results are incredible!",
        rating: 5,
        sortOrder: 2,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Maria G.",
        text: "Best dental experience I've ever had. The staff is friendly, the office is beautiful, and the care is top-notch.",
        rating: 5,
        sortOrder: 3,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "James T.",
        text: "My kids actually look forward to their dental visits now! Dr. Rodriguez is wonderful with children.",
        rating: 5,
        sortOrder: 4,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Emily R.",
        text: "Quick, professional, and painless. The emergency team took care of my broken tooth in no time. Thank you!",
        rating: 5,
        sortOrder: 5,
      },
    }),
  ]);

  // ─── Team Members ─────────────────────────────────────
  const teamMembers = await Promise.all([
    prisma.teamMember.create({
      data: {
        name: "Dr. Sarah Johnson",
        title: "Lead Dentist & Founder",
        bio: "Over 15 years of experience in general and preventive dentistry. Passionate about creating healthy smiles for the entire family.",
        specialty: "General Dentistry",
        email: "sarah@lumadental.com",
        sortOrder: 1,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: "Dr. Michael Chen",
        title: "Cosmetic Dentistry Specialist",
        bio: "Expert in smile makeovers, veneers, and advanced cosmetic procedures. Known for his meticulous attention to detail.",
        specialty: "Cosmetic Dentistry",
        email: "michael@lumadental.com",
        sortOrder: 2,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: "Dr. Emily Rodriguez",
        title: "Pediatric Dentistry Specialist",
        bio: "Passionate about making dental visits fun and comfortable for kids of all ages. Creates a warm, friendly environment.",
        specialty: "Pediatric Dentistry",
        email: "emily@lumadental.com",
        sortOrder: 3,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: "Lisa Wang",
        title: "Lead Dental Hygienist",
        bio: "Dedicated to preventive care and patient education. Helps patients maintain optimal oral health between visits.",
        specialty: "Dental Hygiene",
        sortOrder: 4,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: "Mark Thompson",
        title: "Office Manager",
        bio: "Keeps the clinic running smoothly. Handles scheduling, insurance, and ensures every patient has a seamless experience.",
        specialty: "Administration",
        sortOrder: 5,
      },
    }),
  ]);

  // ─── Page Images (backgrounds for each page) ──────────
  const pageImages = await Promise.all([
    prisma.pageImage.create({
      data: {
        pageKey: "home",
        heroTitle: "Healthy Smiles Start Here",
        heroSubtitle: "Modern care, advanced technology, and a gentle approach — all in one place.",
      },
    }),
    prisma.pageImage.create({
      data: {
        pageKey: "about",
        heroTitle: "Care With Compassion",
        heroSubtitle: "Since 2015, we've been providing gentle, high-quality dental care in a warm, welcoming environment.",
      },
    }),
    prisma.pageImage.create({
      data: {
        pageKey: "services",
        heroTitle: "Treatments Tailored For Every Smile",
        heroSubtitle: "From preventive care to advanced treatments, we offer a full range of services to keep your smile healthy.",
      },
    }),
    prisma.pageImage.create({
      data: {
        pageKey: "booking",
        heroTitle: "Book Your Visit In Minutes",
        heroSubtitle: "Simple. Fast. Convenient. Schedule your appointment in just a few easy steps.",
      },
    }),
    prisma.pageImage.create({
      data: {
        pageKey: "contact",
        heroTitle: "Let's Keep Your Smile Connected",
        heroSubtitle: "Have a question or ready to book your visit? Our team is happy to help.",
      },
    }),
  ]);

  console.log(`  ✓ ${testimonials.length} testimonials`);
  console.log(`  ✓ ${teamMembers.length} team members`);
  console.log(`  ✓ ${pageImages.length} page images`);
  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
