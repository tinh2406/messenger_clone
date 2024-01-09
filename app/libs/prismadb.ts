import { PrismaClient } from "@prisma/client";
// import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var prisma: PrismaClient | undefined;
}
const client = globalThis.prisma ||new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

// const client = new PrismaClient().$extends(withAccelerate());
export default client;
