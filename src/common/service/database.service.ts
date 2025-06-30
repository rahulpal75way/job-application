// common/services/database.service.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const initDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to the database (Prisma)");
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1); // Exit the app if DB fails to connect
  }
};

export default prisma;
