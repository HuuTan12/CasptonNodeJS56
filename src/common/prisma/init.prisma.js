import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  omit: {
    nguoiDung: { password: true },
  },
});

export default prisma;
