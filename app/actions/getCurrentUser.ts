import getSession from "./getSession";
import prisma from "../libs/prismadb";
export default async () => {
  try {
    const session = await getSession();
    if (!session?.user?.email) return null;

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      cacheStrategy:{
        swr:60,
        ttl:60,
      }
    });

    if (!currentUser) return null;
    return currentUser;
  } catch (error) {}
};
