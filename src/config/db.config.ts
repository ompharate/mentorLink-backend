import { PrismaClient } from "@prisma/client";
const prismaClient: PrismaClient = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
export default prismaClient;
