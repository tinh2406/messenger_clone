import prisma from "../libs/prismadb";
import getSession from "./getSession";
export default async () => {
  const session = await getSession();

  if (!session?.user?.id) {
    return [];
  }

  try {
    const conversations = await prisma?.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: session.user.id,
        },
        NOT: {
          lastMessageAt: null,
        },
      },
      include: {
        users: true,
        lastMessage: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });
    return conversations;
  } catch (error) {
    return [];
  }
};
