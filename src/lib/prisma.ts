import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  pool: pg.Pool;
};

// Create connection pool (reuse in development)
const pool =
  globalForPrisma.pool ||
  new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

// Create adapter
const adapter = new PrismaPg(pool);

// Create Prisma Client with adapter
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;
