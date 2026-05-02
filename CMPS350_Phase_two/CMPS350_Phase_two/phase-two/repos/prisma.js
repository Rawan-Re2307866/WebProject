import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/client/index.js";

export default new PrismaClient({
  adapter: new PrismaLibSql({
    url: `file:${process.cwd()}/prisma/db/dev.db`,
  }),
  log: ["query"],
});