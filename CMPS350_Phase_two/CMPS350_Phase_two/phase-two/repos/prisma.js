import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/client/index.js";

export default new PrismaClient({
  adapter: new PrismaLibSql({
    url: process.env.DATABASE_URL ?? "",
  }),
  log: ["query"],
});