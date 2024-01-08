import { MySession } from "../types";
import prisma from "../libs/prismadb";
export default async (conversationId: string, session: MySession) => {
  if (!session?.user?.id) return null;

  try {
    const conversation = await prisma?.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
    if (conversation?.userIds.includes(session.user.id)) return conversation;
  } catch (error) {
    return null;
  }
};
