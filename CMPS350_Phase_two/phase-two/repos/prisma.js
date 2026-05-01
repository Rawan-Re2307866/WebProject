import { PrismaLibSql } from "@prisma/adapter-libsql";

 
export default new PrismaClient({
  adapter: new PrismaLibSql({
    url: process.env.DATABASE_URL ?? "",
  }),
  log: ["query"],
});