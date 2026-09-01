require("dotenv/config");
const { PrismaClient } = require("../src/generated/prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding site settings...");

  const settings = [
    { key: "clinicName", value: "Luma Dental Care" },
    { key: "tagline", value: "Where smiles come first" },
    { key: "phone", value: "+1 (844) 978-4949" },
    { key: "email", value: "info@lumadental.com" },
    { key: "logo", value: "" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("Site settings seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
