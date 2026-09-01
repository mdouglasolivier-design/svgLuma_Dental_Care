require("dotenv/config");
const { PrismaClient } = require("../src/generated/prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  // Create receptionist user
  const user = await prisma.user.upsert({
    where: { email: "reception@lumadental.com" },
    update: {},
    create: {
      email: "reception@lumadental.com",
      password,
      role: "RECEPTIONIST",
      name: "Reception Desk",
      phone: "(555) 000-0002",
    },
  });

  console.log("Created receptionist user:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
